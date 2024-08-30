---
title: 'Next.js 15 RC'
date: '2024-05-23'
image: 'next-js-15-rc.webp'
excerpt: "The Next.js 15 Release Candidate (RC) is now available. This early version allows you to test the latest features before the upcoming stable release."
isFeatured: true
---

The Next.js 15 Release Candidate (RC) is now available. This early version allows you to test the latest features before
the upcoming stable release.

* React: Support for the React 19 RC, React Compiler (Experimental), and hydration error improvements
* Caching: fetch requests, GET Route Handlers, and client navigations are no longer cached by default
* Partial Prerendering (Experimental): New Layout and Page config option for incremental adoption
* next/after (Experimental): New API to execute code after a response has finished streaming
* create-next-app: Updated design and a new flag to enable Turbopack in local development
* Bundling external packages (Stable): New config options for App and Pages Router

Try the Next.js 15 RC today:
```
npm install next@rc react@rc react-dom@rc
```

## React 19 RC

The Next.js App Router is built on the React canary channel for frameworks, which has allowed developers to use and
provide feedback on these new React APIs before the v19 release.

Next.js 15 RC now supports React 19 RC, which includes new features for both the client and server like Actions.

Read the Next.js 15 upgrade guide, the React 19 upgrade guide, and watch the React Conf Keynote to learn more.

![Caching updates](caching-updates.webp)

Making streaming-friendly framework APIs for data fetching, asset loading, and page metadata, as well as taking
advantage of React's newer primitives required large changes to the core architecture of Next.js.

![A Next.js application with a dynamic post](dynamic-post.webp)

Incremental adoption of Partial Prerendering (Experimental)
In Next.js 14, we introduced Partial Prerendering (PPR) - an optimization that combines static and dynamic rendering on
the same page.

Next.js currently defaults to static rendering unless you use dynamic functions such as cookies(), headers(), and
uncached data requests. These APIs opt an entire route into dynamic rendering. With PPR, you can wrap any dynamic UI in
a Suspense boundary. When a new request comes in, Next.js will immediately serve a static HTML shell, then render and
stream the dynamic parts in the same HTTP request.

To allow for incremental adoption, we’ve added an experimental_ppr route config option for opting specific Layouts and
Pages into PPR:

*app/page.jsx*

```js 
import {Suspense} from "react"
import {StaticComponent, DynamicComponent} from "@/app/ui"

export const experimental_ppr = true

export default function Page() {
    return (
        <>
            <StaticComponent/>
            <Suspense fallback={...}>
                <DynamicComponent/>
            </Suspense>
        </>
    );
}
```

To use the new option, you’ll need to set the experimental.ppr config in your next.config.js file to 'incremental':

*next.config.ts*

```js 
const nextConfig = {
    experimental: {
        ppr: 'incremental',
    },
};

module.exports = nextConfig;
```

Once all the segments have PPR enabled, it’ll be considered safe for you to set the ppr value to true, and enable it for
the entire app and all future routes.

We will share more about our PPR roadmap in our Next.js 15 GA blog post.