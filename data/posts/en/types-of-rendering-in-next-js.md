---
title: 'Rendering Methods in Next.js'
date: '2025-12-25'
image: 'types-of-rendering-in-next-js.png'
excerpt: 'Core rendering methods in Next.js 15 – SSG, SSR, ISR, CSR – with examples, SEO impact, and streaming capabilities through React Server Components.'
isFeatured: true
---

Next.js 15 provides a flexible rendering system that enables both high performance and strong SEO. In this article, we'll explore the main rendering methods, their advantages, usage patterns, SEO impact, and modern streaming capabilities using React Server Components.

## 1. Static Site Generation (SSG)

- HTML is generated at build time
- Very fast loading, excellent caching
- Used for rarely changing content

#### Example:
```js
// app/blog/[slug]/page.tsx
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;
    const post = await getPost(slug);
    return <article>{post.title}</article>;
}
```

### What does `dynamic = 'force-static'` mean?

This directive **forces** the page to be static. If Next.js detects anything requiring dynamic rendering during page rendering (such as `cookies()`, `headers()`, `fetch(..., { cache: 'no-store' })`, or dynamic parameters without `generateStaticParams()`), it will throw an error at build time.

### Why is this needed?

- Guarantees the page is fully static (SSG)
- Excellent for SEO and maximum loading speed
- Helps identify unexpected dynamic dependencies during development

### Alternative: `dynamic = 'error'`

The `'error'` mode also blocks dynamic rendering but throws an error on any attempt to use dynamic functions. Use `'force-static'` for explicit static generation.

## 2. Server-Side Rendering (SSR)

- HTML is created on every request
- Used for frequently updated data
- Data is always fresh

#### Example:
```js
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const stats = await fetchStats();
    return <div>Active users: {stats.activeUsers}</div>;
}
```

### What does `force-dynamic` mean?

This directive forces the page to **always render on the server for every request** – enabling Server-Side Rendering (SSR), even if data could be cached or pre-rendered.

Next.js automatically applies dynamic rendering if the component uses:
- `cookies()` or `headers()`
- `searchParams` (in Page or Layout)
- `fetch()` with `{ cache: 'no-store' }` or `{ next: { revalidate: 0 } }`
- `unstable_noStore()`

However, you can set this mode explicitly with `export const dynamic = 'force-dynamic'`.

### When to use `force-dynamic`?

- Page depends on constantly changing data
- Fresh data is required on every request
- Using database or API queries that return fresh data
- Need access to request-time data (cookies, headers)

## 3. Incremental Static Regeneration (ISR)

- HTML is created at build time and updated in the background after a specified interval
- Next.js regenerates the page with new data in the background
- Compromise between SSG and SSR: static + data freshness
- Cached versions are served instantly while new ones generate in the background

#### Example with time-based revalidation:
```js
// app/news/page.tsx
export const revalidate = 60; // revalidate every 60 seconds

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

### How does it work?

1. On the first request after the `revalidate` time expires, the user receives the cached version
2. Next.js regenerates the page with new data in the background
3. The next user receives the updated version

### On-Demand Revalidation:

Instead of time intervals, you can update content on events (for example, after publishing an article):
```js
// app/actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateNews() {
  // Revalidate a specific path
  revalidatePath('/news');
  
  // Or revalidate all requests with a specific tag
  revalidateTag('news');
}
```
```js
// app/news/page.tsx
export default async function NewsPage() {
    const news = await fetch('https://api.example.com/news', {
        next: { tags: ['news'] }
    });
    
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

- Component loads without data, then fetches on the client
- Used for interactive components that don't need SEO
- Suitable for personalized content (e.g., user profile)

#### Example:
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

### When to use CSR?

- Interactive widgets (chats, comments, likes)
- Personalized content dependent on authentication
- Data that changes frequently and isn't critical for SEO
- Components requiring browser APIs (localStorage, geolocation, etc.)

## SEO and Rendering

| Method                                    | SEO-Friendly      | Performance        | Comment                                                   |
| ----------------------------------------- | ----------------- | ------------------ | --------------------------------------------------------- |
| **SSG** (Static Site Generation)          | ✅ Excellent      | ✅ Maximum         | HTML ready in advance – search engines see all content    |
| **SSR** (Server-Side Rendering)           | ✅ Excellent      | ⚡ Good            | HTML generated on server for each request                 |
| **ISR** (Incremental Static Regeneration) | ✅ Excellent      | ✅ Very Good       | Like SSG but with automatic updates                       |
| **CSR** (Client-Side Rendering)           | ❌ Poor           | ⚠️ JS-dependent    | Initial HTML empty, content appears after JS loads        |

### SEO Recommendations:

- **For public pages** (blog, products, news) → use SSG or ISR
- **For dynamic content** (dashboards, analytics) → use SSR
- **For interactive elements** (comments, modals) → use CSR
- **Combine approaches**: SSG/SSR for main content + CSR for interactivity

## Streaming and React Server Components

Streaming in Next.js allows displaying parts of the page as they become ready, without waiting for all data to load. This is achieved using `<Suspense>` and React Server Components.

### How Streaming works:

1. Browser receives initial HTML immediately
2. Slow components are temporarily replaced with fallbacks (e.g., skeletons)
3. As data becomes ready, Next.js streams the prepared fragments and replaces fallbacks with actual content

#### Streaming Example:
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
// app/products/SlowSection.tsx (async Server Component)
export default async function SlowSection() {
    // Slow database or API request
    const recommendations = await fetchRecommendations();
    
    return (
        <div>
            <h2>Recommendations</h2>
            {recommendations.map((r) => (
                <p key={r.id}>{r.title}</p>
            ))}
        </div>
    );
}
```

### Key Features:

- `SlowSection` **must be an async Server Component** (without `'use client'`)
- `Suspense` allows Next.js to send HTML for parts of the page immediately
- Users see content faster, even if some data is still loading
- Works great with SSR – page remains SEO-friendly

### Streaming Benefits:

- **Better UX**: users see content faster
- **Granular control**: wrap different page sections in separate `<Suspense>` blocks
- **SEO-compatible**: search engines receive complete HTML after streaming finishes
- **Less JavaScript**: Server Components don't send code to the client

### Additional Capabilities:

- [Granular streaming control](https://nextjs.org/learn/dashboard-app/streaming): wrap individual components to manage loading priorities
- **Loading UI**: use `loading.tsx` files for automatic Suspense boundaries
- **Parallel loading**: multiple `<Suspense>` blocks load simultaneously
```js
// Example with multiple Suspense
<Suspense fallback={<ProductsSkeleton />}>
  <Products />
</Suspense>

<Suspense fallback={<ReviewsSkeleton />}>
  <Reviews />
</Suspense>

<Suspense fallback={<RecommendationsSkeleton />}>
  <Recommendations />
</Suspense>
```

---

## Conclusion

Next.js 15 provides a complete spectrum of rendering methods for any task:

- **SSG** (`force-static`) – maximum performance for static content
- **SSR** (`force-dynamic`) – always fresh data for dynamic pages
- **ISR** (`revalidate`) – balance between SSG speed and SSR freshness
- **CSR** (`'use client'`) – interactivity and personalization

### Key Principles:

✅ Server-rendered HTML is crucial for SEO (SSG/SSR/ISR)  
✅ Streaming + Suspense = fast UX without compromising SEO  
✅ Combine approaches: Server Components for content + Client Components for interactivity  
✅ Use `generateStaticParams()` for static dynamic routes  
✅ On-demand revalidation allows updating ISR pages on events

Next.js offers incredible flexibility: you can combine approaches at the component level, building high-performance, SEO-friendly applications with excellent user experience.