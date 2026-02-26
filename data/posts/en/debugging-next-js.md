---
title: 'Debugging in Next.js'
date: '2026-02-23'
image: 'debugging-next-js.webp'
excerpt: 'Debugging Code in Next.js involves console logs, developer tools, API debugging, performance profiling, and error analysis.'
isFeatured: false
---

Debugging in Next.js is the process of finding and fixing errors in the code. It involves **console logs, developer tools, API debugging, performance profiling, and error analysis**.

## **1. Logs (_console.log()_) — Basic Level**

The simplest way to understand what is happening in your code is to use `console.log()`.

#### **In Server Components**

```js
export default async function Page() {
    console.log('This code runs on the server');
    return <h1>Hello!</h1>;
}
```

The log will appear **in the terminal** when running `next dev` or `next start`.

> **Tip:** You can enable detailed fetch request logging in dev mode via `next.config.ts` to see every server-side fetch with its URL and cache status:
>
> ```js
> // next.config.ts
> const nextConfig = {
>     logging: {
>         fetches: {
>             fullUrl: true,
>             hmrRefreshes: true,
>         },
>     },
> };
> ```

#### **In Client Components**

```js
'use client';

export default function ClientComponent() {
    console.log('This code runs in the browser');
    return <h1>Hello!</h1>;
}
```

The log will appear **in the DevTools Console (F12 → Console)**.

#### **Logging Props and State**

```js
'use client';

export default function DebugComponent({ message }: { message: string }) {
    console.log("message:", message);
    return <h1>{message}</h1>;
}
```

This allows you to see what data is being passed to the component.

## **2. Using _debugger_ (Pausing Code Execution)**

If something is wrong in your code, you can **pause execution and analyze values step by step**.

#### **In the Browser (Client Code)**

1. Add `debugger` to the code:

    ```js
    'use client';
    export default function ClientComponent() {
        const name = 'Next.js';
        debugger; // Stops code execution
        return <h1>Hello, {name}!</h1>;
    }
    ```

2. Open **DevTools → Sources → (Ctrl + P) → Select the file**.
3. Reload the page — the browser will stop at `debugger`, allowing you to **inspect variables step by step**.

#### **In Server Code**

In Next.js 15+, you can start the dev server with the **built-in `--inspect` flag**:

```sh
pnpm dev --inspect
```

You'll see this in the terminal:

```
Debugger listening on ws://127.0.0.1:9229/...
```

Then you can:

1. **In VS Code** — open **Run & Debug → Attach to Node.js Process** and select the Next.js process.
2. **In Chrome** — open `chrome://inspect` and click **inspect** on the target process.
3. **In the error overlay** — when a server error occurs, the overlay shows a **Node.js icon**. Click it to copy the DevTools URL to the clipboard.

Now you can **set breakpoints** in server code and analyze variables step by step.

## **3. Debugging API Routes (_app/api/_)**

If your API routes (`app/api/route.ts`) are not working, debug them as follows:

#### **1. Logging the Request**

```js
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    console.log('API request:', req.method, url.pathname, Object.fromEntries(url.searchParams));
    return NextResponse.json({ message: 'Hello from API' });
}
```

> Don't log the entire `req` object — it's huge. Log only the fields you need: `url`, `method`, `headers`.

Logs will appear **in the terminal** when running `next dev`.

#### **2. Making Requests via `curl` or Postman**

If `fetch()` or `axios` do not work, try making a direct request:

```sh
curl -X GET http://localhost:3000/api/route
```

or use **Postman** / **Insomnia**.

## **4. Developer Tools (Performance, Network)**

#### **1. Network (Inspecting Requests)**

1. Open **DevTools (F12) → Network**.
2. Check what requests are being sent and **whether there are 404, 500 errors**.
3. If an API request is slow, try:
    - Removing unnecessary requests.
    - Caching data — in Next.js 15, **fetch is not cached by default**, you need to opt in explicitly:
        ```js
        // Force caching
        fetch(url, { cache: 'force-cache' });
        // ISR with hourly revalidation
        fetch(url, { next: { revalidate: 3600 } });
        ```

#### **2. Performance (Optimization)**

1. In **DevTools → Performance**, click **Start profiling**.
2. Reload the page.
3. Check which components take the longest to load.

## **5. Error Analysis (_error.tsx_, _global-error.tsx_)**

Next.js App Router provides two levels of error handling:

#### **1. Route Error Boundary (`error.tsx`)**

An `error.tsx` file in a route folder catches errors from **child components** (but not from the layout at the same level):

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
```

- **`reset`** — re-renders the component without a full page reload.
- **`error.digest`** — an auto-generated hash for matching with server logs (server errors don't expose details to the client for security reasons).

#### **2. Global Error Handler (`global-error.tsx`)**

To catch errors in the **root layout**, you need `app/global-error.tsx`. It **must** define its own `<html>` and `<body>`:

```tsx
'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
```

#### **3. Handling API Errors**

```js
export async function GET() {
    try {
        throw new Error('API error');
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
```

Now the error **won't crash the server** but will return `500`.

## **6. Checking SSR, Streaming, and Client/Server Rendering**

#### **1. How to Check if Code is Running on the Server or Client?**

```js
console.log(
    typeof window === 'undefined'
        ? '👀 Code is running on the server'
        : '🌎 Code is running in the browser',
);
```

If `typeof window === "undefined"`, the **code is running on the server**.

#### **2. How to Track SSR and Streaming?**

Run **Next.js in production mode** to check which parts are rendered on the server:

```sh
pnpm build && pnpm start
```

Then open **DevTools → Network** and inspect which requests are being made.

## **7. Debugging with VS Code (Node.js Debugging)**

You can **debug Next.js in VS Code** by adding a configuration.

#### **1. Open `.vscode/launch.json`**

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Next.js: debug server-side",
            "type": "node-terminal",
            "request": "launch",
            "command": "pnpm dev --inspect"
        },
        {
            "name": "Next.js: debug client-side",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:3000"
        },
        {
            "name": "Next.js: debug full stack",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
            "runtimeArgs": ["--inspect"],
            "skipFiles": ["<node_internals>/**"],
            "serverReadyAction": {
                "action": "debugWithChrome",
                "killOnServerStop": true,
                "pattern": "- Local:.+(https?://.+)",
                "uriFormat": "%s",
                "webRoot": "${workspaceFolder}"
            }
        }
    ]
}
```

- **Server-side** — runs `pnpm dev --inspect` and attaches the debugger to the server process.
- **Client-side** — opens Chrome with the debugger attached for client code.
- **Full stack** — debugs both server and client code simultaneously. `serverReadyAction` automatically opens the browser when the server is ready.

#### **2. Start Debugging**

1. **In VS Code → Run & Debug → choose the configuration you need**.
2. Now you can set **breakpoints** in both server and client code!

## **8. Server Instrumentation (`instrumentation.ts`)**

The `instrumentation.ts` file in the project root allows you to set up server-side instrumentation — error tracking, performance monitoring, and logging.

#### **Tracking All Server Errors**

The `onRequestError` function catches errors in Server Components, Route Handlers, Server Actions, and Middleware:

```ts
import type { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (
    err,
    request,
    context,
) => {
    console.error(
        `[${context.routeType}] ${request.method} ${request.path}:`,
        err.message,
    );

    // You can send to an external monitoring service (Sentry, Datadog, etc.)
    await fetch('https://your-error-tracker.com/api/errors', {
        method: 'POST',
        body: JSON.stringify({
            message: err.message,
            path: request.path,
            routeType: context.routeType,
        }),
    });
};
```

#### **Initialization on Server Start**

The `register` function is called once when the server instance starts:

```ts
export function register() {
    console.log('Next.js server started');
    // Initialize OpenTelemetry, monitoring SDK, etc.
}
```

> This is a stable API since Next.js 15 — the `experimental.instrumentationHook` option is no longer needed.

---

## **Conclusion: Full Next.js Debugging Checklist**

- **Logs (`console.log`, `console.error`)** — Basic debugging, enhanced with the `logging` config in `next.config.ts`.

- **`debugger` and `pnpm dev --inspect`** — Pause code and step through on both server and client.

- **VS Code Debugger** — Full stack debugging with breakpoints via `launch.json`.

- **Inspecting API (`curl`, Postman, Network tab)** — Debug API responses.

- **Environment detection (`typeof window`, `console.log`)** — Identify where the code runs.

- **Error Handling (`error.tsx`, `global-error.tsx`)** — Catch and recover without full page reloads.

- **Instrumentation (`instrumentation.ts`)** — Track server errors and integrate with monitoring.

- **Performance Debugging (_DevTools → Performance_)** — Improve rendering speed.

Now you can **quickly find and fix errors in Next.js!**
