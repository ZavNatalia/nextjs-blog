---
title: 'Security and Data Handling'
date: '2023-10-23'
image: 'how-to-think-about-security-in-next-js.webp'
excerpt: 'React Server Components (RSC) in the App Router introduce a new paradigm that eliminates much of the redundancy and potential risks associated with traditional methods.'
isFeatured: false
---

React Server Components (RSC) in the App Router introduce a new paradigm that removes many inefficiencies and potential risks associated with traditional approaches. Because this is a relatively new concept, developers and security teams may find it challenging to adapt their existing security protocols to this model.

### **Main Goal of This Article**

- Highlight key areas of focus.
- Describe built-in security mechanisms.
- Provide a guide for auditing applications.
- Pay special attention to the risks of accidental data exposure.

---

## **Choosing a Data Handling Model**

Since React Server Components blur the line between server and client, it is crucial to understand where data is processed and how it becomes accessible. Choosing the right data handling approach for your project is essential:

1. **HTTP API (Recommended for large, existing projects/organizations)**

   - Treat Server Components as inherently insecure, similar to SSR or client-side code.
   - Use _fetch()_ to call internal API endpoints (REST or GraphQL), passing necessary cookies.
   - Helps maintain organizational structures and enforce existing security practices.

2. **Dedicated Data Access Layer (Recommended for new projects)**

   - Establish a separate data access layer within your JavaScript code.
   - Centralize data operations to ensure consistency and reduce the likelihood of authorization errors.
   - Simplifies maintenance and improves performance through shared in-memory caching.

3. **Component-Level Data Access (Recommended for prototyping and learning)**

   - Directly fetching data within Server Components.
   - Suitable only for rapid prototyping and small teams aware of security risks.
   - Requires thorough auditing of client components (_"use client"_) to prevent data leaks.

**Recommendation:** Stick to one approach to ensure clarity for both developers and security auditors.

---

## **Security Best Practices**

![Illustration of HTTP APIs and Zero Trust for a Next.js project](http-apis-and-zero-trust-in-the-context-of-server-components.webp)

1. **Marking Code as "Server Only"**

   - Use _import 'server-only';_ in modules that should only run on the server.
   - Prevents accidental inclusion of sensitive code in the client build.

2. **Validating User Input**

   - Always sanitize inputs, especially when using _params_, _searchParams_, and _headers_.
   - Do not trust data from URLs or other client-controlled sources.

3. **Avoid Side Effects During Rendering**

   - Server Component rendering should not trigger mutations or state changes.
   - Use **Server Actions** for modifying data.

4. **Using Server Actions for Mutations**

   - Declare server actions using _"use server"_.
   - Always validate user permissions inside actions.
   - Sanitize all function arguments.

5. **Error Handling**

   - In production mode, React does not expose detailed error messages to the client to prevent leaking sensitive information.
   - Ensure the application runs in production mode in deployment environments.

---

## **CSRF Protection & Secure Actions**

1. **Server Actions and CSRF Prevention**

   - Server Actions are triggered via POST requests, mitigating most CSRF attacks due to the Same-Site cookie policy.
   - Additionally, the _Origin_ header is checked to match the _Host_; if mismatched, the request is rejected.

2. **Custom Route Handlers & Middleware**

   - These mechanisms provide extensive control but require careful auditing and additional security measures.

---

## **Security Audit Checklist**

![Abstract 3D representations of the audit process for a Next.js App Router project](audit-of-a-Next-js-App-Router-project.webp)

When auditing a Next.js project using the App Router, focus on the following aspects:

1. **Data Access Layer**
- Ensure there is a clearly defined data access layer.
- Verify that database-related packages and environment variables are not used outside this layer.

2. **Client Components (_"use client"_)**
- Review component props to prevent the exposure of private data.
- Ensure components only receive the necessary data.

3. **Server Actions (_"use server"_)**
- Validate function arguments inside the action itself.
- Check that user permissions are verified on every action call.

4. **Dynamic Routes (_/[param]/_)**
- Route parameters are user input and should be carefully validated.

5. **Middleware & Route Handlers**
- These files significantly impact security and should receive extra attention.
- Regularly conduct penetration testing and vulnerability scans as part of your software development lifecycle.

---

## **Conclusion**

The new React Server Components model in Next.js provides powerful capabilities but requires careful attention to security and data handling. Following best practices and conducting regular audits will help ensure the security of your application and prevent accidental data leaks.

---

_Author of [the original post](https://nextjs.org/blog/security-nextjs-server-components-actions): Sebastian Markbåge_