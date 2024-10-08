---
title: 'How to Think About Security in Next.js'
date: '2024-10-23'
image: 'how-to-think-about-security-in-next-js.webp'
excerpt: 'React Server Components (RSC) in App Router is a novel paradigm that eliminates much of the redundancy and potential risks linked with conventional methods. Given the newness, developers and subsequently security teams may find it challenging to align their existing security protocols with this model.'
isFeatured: true
---

React Server Components (RSC) in App Router is a novel paradigm that eliminates much of the redundancy and potential
risks linked with conventional methods. Given the newness, developers and subsequently security teams may find it
challenging to align their existing security protocols with this model.

This document is meant to highlight a few areas to look out for, what protections are built-in, and include a guide for
auditing applications. We focus especially on the risks of accidental data exposure.

### Choosing Your Data Handling Model

React Server Components blur the line between server and client. Data handling is paramount in understanding where
information is processed and subsequently made available.

The first thing we need to do is pick what data handling approach is appropriate for our project.

-   HTTP APIs (recommended for existing large projects / orgs)
-   Data Access Layer (recommended for new projects)
-   Component Level Data Access (recommended for prototyping and learning)
-   We recommend that you stick to one approach and don't mix and match too much. This makes it clear for both developers
    working in your code base and security auditors for what to expect. Exceptions pop out as suspicious.

### HTTP APIs

If you're adopting Server Components in an existing project, the recommended approach is to handle Server Components at
runtime as unsafe/untrusted by default like SSR or within the client. So there is no assumption of an internal network
or zones of trust and engineers can apply the concept of Zero Trust. Instead, you only call custom API endpoints such as
REST or GraphQL using fetch() from Server Components just like if it was executing on the client. Passing along any
cookies.

If you had existing getStaticProps/getServerSideProps connecting to a database, you might want to consolidate the model
and move these to API end points as well so you have one way to do things.

Look out for any access control that assumes fetches from the internal network are safe.

This approach lets you keep existing organizational structures where existing backend teams, specialized in security can
apply existing security practices. If those teams use languages other than JavaScript, that works well in this approach.

It still takes advantage of many of the benefits of Server Components by sending less code to the client and inherent
data waterfalls can execute with low latency.

![A login page with a form](login-page-with-a-form.webp)

### Data Access Layer

Our recommended approach for new projects is to create a separate Data Access Layer inside your JavaScript codebase and
consolidate all data access in there. This approach ensures consistent data access and reducing the chance of
authorization bugs occurring. It's also easier to maintain given you're consolidating into a single library. Possibly
providing better team cohesion with a single programming language. You also get to take advantage of better performance
with lower runtime overhead, the ability to share an in-memory cache across different parts of a request.

You build an internal JavaScript library that provides custom data access checks before giving it to the caller. Similar
to HTTP endpoints but in the same memory model. Every API should accept the current user and check if the user can see
this data before returning it. The principle is that a Server Component function body should only see data that the
current user issuing the request is authorized to have access to.

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
import {getCurrentUser} from './auth';

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

These methods should expose objects that are safe to be transferred to the client as is. We like to call these Data
Transfer Objects (DTO) to clarify that they're ready to be consumed by the client.

![A list of users with their profile pictures and names](list-of-users.webp)

They might only get consumed by Server Components in practice. This creates a layering where security audits can focus
primarily on the Data Access Layer while the UI can rapidly iterate. Smaller surface area and less code to cover makes
it easier to catch security issues.

```js
import {getProfile} from '../../data/user'

export async function Page({params: {slug}}) {
// This page can now safely pass around this profile knowing
// that it shouldn't contain anything sensitive.
    const profile = await getProfile(slug);
...
}
```

Secret keys can be stored in environment variables but only the data access layer should access process.env in this
approach.

_Posted by @sebmarkbage_
