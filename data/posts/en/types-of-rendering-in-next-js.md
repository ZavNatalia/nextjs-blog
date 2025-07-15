---
title: 'Types of Rendering in Next.js'
date: '2025-04-01'
image: 'types-of-rendering-in-next-js.png'
excerpt: 'An overview of the main rendering methods in Next.js 15 — SSG, SSR, ISR, and CSR — with examples, their SEO impact, and streaming capabilities using React Server Components.'
isFeatured: true
---

Next.js 15 offers a flexible rendering system that enables both high performance and strong SEO. In this article, we’ll explore the key rendering methods, their benefits, use cases, SEO impact, and modern streaming support using React Server Components.

## 1. Static Site Generation (SSG)

- HTML is generated at build time
- Very fast loading, great for caching
- Ideal for content that doesn’t change often

### Example:

```js
// app/blog/[slug]/page.tsx
export const dynamic = 'error';

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const {slug} = await params;
  const post = await getPost(slug);
  return <article>{post.title}</article>;
}
```

**_dynamic = 'error'_** — Disabling Dynamic Rendering

If Next.js detects anything that requires dynamic rendering during the rendering process (such as cookies(), headers(), fetch(..., { cache: 'no-store' }), useSearchParams(), etc.), it will throw a build or runtime error.

### Why use it?

- Ensures the page is fully static (SSG)
- Beneficial for SEO and fast loading times
- Helps catch accidental or unexpected dynamic dependencies

## 2. Server-Side Rendering (SSR)

- HTML is generated on each request
- Suitable for frequently updated data

### Example:

```js
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const stats = await fetchStats();
    return <div>Active users: {stats.activeUsers}</div>;
}
```

**_force-dynamic_** forces the page to always be rendered on the server on every request — in other words, it enables Server-Side Rendering (SSR) even when the data could be cached or statically pre-rendered.

If your component uses cookies, headers, useSearchParams, request-time data, or calls unstable_noStore(), Next.js will automatically fall back to dynamic rendering (force-dynamic). However, you can also declare this behavior explicitly using export const dynamic = 'force-dynamic'.

### When and why to use force-dynamic?

- The page depends on data that changes frequently
- You don't want caching to be applied
- You’re making API or database calls that should always return fresh data

## 3. Incremental Static Regeneration (ISR)

- HTML is generated at build time and updated in the background at set intervals
- A compromise between SSG and SSR

### Example:

```js
// app/news/page.tsx
export const revalidate = 60; // update every minute

export default async function NewsPage() {
    const news = await getLatestNews();
    return (
        <ul>
            {news.map((n) => (
                <li key={n.id}>{n.title}</li>
            ))}
        </ul>
    );
}
```

## 4. Client-Side Rendering (CSR)

- The component loads without data and fetches it on the client side
- Used for interactive elements

### Example:

```js
// app/profile/client-profile.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/me')
            .then((res) => res.json())
            .then(setUser);
    }, []);

    if (!user) return <p>Loading...</p>;
    return <p>Hello, {user.name}!</p>;
}
```

## SEO and Rendering

| Method (Full Name)                        | SEO Friendly | Notes                                                |
| ----------------------------------------- | ------------ | ---------------------------------------------------- |
| **SSG** (Static Site Generation)          | Yes          | HTML is pre-rendered — search engines see everything |
| **SSR** (Server-Side Rendering)           | Yes          | HTML is generated per request                        |
| **ISR** (Incremental Static Regeneration) | Yes          | Almost like SSG, but with background updates         |
| **CSR** (Client-Side Rendering)           | No           | HTML is empty — content appears only after JS loads  |

For good SEO, it's best to use SSG, SSR, or ISR. CSR is suitable for supporting components, not for primary pages.

## Streaming and React Server Components

Streaming in Next.js allows parts of a page to be rendered and shown immediately while other components are still loading. This is achieved using _<Suspense>_ and React Server Components.

### Streaming Example:

```js
// app/products/page.tsx
import { Suspense } from 'react';
import FastSection from './FastSection';
import SlowSection from './SlowSection';

export default function ProductsPage() {
    return (
        <>
            <h1>Product Catalog</h1>
            <FastSection />
            <Suspense fallback={<p>Loading recommendations...</p>}>
                <SlowSection />
            </Suspense>
        </>
    );
}
```

```js
// app/products/SlowSection.tsx
export default async function SlowSection() {
    const recommendations = await fetchRecommendations();
    return (
        <div>
            {recommendations.map((r) => (
                <p key={r.id}>{r.title}</p>
            ))}
        </div>
    );
}
```

---

## Conclusion

- Choose the rendering method based on the use case: SSG for static content, SSR for dynamic data, ISR for a hybrid approach, CSR for interactivity.
- For SEO, server-rendered HTML is essential (SSG/SSR/ISR).
- Streaming + Suspense = fast UX and smooth rendering.

Next.js provides incredible flexibility. You can mix strategies, extract interactivity into client components, and build fast, SEO-optimized applications.
