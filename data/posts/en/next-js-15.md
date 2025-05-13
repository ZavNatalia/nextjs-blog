---
title: 'Next.js 15'
date: '2024-10-21'
image: 'next-js-15.webp'
excerpt: 'Next.js 15 is officially stable and ready for production use. This release builds on updates from RC1 and RC2.'
isFeatured: true
---

## Next.js 15 Released: Stable Version for Production

Next.js 15 has officially been released and is ready for production. This release builds upon updates from RC1 and RC2, with a focus on stability while introducing a few noteworthy new features. Next.js 15 can be tried out today:

```bash
# Use the new automatic update CLI tool
npx @next/codemod@canary upgrade latest

# ...or update manually
npm install next@latest react@rc react-dom@rc
```

## Key Features in Next.js 15

- **@next/codemod CLI**: Simplified upgrades to the latest versions of Next.js and React.
- **Asynchronous Request APIs (Breaking Change)**: A step toward a more streamlined rendering and caching model.
- **Caching Semantics (Breaking Change)**: _fetch_ requests, GET route handlers, and client navigation are no longer cached by default.
- **React 19 Support**: Added compatibility for React 19, including an experimental React Compiler and improved hydration error handling.
- **Turbopack Dev (Stable)**: Enhanced performance and stability.
- **Static Route Indicator**: A new visual indicator for identifying static routes during development.
- **unstable_after API (Experimental)**: Executes code after a response stream completes.
- **instrumentation.js API (Stable)**: Provides an API for observing server lifecycle events.
- **Enhanced Forms (_next/form_)**: Extends HTML forms with client-side navigation.
- **_next.config.ts_ Support**: Adds TypeScript to _next.config.ts_ files.
- **Self-Hosting Improvements**: Offers more control over Cache-Control headers.
- **Server Actions Security**: Introduces unpredictable endpoints and removal of unused actions.
- **External Package Bundling Optimization (Stable)**: New configuration options for the App and Pages Router.
- **ESLint 9 Support**
- **Development and Build Performance Improvements**

## Seamless Upgrades with @next/codemod CLI

Codemods (automated code transformations) have been included in every major Next.js release to facilitate upgrades. A new enhanced CLI now makes transitioning to the latest versions easier:

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

This is a **breaking change**. A codemod is provided to automate migration:

```bash
npx @next/codemod@canary next-async-request-api .
```

## Caching Semantics (Breaking Change)

Default caching behavior has been changed in Next.js 15:

- **GET Route Handlers**: No longer cached by default.
- **Client Router Cache**: Page components are not cached by default when navigating.

Caching can still be enabled using configuration options if necessary.

## React 19 Support

Next.js 15 has introduced support for React 19 RC, including an experimental React Compiler and improved hydration error handling. Compatibility with React 18 is retained in the Pages Router, allowing gradual adoption.

## Turbopack Dev (Stable)

_next dev --turbo_ is now stable and can speed up development workflows. It has already been used in high-profile projects (such as vercel.com and nextjs.org) with excellent results.

![A futuristic server room](futuristic-server-room.webp)

## Additional Improvements

- **Static Route Indicator**: Identifies which routes are static or dynamic during development.
- **unstable_after API (Experimental)**: Permits code execution once a response stream completes, without blocking the main response.
- **instrumentation.js API (Stable)**: Facilitates monitoring of the server lifecycle for performance analysis and error tracking.
- **_<Form>_ Component**: Enhances HTML forms with preloading, client-side navigation, and progressive enhancement.
- **_next.config.ts_ Support**: Introduces type safety and autocompletion for Next.js config settings.
- **Self-Hosting Enhancements**: Provides more detailed control over Cache-Control directives and supports image optimization without _sharp_.
- **Server Actions Security**: Employs secure, unpredictable action identifiers and removal of unused actions for greater protection.
- **External Package Bundling Optimization**: Offers configuration options for _serverExternalPackages_ and _bundlePagesRouterDependencies_ in the App and Pages Router.
- **ESLint 9 Support**: Backward compatible with ESLint 8.
- **Performance Enhancements**: Faster builds, improved Fast Refresh, and optimized static generation.

**Full details and upgrade instructions** can be found in the official [Next.js 15 documentation](https://nextjs.org/docs/app/building-your-application/upgrading/version-15).

---

_Authors of [the original post](https://nextjs.org/blog/next-15): Delba de Oliveira, Jimmy Lai, Rich Haines_
