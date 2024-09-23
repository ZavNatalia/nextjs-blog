---
title: 'Next.js 14.2'
date: '2024-04-11'
image: 'next-js-14-2.webp'
excerpt: 'Next.js 14.2 includes development, production, and caching improvements.'
isFeatured: false
---

Next.js 14.2 includes development, production, and caching improvements.

-   **Turbopack** for Development (Release Candidate):\*\* 99.8% tests passing for next dev --turbo.
-   **Build and Production Improvements:** Reduced build memory usage and CSS optimizations.
-   **Caching Improvements:** Configurable invalidation periods with staleTimes.
-   **Error DX Improvements:** Better hydration mismatch errors and design updates.

Upgrade today or get started with:

```
npx create-next-app@latest
```

### Turbopack for Development (Release Candidate)

Over the past few months, we’ve been working on improving local development performance with Turbopack. In version 14.2, the Turbopack Release Candidate is now available for local development:

-   **99.8%** of integrations tests are now passing.
-   We’ve verified the top 300 npm packages used in Next.js applications can compile with Turbopack.
-   All Next.js examples work with Turbopack.
-   We’ve integrated Lightning CSS, a fast CSS bundler and minifier, written in Rust.

![A photo of a room with a whiteboard](whiteboard.webp)

We’ve been extensively dogfooding Turbopack with Vercel’s applications. For example, with vercel.com, a large Next.js app, we've seen:

-   Up to **76.7%** faster local server startup.
-   Up to **96.3%** faster code updates with Fast Refresh.
-   Up to **45.8%** faster initial route compile without caching (Turbopack does not have disk caching yet).

Turbopack continues to be opt-in and you can try it out with:

```
next dev --turbo
```

We will now be focusing on improving memory usage, implementing persistent caching, and next build --turbo.

-   **Memory Usage** - We’ve built low-level tools for investigating memory usage. You can now generate traces that include both performance metrics and broad memory usage information. These traces allows us to investigate performance and memory usage without needing access to your application’s source code.
-   **Persistent Caching** - We’re also exploring the best architecture options, and we’re expecting to share more details in a future release.
-   **next build** - While Turbopack is not available for builds yet, 74.7% of tests are already passing. You can follow the progress at areweturboyet.com/build.

![A digital illustration of a human brain](human-brain.webp)

To see a list of supported and unsupported features in Turbopack, please refer to our documentation.

_Posted by @delba_oliveira & @timneutkens_
