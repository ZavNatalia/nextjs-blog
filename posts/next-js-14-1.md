---
title: 'Next.js 14.1'
date: '2024-01-18'
image: 'next-js-14-1.webp'
excerpt: 'Next.js 14.2 includes development, production, and caching improvements.'
isFeatured: false
---

Next.js 14.1 includes developer experience improvements including:

-   **Improved Self-Hosting:** New documentation and custom cache handler
-   **Turbopack Improvements:** 5,600 tests passing for next dev --turbo
-   **DX Improvements:** Improved error messages, pushState and replaceState support
-   **Parallel & Intercepted Routes:** 20 bug fixes based on your feedback
-   **next/image Improvements:** <picture>, art direction, and dark mode support
    Upgrade today or get started with:

```
npx create-next-app@latest
```

### Improved Self-Hosting

We've heard your feedback for improved clarity on how to self-host Next.js with a Node.js server, Docker container, or static export. We've overhauled our self-hosting documentation on:

-   Runtime environment variables
-   Custom cache configuration for ISR
-   Custom image optimization
-   Middleware
    With Next.js 14.1, we've also stabilized providing custom cache handlers for Incremental Static Regeneration and the more granular Data Cache for the App Router:

_next.config.js_

```js
module.exports = {
    cacheHandler: require.resolve('./cache-handler.js'),
    cacheMaxMemorySize: 0, // disable default in-memory caching
};
```

Using this configuration when self-hosting is important when using container orchestration platforms like Kubernetes, where each pod will have a copy of the cache. Using a custom cache handler will allow you to ensure consistency across all pods hosting your Next.js application.

For instance, you can save the cached values anywhere, like Redis or Memcached. We'd like to thank @neshca for their Redis cache handler adapter and example.

![A laptop with multiple tabs open in a web browser](web-browser.webp)

### Turbopack Improvements

We're continuing to focus on the reliability and performance of local Next.js development:

-   **Reliability:** Turbopack passing the entire Next.js development test suite and dogfooding Vercel's applications
-   **Performance:** Improving Turbopack initial compile times and Fast Refresh times
-   **Memory Usage:** Improving Turbopack memory usage

![Turbopack Improvements](turbopack.webp)

We plan to stabilize next dev --turbo in an upcoming release with it still being opt-in.

_Posted by @huozhi & @feedthejim_
