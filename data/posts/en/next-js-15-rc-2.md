---
title: 'Next.js 15 RC 2'
date: '2024-10-15'
image: 'next-js-15-rc-2.webp'
excerpt: 'The second release candidate of Next.js 15 brings performance improvements, new security features, and TypeScript support in configuration.'
isFeatured: false
---

After the announcement of the first release candidate of Next.js 15 in May, the second release candidate (RC2) has been released, incorporating feedback from the community. Here are the key updates:

1. **@next/codemod for Upgrades**: Allows seamless updates to the latest versions of Next.js and React. The CLI will update dependencies and guide you through the migration process.

2. **Turbopack for Development**: Improved performance and stability for local development. Compared to previous versions, memory usage has been reduced by 25–35%, and large-page compilation is now 30–50% faster.

3. **Asynchronous API Requests (Breaking Change)**: A shift towards asynchronous APIs for handling data such as cookies, headers, params, and searchParams. This change enhances rendering performance and prepares the platform for future optimizations. For now, synchronous access remains available with warnings.

![A dynamic post](dynamic-post.webp)

4. **Enhanced Security for Server Actions**: Server actions now use unpredictable identifiers, preventing accidental function exposure and improving performance by reducing bundle size.

5. **Static Route Indicator**: A visual indicator that displays static routes during development, helping developers optimize page rendering.

6. **_<Form>_ Component**: A new component that extends the standard HTML _<form>_, adding preloading, client-side navigation, and progressive enhancement. This makes forms faster and more efficient without requiring additional code.

7. **TypeScript Support in next.config.ts**: TypeScript is now supported in configuration files, providing autocompletion and type-safe options for Next.js.

![A photo of a chalkboard with the text "React 19 RC"](chalkboard.webp)

8. **instrumentation.js (Stable)**: A new API for observing the server lifecycle, integrating with OpenTelemetry and Sentry to improve performance monitoring and error tracking.

9. **Development and Build Enhancements**: Fast Refresh is now even faster, build times have improved, and static page generation caching has been added, significantly reducing compilation time.

10. **Self-Hosting Improvements**: Expanded control over Cache-Control headers, improved image optimization support, and _sharp_ is now automatically used when running Next.js in standalone mode.

11. **ESLint 9 Support**: Next.js 15 now supports ESLint 9 while maintaining backward compatibility with ESLint 8. This simplifies the transition to the new version and introduces new rules for React hooks usage.

You can try the second release candidate of Next.js 15 today:

```bash
npx @next/codemod@canary upgrade rc
```

Stay tuned for further updates, including caching and performance improvements in future releases.

---

_Authors of [the original post](https://nextjs.org/blog/next-15-rc2): Delba de Oliveira, Zack Tanner_
