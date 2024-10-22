---
title: 'Next.js App Router Update'
date: '2023-06-22'
image: 'next-js-app-router-update.webp'
excerpt: "The App Router represents a new foundation for the future of Next.js, but we recognize there are opportunities to make the experience better. We'd like to give an update on what our current priorities are."
isFeatured: true
---

The App Router represents a new foundation for the future of Next.js, but we recognize there are opportunities to make the experience better. We'd like to give an update on what our current priorities are.

For the upcoming releases of Next.js, we are focusing on the following areas:

-   Improving Performance
-   Improving Stability
-   Improving Developer Education

![The main App component is using server components to render a list of posts.](react-server-components.webp)

## The App Router

First, it's helpful to provide some context on how the App Router has been designed.

### Growing Beyond the Pages Router by Aligning with React

As we saw increased adoption and larger scale applications being built with Next.js, we received feedback from the community and identified areas where we started to reach the limits of the Pages Router.

Most notably, the Next.js Pages Router was not designed for streaming, a cornerstone primitive in modern React, that helps us address the limitations we were facing and realize our long-term vision for Next.js.

![A visual representation of React Server Components (RSC) in App Router](visual-representation.webp)

Making streaming-friendly framework APIs for data fetching, asset loading, and page metadata, as well as taking advantage of React's newer primitives required large changes to the core architecture of Next.js.

![A developer is sitting at a desk with multiple monitors.](developer-is-sitting-at-a-desk.webp)

We took the opportunity to build on top of the latest React concurrent features, like Server Components, Suspense, and more, which have been designed for streaming architectures.

**Authors of the post:** [Delba de Oliveira (@delba_oliveira)](https://twitter.com/delba_oliveira), @leeerob\_
