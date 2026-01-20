---
title: 'Debugging in Next.js'
date: '2025-03-03'
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

If you are using **VS Code**, you can **set a breakpoint**:

1. **Open the file in VS Code**.
2. **Click to the left of the code line** — a red dot will appear.
3. **Run Next.js with debugging mode**:

    ```sh
    node --inspect-brk .next/standalone/server.js
    ```

4. In **VS Code → Run & Debug → Attach to Node.js Process**.

Now the code **will stop before execution**, and you can analyze variables step by step.

## **3. Debugging API Routes (_app/api/_)**

If your API routes (`app/api/route.ts`) are not working, debug them as follows:

#### **1. Logging `req` and `res`**

```js
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    console.log("🔎 API request received:", req);
    return NextResponse.json({ message: "Hello from API" });
}
```

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
    - Caching data `fetch` with `{ cache: 'force-cache' }`

#### **2. Performance (Optimization)**

1. In **DevTools → Performance**, click **Start profiling**.
2. Reload the page.
3. Check which components take the longest to load.

## **5. Error Analysis (_error.tsx_, _console.error_)**

If a **500 error page** appears in Next.js, you can create a global error handler:

#### **1. Global Error Page (`error.tsx`)**

```js
'use client';

export default function GlobalError({ error }: { error: Error }) {
    console.error("Error:", error);
    return (
        <div>
            <h1>Something went wrong!</h1>
            <p>{error.message}</p>
        </div>
    );
}
```

Now **all client-side errors** will be displayed on this page.

#### **2. Handling API Errors**

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

Add this configuration:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Next.js",
            "program": "${workspaceFolder}/node_modules/.bin/next",
            "args": ["dev"],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        }
    ]
}
```

#### **2. Start Debugging**

1. **In VS Code → Run & Debug → Debug Next.js**
2. Now you can set **breakpoints** in the code!

---

## **Conclusion: Full Next.js Debugging Checklist**

✅ **Logs (`console.log`, `console.error`)** — Basic debugging.  
✅ **`debugger` and VS Code Debugger** — Stop execution for analysis.  
✅ **Inspecting API (`curl`, Postman, Network tab)** — Debug API responses.  
✅ **Streaming Debugging (`typeof window`, `console.log`)** — Identify where the code runs.  
✅ **Error Handling (`error.tsx`, `try/catch`)** — Prevent crashes.  
✅ **Performance Debugging (_DevTools → Performance_)** — Improve rendering speed.

Now you can **quickly find and fix errors in Next.js!**
