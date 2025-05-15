---
title: 'Turbopack Dev is Now Stable!'
date: '2024-10-21'
image: 'turbopack-dev-is-now-stable.webp'
excerpt: '"next dev --turbo" is now stable and ready to accelerate your development process. It has been used to improve vercel.com, nextjs.org, v0, and all other applications, achieving outstanding results.'
isFeatured: false
---

## **Next.js Announces Turbopack Dev as Stable**

After 8 years of using Webpack, Next.js is officially announcing the stable release of the new Turbopack bundler:

```bash
next dev --turbo
```

For large applications like [Vercel](https://vercel.com), the following improvements have been achieved:

- **Up to 76.7% faster** local server startup
- **Up to 96.3% faster** code updates with Fast Refresh
- **Up to 45.8% faster** initial route compilation without caching

## **History and Motivation**

### **Background**

- Next.js has been used for everything from hobby projects to enterprise applications.
- Webpack was the best choice when Next.js was first launched.
- Over time, Webpack struggled to keep up with the needs of modern web development.
- The community expressed frustration over slow iterations when waiting for routes to load and reflect changes.

### **Optimization Efforts**

- The Next.js team spent significant time optimizing Webpack.
- However, they reached the limit of improvements possible with the existing architecture.
- A new foundation was required to support both existing applications and future innovations.

## **Technical Improvements**

![A cinematic shot of a high-tech facility with multiple screens displaying code and data.](multiple-screens-displaying-code-and-data.webp)

### **1. Route Compilation**

#### **Issues with Webpack:**

- Required separate compilers for the server and browser.
- Code parsing was duplicated.
- No parallelization across CPU cores.
- JavaScript-based architecture introduced inherent limitations.

#### **Turbopack Solutions:**

- A **unified compiler** for all execution environments.
- **"Target transitions"** for efficient processing of Server and Client Components.
- **Parallelized** workload distribution across CPU cores using Rust.
- Optimized **file system operations**.
- Improved **module resolution**.
- Skips work for modules **without side effects**.

### **2. Fast Refresh**

#### **Issues with Webpack:**

- Performance was limited by the number of JavaScript modules.
- For ~30,000 modules, there was a **minimum** of **1-second overhead** per change.
- Linear scalability with module count led to performance degradation.

#### **Improvements with Turbopack:**

- **Refresh speed depends only on the size of the changes.**
- Uses **Turbo Engine** for incremental calculations.
- Based on **decades of research** (including Webpack, Salsa, Parcel, and Adapton).
- **Updates in milliseconds** even for large applications.

### **3. Advanced Tracing**

As Next.js grew in popularity, debugging compiler and memory performance became difficult since users could not always share their codebases.

To solve this, tracing was added inside Next.js. However, with Webpack, it was hard to distinguish between memory usage by the compiler and the application itself.

Turbopack **natively integrates tracing into Turbo Engine**, allowing collection of **time metrics and memory usage tracking** at the function level.

This **advanced tracing** provides **deep performance insights** without requiring access to the full codebase.

To analyze these traces, Next.js now includes a built-in **Turbopack trace viewer**. You can generate a Turbopack trace and analyze it with:

```bash
next internal turbo-trace-server .next/trace-turbopack
```

### **4. Compilation Stability**

- **More predictable** compilation times.
- **Variance within just a few percent.**
- **Better alignment** between development and production builds.

---

## **Current Status and Support**

### **Stable Features:**

- _next dev --turbo_ command.
- Full support for **App Router** and **Pages Router**.
- Works with all **stable Next.js features**.

### **Supported Webpack Loaders:**

- @svgr/webpack
- babel-loader
- url-loader
- file-loader
- raw-loader
- tsconfig-paths-webpack-plugin

### **CSS and CSS-in-JS Support**

#### **Supported:**

- Tailwind CSS
- _@emotion/react_
- Sass
- styled-components
- Bootstrap
- Antd
- node-sass
- JSS
- theme-ui
- Chakra UI
- aphrodite

#### **Not Yet Supported:**

- Less
- _@vanilla-extract/css_
- StyleX

---

## **Performance and Optimizations**

### **Current Achievements:**

- **Significant improvements over Webpack**.
- **No persistent caching yet** (in progress).
- **25-35% lower memory usage** (RC 2 vs RC 1).
- **30-50% faster initial compilation** for large pages.

### **Breaking Changes:**

The **reason Turbopack was created** was to maintain **maximum compatibility** with Webpack while removing its **limitations**.

### **Key Removals:**

1. **No support for _webpack()_ configuration.**

    - Turbopack **is not Webpack** and has a different configuration structure.
    - Many features remain the same, including **loaders and aliases**.

2. **.babelrc no longer automatically transforms code.**

    - Turbopack uses **SWC** by default.
    - You can still add _babel-loader_, but **SWC will always run first** for optimizations.

3. **Certain rarely used CSS Modules features are not supported.**

    - Processing has been switched to **Lightning CSS**, which is much faster.
    - **The following are not supported:**
        - _:global_ and _:local_ pseudo-selectors.
        - _@value_ directive.
        - _:import_ and _:export_ rules.

Turbopack **enhanced Lightning CSS**, adding **better error messages and CSS Modules support**.

---

## **Roadmap**

### **Upcoming Releases:**

1. **Persistent Caching:**

    - Stores results between restarts.
    - Fast Refresh will immediately load **previously compiled routes**.
    - Improved build performance.

2. **Production Builds (96% of tests passed):**
    - Optimized CSS chunking.
    - Enhanced tree shaking.
    - Module ID hashing.
    - Export optimizations.
    - Content-based hashing for filenames.

### **Long-Term Plans:**

- Recommended in _create-next-app_.
- Become the default bundler in Next.js.
- Support for popular Webpack plugins.
- Standalone version outside of Next.js.

---

## **Production Optimization Status**

### **Already Implemented:**

- **SWC Minify** for JavaScript.
- **Lightning CSS** minification.
- **Production JS Runtime.**
- **Global application optimizations.**

### **In Progress:**

- **CSS chunking**.
- **Extended tree shaking**.
- **Module ID hashing**.
- **Export optimizations**.

### **Planned:**

- **Scope hoisting**.
- **Optimized JS chunking**.
- **Content-based file hashing**.

---

_Authors of [the original post](https://nextjs.org/blog/turbopack-for-development-stable): Maia Teegarden, Tim Neutkens, Tobias Koppers_
