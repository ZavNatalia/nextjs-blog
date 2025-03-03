---
title: 'Next.js App Router Update'
date: '2023-06-22'
image: 'next-js-app-router-update.webp'
excerpt: 'The App Router lays the foundation for the future of Next.js, but there is room for improvement in the developer experience.'
isFeatured: false
---

The **App Router** lays the foundation for the future of Next.js, but the team acknowledges that there is room for improvement. In upcoming Next.js releases, they will focus on the following areas:

![A developer is sitting at a desk with multiple monitors.](developer-is-sitting-at-a-desk.webp)

-   **Performance improvements**: Enhancing local development speed, reducing build times, and optimizing serverless performance.
-   **Increased stability**: Actively fixing bugs and improving the reliability of the App Router.
-   **Better developer onboarding**: Updating documentation and providing new learning resources.

The **App Router** was designed to **overcome the limitations of the Pages Router** and better integrate with modern React capabilities such as **streaming, Server Components, and Suspense**. The team is committed to an **incremental adoption strategy**, allowing developers to gradually migrate their applications to the App Router without requiring a full rewrite, while still offering an option to revert if needed.

The **path to stability** involved releasing an RFC, followed by a beta version, and finally introducing a stable API in **Next.js 13.4**. However, the team acknowledges that they are **not yet fully satisfied with the current developer experience** and have made improving it their top priority.

### **Performance Enhancements**

![A visual representation of React Server Components (RSC) in App Router](visual-representation.webp)

To improve performance, the team is focused on **three key areas**:

-   **Local performance**: Moving away from Webpack in favor of **Turbopack**, which enables faster compilation and module updates. Turbopack is available in beta:

    ```bash
    next dev --turbo
    ```

-   **Build performance**: Working on Turbopack support for production builds:

    ```bash
    next build --turbo
    ```

-   **Production performance**: Optimizing **Vercel Functions** to reduce cold starts and improve memory efficiency.

### **Increasing Stability**

The team is continuously working on **bug fixes** and actively engaging with the community to address issues. Recent releases, such as **Next.js 13.4.7**, have already introduced significant improvements.

### **Improving Developer Learning Experience**

To help developers adopt the **App Router** and modern React features more effectively, Next.js is investing in:

-   **Updated documentation**: A complete **redesign of the documentation** at [nextjs.org/docs](https://nextjs.org/docs), featuring a better structure and more visual guides. The docs now allow switching between **Pages Router** and **App Router** instructions.
-   **Additional learning resources**: The team is preparing **new educational materials**, including an updated course and real-world project examples, such as the **rewritten Next.js Commerce** template.
-   **Guidance on new React features**: There is a recognized need for better education on concepts like **Server Components, Client Components, and React Suspense**. The Next.js team is working alongside the React team to provide better learning resources.
-   **Ecosystem development**: Supporting third-party libraries, such as **Panda CSS**, which are starting to integrate with modern React capabilities.
-   **Server Actions (Alpha)**: A new feature for **server-side data mutations**, which is still in **alpha** and **not recommended for production use** yet. The team is actively gathering feedback from developers.

---

_Authors of the original post: Delba de Oliveira, Lee Robinson_
