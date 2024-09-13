---
title: 'Next.js 14'
date: '2023-10-26'
image: 'next-js-14.webp'
excerpt: "As we announced at Next.js Conf, Next.js 14 is our most focused release with:
Turbopack, Server Actions (Stable), Partial Prerendering (Preview), Next.js Learn (New)"
isFeatured: true
---

As we announced at Next.js Conf, Next.js 14 is our most focused release with:

* Turbopack: 5,000 tests passing for App & Pages Router
  * 53% faster local server startup
  * 94% faster code updates with Fast Refresh
* Server Actions (Stable): Progressively enhanced mutations
  * Integrated with caching & revalidating
  * Simple function calls, or works natively with forms
* Partial Prerendering (Preview): Fast initial static response + streaming dynamic content
* Next.js Learn (New): Free course teaching the App Router, authentication, databases, and more.
Upgrade today or get started with:

```
npx create-next-app@latest
```

### Next.js Compiler: Turbocharged
Since Next.js 13, we've been working to improve local development performance in Next.js in both the Pages and App Router.

Previously, we were rewriting next dev and other parts of Next.js to support this effort. We have since changed our approach to be more incremental. This means our Rust-based compiler will reach stability soon, as we've refocused on supporting all Next.js features first.

5,000 integration tests for next dev are now passing with Turbopack, our underlying Rust engine. These tests include 7 years of bug fixes and reproductions.

While testing on [Vercel](https://vercel.com "Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web."), a large Next.js application, we've seen:

* Up to **53.3%** faster local server startup
* Up to **94.7%** faster code updates with Fast Refresh

This benchmark is a practical result of performance improvements you should expect with a large application (and large module graph). With 90% of tests for next dev now passing, you should see faster and more reliable performance consistently when using next dev --turbo.

Once we hit 100% of tests passing, we'll move Turbopack to stable in an upcoming minor release. We'll also continue to support using webpack for custom configurations and ecosystem plugins.

![A Next.js application with a dynamic post.](dynamic-post.webp)

*Posted by @leeerob & @timneutkens*