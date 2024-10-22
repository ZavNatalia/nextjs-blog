---
title: 'How to Think About Security in Next.js'
date: '2024-10-23'
image: 'how-to-think-about-security-in-next-js.webp'
excerpt: 'React Server Components (RSC) in App Router is a novel paradigm that eliminates much of the redundancy and potential risks linked with conventional methods. Given the newness, developers and subsequently security teams may find it challenging to align their existing security protocols with this model.'
isFeatured: true
---

React Server Components (RSC) in App Router is a novel paradigm that eliminates much of the redundancy and potential risks linked with conventional methods. Given the newness, developers and subsequently security teams may find it challenging to align their existing security protocols with this model.

This document is meant to highlight a few areas to look out for, what protections are built-in, and include a guide for auditing applications. We focus especially on the risks of accidental data exposure.

### Choosing Your Data Handling Model

React Server Components blur the line between server and client. Data handling is paramount in understanding where information is processed and subsequently made available.

The first thing we need to do is pick what data handling approach is appropriate for our project.

* HTTP APIs (recommended for existing large projects / orgs)
* Data Access Layer (recommended for new projects)
* Component Level Data Access (recommended for prototyping and learning)

We recommend that you stick to one approach and don't mix and match too much. This makes it clear for both developers working in your code base and security auditors for what to expect. Exceptions pop out as suspicious.

###  HTTP APIs

If you're adopting Server Components in an existing project, the recommended approach is to handle Server Components at runtime as unsafe/untrusted by default like SSR or within the client. So there is no assumption of an internal network or zones of trust and engineers can apply the concept of Zero Trust. Instead, you only call custom API endpoints such as REST or GraphQL using fetch() from Server Components just like if it was executing on the client. Passing along any cookies.

If you had existing getStaticProps/getServerSideProps connecting to a database, you might want to consolidate the model and move these to API end points as well so you have one way to do things.

Look out for any access control that assumes fetches from the internal network are safe.

This approach lets you keep existing organizational structures where existing backend teams, specialized in security can apply existing security practices. If those teams use languages other than JavaScript, that works well in this approach.

It still takes advantage of many of the benefits of Server Components by sending less code to the client and inherent data waterfalls can execute with low latency.

![Abstract 3D representations of the audit process for a Next.js App Router project](audit-of-a-Next-js-App-Router-project.webp)


### Data Access Layer

Our recommended approach for new projects is to create a separate Data Access Layer inside your JavaScript codebase and consolidate all data access in there. This approach ensures consistent data access and reducing the chance of authorization bugs occurring. It's also easier to maintain given you're consolidating into a single library. Possibly providing better team cohesion with a single programming language. You also get to take advantage of better performance with lower runtime overhead, the ability to share an in-memory cache across different parts of a request.

You build an internal JavaScript library that provides custom data access checks before giving it to the caller. Similar to HTTP endpoints but in the same memory model. Every API should accept the current user and check if the user can see this data before returning it. The principle is that a Server Component function body should only see data that the current user issuing the request is authorized to have access to.

From this point, normal security practices for implementing APIs take over.

_data/auth.tsx_

```js
import { cache } from 'react';
import { cookies } from 'next/headers';

// Cached helper methods makes it easy to get the same value in many places
// without manually passing it around. This discourages passing it from Server
// Component to Server Component which minimizes risk of passing it to a Client
// Component.
export const getCurrentUser = cache(async () => {
const token = cookies().get('AUTH_TOKEN');
const decodedToken = await decryptAndValidate(token);
// Don't include secret tokens or private information as public fields.
// Use classes to avoid accidentally passing the whole object to the client.
return new User(decodedToken.id);
});

```


_data/user-dto.tsx_

```js
import 'server-only';
import { getCurrentUser } from './auth';

function canSeeUsername(viewer: User) {
// Public info for now, but can change
return true;
}

function canSeePhoneNumber(viewer: User, team: string) {
// Privacy rules
return viewer.isAdmin || team === viewer.team;
}

export async function getProfileDTO(slug: string) {
// Don't pass values, read back cached values, also solves context and easier to make it lazy

// use a database API that supports safe templating of queries
const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`;
const userData = rows[0];

const currentUser = await getCurrentUser();

// only return the data relevant for this query and not everything
// <https://www.w3.org/2001/tag/doc/APIMinimization>
return {
username: canSeeUsername(currentUser) ? userData.username : null,
phonenumber: canSeePhoneNumber(currentUser, userData.team)
? userData.phonenumber
: null,
};
}
```

These methods should expose objects that are safe to be transferred to the client as is. We like to call these Data Transfer Objects (DTO) to clarify that they're ready to be consumed by the client.

They might only get consumed by Server Components in practice. This creates a layering where security audits can focus primarily on the Data Access Layer while the UI can rapidly iterate. Smaller surface area and less code to cover makes it easier to catch security issues.

```js
import {getProfile} from '../../data/user'
export async function Page({ params: { slug } }) {
// This page can now safely pass around this profile knowing
// that it shouldn't contain anything sensitive.
const profile = await getProfile(slug);
...
}
```

Secret keys can be stored in environment variables but only the data access layer should access process.env in this approach.

![Illustration of HTTP APIs and Zero Trust for a Next.js project](http-apis-and-zero-trust-in-the-context-of-server-components.webp)

### Component Level Data Access
Another approach is to just put your database queries directly in your Server Components. This approach is only appropriate for rapid iteration and prototyping. E.g. for a small product with a small team where everyone is aware of the risks and how to watch for them.

In this approach you'll want to audit your "use client" files carefully. While auditing and reviewing PRs, look at all the exported functions and if the type signature accepts overly broad objects like User, or contains props like token or creditCard. Even privacy sensitive fields like phoneNumber need extra scrutiny. A Client Component should not accept more data than the minimal data it needs to perform its job.

```js
import Profile from './components/profile.tsx';

export async function Page({ params: { slug } }) {
const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`;
const userData = rows[0];
// EXPOSED: This exposes all the fields in userData to the client because
// we are passing the data from the Server Component to the Client.
// This is similar to returning `userData` in `getServerSideProps`
return <Profile user={userData} />;
}
```

```js
'use client';
// BAD: This is a bad props interface because it accepts way more data than the
// Client Component needs and it encourages server components to pass all that
// data down. A better solution would be to accept a limited object with just
// the fields necessary for rendering the profile.
export default async function Profile({ user }: { user: User }) {
return (
<div>
<h1>{user.name}</h1>
...
</div>
);
}
```

Always use parameterized queries, or a db library that does it for you, to avoid SQL injection attacks.


**Автор поста:** [Sebastian Markbåge (@sebmarkbage)](https://twitter.com/sebmarkbage)
