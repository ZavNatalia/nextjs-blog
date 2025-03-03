---
title: 'Next.js 15'
date: '2024-10-21'
image: 'next-js-15.webp'
excerpt: 'Next.js 15 is officially stable and ready for production use. This release builds on updates from RC1 and RC2.'
isFeatured: false
---

## Next.js 15 Released: Stable Version for Production

Next.js 15 has been officially released and is ready for production. This release builds upon updates from RC1 and RC2, focusing on stability while introducing a few exciting new features. Try Next.js 15 today:

```bash
# Use the new automatic update CLI tool
npx @next/codemod@canary upgrade latest

# ...or update manually
npm install next@latest react@rc react-dom@rc
```

## Key Features in Next.js 15:

-   **@next/codemod CLI**: Easily upgrade to the latest versions of Next.js and React.
-   **Asynchronous Request APIs (Breaking Change)**: A step towards a simplified rendering and caching model.
-   **Caching Semantics (Breaking Change)**: _fetch_ requests, GET route handlers, and client navigation are no longer cached by default.
-   **React 19 Support**: Compatibility with React 19, experimental React Compiler, and hydration error improvements.
-   **Turbopack Dev (Stable)**: Performance and stability improvements.
-   **Static Route Indicator**: A new visual indicator that displays static routes during development.
-   **unstable_after API (Experimental)**: Executes code after a response stream completes.
-   **instrumentation.js API (Stable)**: New API for observing server lifecycle events.
-   **Enhanced Forms (_next/form_)**: Extends HTML forms with client-side navigation.
-   **_next.config.ts_ Support**: TypeScript support for _next.config.ts_ files.
-   **Self-Hosting Improvements**: More control over Cache-Control headers.
-   **Server Actions Security**: Unpredictable endpoints and removal of unused actions.
-   **External Package Bundling Optimization (Stable)**: New configuration options for App and Pages Router.
-   **ESLint 9 Support**
-   **Development and Build Performance Improvements**

## Seamless Upgrades with @next/codemod CLI

We’ve included codemods (automated code transformations) in every major Next.js release to simplify upgrades. The new enhanced CLI makes upgrading to the latest versions easier:

```bash
npx @next/codemod@canary upgrade latest
```

## Asynchronous Request APIs (Breaking Change)

To prepare for future optimizations, APIs that depend on request data (_cookies_, _headers_, _params_, _searchParams_) are transitioning to asynchronous mode:

```js
import { cookies } from 'next/headers';

export async function AdminPanel() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    // ...
}
```

This is a **breaking change**. A codemod is available to automate migration:

```bash
npx @next/codemod@canary next-async-request-api .
```

## Caching Semantics (Breaking Change)

We’ve changed the default caching behavior:

-   **GET Route Handlers**: No longer cached by default in Next.js 15.
-   **Client Router Cache**: Page components are no longer cached by default during navigation.

You can still enable caching as needed using configuration options.

## React 19 Support

Next.js 15 introduces support for React 19 RC, including the experimental React Compiler and hydration error improvements. Pages Router remains compatible with React 18, allowing for a gradual upgrade path.

## Turbopack Dev (Stable)

We’re excited to announce that _next dev --turbo_ is now stable and ready to speed up your development workflow. We have successfully used it for developing vercel.com, nextjs.org, and other applications with excellent results.

![A futuristic server room](futuristic-server-room.webp)

## Additional Improvements

-   **Static Route Indicator**: Helps identify which routes are static or dynamic during development.
-   **unstable_after API (Experimental)**: Allows execution of code after a response stream is complete, without blocking the main response.
-   **instrumentation.js API (Stable)**: Enables server lifecycle monitoring for performance tracking and error diagnostics.
-   **_<Form>_ Component**: Enhances HTML forms with preloading, client-side navigation, and progressive enhancement.
-   **_next.config.ts_ Support**: Provides type safety and autocompletion for Next.js configuration options.
-   **Self-Hosting Enhancements**: Greater control over Cache-Control directives and image optimization improvements without requiring _sharp_.
-   **Server Actions Security**: Introduced secure, unpredictable action identifiers and removal of unused actions for enhanced security.
-   **External Package Bundling Optimization**: New configuration options for _serverExternalPackages_ and _bundlePagesRouterDependencies_ in App and Pages Router.
-   **ESLint 9 Support**: Backward compatible with ESLint 8.
-   **Performance Enhancements**: Faster builds, improved Fast Refresh, and optimized static generation.

**Full details and upgrade instructions** are available in the official [Next.js 15 documentation](https://nextjs.org/docs/app/building-your-application/upgrading/version-15).

---

_Authors of [the original post](https://nextjs.org/blog/next-15): Delba de Oliveira, Jimmy Lai, Rich Haines_
