---
title: 'Next.js 15 RC'
date: '2024-05-23'
image: 'next-js-15-rc.webp'
excerpt: "The Next.js 15 Release Candidate (RC) is now available. This early version allows you to test the latest features before the upcoming stable release."
isFeatured: true
---

The Next.js 15 Release Candidate (RC) is now available. This early version allows you to test the latest features before
the upcoming stable release.

* **React:** Support for the React 19 RC, React Compiler (Experimental), and hydration error improvements
* **Caching:** fetch requests, GET Route Handlers, and client navigations are no longer cached by default
* **Partial Prerendering (Experimental):** New Layout and Page config option for incremental adoption
* **next/after (Experimental):** New API to execute code after a response has finished streaming
* **create-next-app:** Updated design and a new flag to enable Turbopack in local development
* **Bundling external packages (Stable):** New config options for App and Pages Router

Try the Next.js 15 RC today:

```
npm install next@rc react@rc react-dom@rc
```

### React 19 RC

The Next.js App Router is built on the React canary channel for frameworks, which has allowed developers to use and
provide feedback on these new React APIs before the v19 release.

Next.js 15 RC now supports React 19 RC, which includes new features for both the client and server like Actions.

Read the Next.js 15 upgrade guide, the React 19 upgrade guide, and watch the React Conf Keynote to learn more.

> Note: Some third party libraries may not be compatible with React 19 yet.

![A photo of a chalkboard with the text "React 19 RC"](chalkboard.webp)


### React Compiler (Experimental)
The React Compiler is a new experimental compiler created by the React team at Meta. The compiler understands your code
at a deep level through its understanding of plain JavaScript semantics and the Rules of React, which allows it to add
automatic optimizations to your code. The compiler reduces the amount of manual memoization developers have to do
through APIs such as useMemo and useCallback - making code simpler, easier to maintain, and less error prone.

With Next.js 15, we've added support for the React Compiler.

Install babel-plugin-react-compiler:

```
npm install babel-plugin-react-compiler
```

Then, add experimental.reactCompiler option in next.config.js:

*next.config.ts*

```js 
const nextConfig = {
    experimental: {
        reactCompiler: true,
    },
};

module.exports = nextConfig;
```

Optionally, you can configure the compiler to run in "opt-in" mode as follows:

*next.config.ts*

```js 
const nextConfig = {
    experimental: {
        reactCompiler: {
            compilationMode: 'annotation',
        },
    },
};

module.exports = nextConfig;
```

> Note: The React Compiler is currently only possible to use in Next.js through a Babel plugin, which could result in
> slower build times.

![A photo of a React 19 RC conference](conference.webp)

Learn more about the React Compiler, and the available Next.js config options.

*Posted by @delba_oliveira & @zt1072*