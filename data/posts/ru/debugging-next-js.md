---
title: 'Отладка кода (debugging) в Next.js'
date: '2026-02-23'
excerpt: 'Отладка кода включает в себя консольные логи, инструменты разработчика, отладку API, профилирование производительности и анализ ошибок.'
isFeatured: false
---

Отладка кода в Next.js — это процесс поиска и исправления ошибок в коде. Он включает в себя **консольные логи, инструменты разработчика, отладку API, профилирование производительности и анализ ошибок.**

## **1. Логи (_console.log()_) — Базовый уровень**

Самый простой способ понять, что происходит в коде — использовать `console.log()`.

#### **В серверных компонентах (Server Components)**

```js
export default async function Page() {
    console.log('Этот код выполняется на сервере');
    return <h1>Привет!</h1>;
}
```

Лог появится **в терминале** при `next dev` или `next start`.

> **Совет:** В `next.config.ts` можно включить подробное логирование fetch-запросов в dev-режиме, чтобы видеть каждый серверный fetch с его URL и статусом кеша:
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

#### **В клиентских компонентах (Client Components)**

```js
'use client';

export default function ClientComponent() {
    console.log('Этот код выполняется в браузере');
    return <h1>Привет!</h1>;
}
```

Лог появится **в DevTools (F12 → Console)**.

#### **Логирование пропсов и состояний**

```js
'use client';

export default function DebugComponent({ message }: { message: string }) {
    console.log("message:", message);
    return <h1>{message}</h1>;
}
```

Позволяет увидеть, какие данные приходят в компонент.

## **2. Использование _debugger_ (Остановка кода)**

Если в коде что-то не так, можно **остановить выполнение и пошагово проанализировать значения.**

#### **В браузере (клиентский код)**

1. Добавь `debugger` в код:
    ```js
    'use client';
    export default function ClientComponent() {
        const name = 'Next.js';
        debugger; // Остановка кода
        return <h1>Привет, {name}!</h1>;
    }
    ```
2. Открой **DevTools → Sources → (Ctrl + P) → выбери файл**.
3. Перезагрузи страницу — браузер остановится на `debugger`, и ты сможешь **пошагово смотреть переменные**.

#### **В серверном коде**

В Next.js 15+ можно запустить dev-сервер с **встроенным флагом `--inspect`**:

```sh
pnpm dev --inspect
```

В терминале появится сообщение:

```
Debugger listening on ws://127.0.0.1:9229/...
```

После этого ты можешь:

1. **В VS Code** — открой **Run & Debug → Attach to Node.js Process** и выбери процесс Next.js.
2. **В Chrome** — открой `chrome://inspect` и нажми **inspect** на нужном процессе.
3. **В error overlay** — при ошибке на сервере в overlay появляется **иконка Node.js**. Нажми на неё — URL DevTools скопируется в буфер обмена.

Теперь можно **ставить breakpoints** в серверном коде и пошагово анализировать переменные.

## **3. Дебаг API Routes (_app/api/_)**

Если твои API маршруты (`app/api/route.ts`) не работают, отладь их:

#### **1. Логирование запроса**

```js
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    console.log('API запрос:', req.method, url.pathname, Object.fromEntries(url.searchParams));
    return NextResponse.json({ message: 'Hello from API' });
}
```

> Не логируй объект `req` целиком — он огромный. Выводи только нужные поля: `url`, `method`, `headers`.

Логи появятся **в терминале** при `next dev`.

#### **2. Запросы через `curl` / Postman**

Если `fetch()` или `axios` не работают, попробуй выполнить запрос напрямую:

```sh
curl -X GET http://localhost:3000/api/route
```

или в **Postman** / **Insomnia**.

## **4. Инструменты DevTools (Performance, Network)**

#### **1. Network (Проверка запросов)**

1. Открой **DevTools (F12) → Network**.
2. Проверь, какие запросы отправляются, и **нет ли ошибок 404, 500**.
3. Если API медленный, попробуй:
    - Убрать ненужные запросы.
    - Кэшировать данные — в Next.js 15 **fetch не кешируется по умолчанию**, кеширование нужно включать явно:
        ```js
        // Принудительное кеширование
        fetch(url, { cache: 'force-cache' });
        // ISR с ревалидацией каждый час
        fetch(url, { next: { revalidate: 3600 } });
        ```

#### **2. Performance (Оптимизация)**

1. В **DevTools → Performance** нажми **Start profiling**.
2. Перезагрузи страницу.
3. Посмотри, какие компоненты загружаются дольше всего.

## **5. Анализ ошибок (_error.tsx_, _global-error.tsx_)**

В Next.js App Router есть два уровня обработки ошибок:

#### **1. Обработчик ошибок маршрута (`error.tsx`)**

Файл `error.tsx` в папке маршрута перехватывает ошибки **дочерних компонентов** (но не layout этого же уровня):

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
        console.error('Ошибка:', error);
    }, [error]);

    return (
        <div>
            <h2>Что-то пошло не так!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Попробовать снова</button>
        </div>
    );
}
```

- **`reset`** — функция для повторного рендеринга компонента без перезагрузки страницы.
- **`error.digest`** — автогенерируемый хеш ошибки для сопоставления с серверными логами (серверные ошибки не раскрывают детали клиенту из соображений безопасности).

#### **2. Глобальный обработчик (`global-error.tsx`)**

Для перехвата ошибок в **root layout** нужен `app/global-error.tsx`. Он **обязан** определять свои `<html>` и `<body>`:

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
                <h2>Что-то пошло не так!</h2>
                <button onClick={() => reset()}>Попробовать снова</button>
            </body>
        </html>
    );
}
```

#### **3. Обработчик ошибок API**

```js
export async function GET() {
    try {
        throw new Error('Ошибка API');
    } catch (error) {
        console.error('Ошибка API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
```

Теперь ошибка **не сломает сервер**, а вернёт `500`.

## **6. Проверка SSR, Streaming и Client/Server рендеринга**

#### **1. Как узнать, серверный или клиентский код?**

```js
console.log(
    typeof window === 'undefined'
        ? '👀 Код выполняется на сервере'
        : '🌎 Код выполняется в браузере',
);
```

Если `typeof window === "undefined"`, значит **код работает на сервере**.

#### **2. Как отследить SSR и Streaming?**

Запусти **Next.js в production-режиме**, чтобы проверить, какие части рендерятся сервером:

```sh
pnpm build && pnpm start
```

Далее открой **DevTools → Network → посмотри, какие запросы выполняются**.

## **7. Дебаг с VS Code (Node.js Debugging)**

Ты можешь **дебажить Next.js в VS Code**, добавив конфигурацию.

#### **1. Открываем `.vscode/launch.json`**

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Next.js: серверный код",
            "type": "node-terminal",
            "request": "launch",
            "command": "pnpm dev --inspect"
        },
        {
            "name": "Next.js: клиентский код",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:3000"
        },
        {
            "name": "Next.js: full stack",
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

- **Серверный код** — запускает `pnpm dev --inspect` и подключает дебаггер к серверному процессу.
- **Клиентский код** — открывает Chrome с подключённым дебаггером для клиентского кода.
- **Full stack** — одновременно дебажит серверный и клиентский код. `serverReadyAction` автоматически открывает браузер, когда сервер готов.

#### **2. Запускаем дебаг**

1. **В VS Code → Run & Debug → выбери нужную конфигурацию**.
2. Теперь ты можешь ставить **breakpoints** в серверном и клиентском коде!

## **8. Серверная инструментация (`instrumentation.ts`)**

Файл `instrumentation.ts` в корне проекта позволяет настроить серверную инструментацию — отслеживание ошибок, производительности и логирование.

#### **Отслеживание всех серверных ошибок**

Функция `onRequestError` перехватывает ошибки в Server Components, Route Handlers, Server Actions и Middleware:

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

    // Можно отправить в внешний сервис мониторинга (Sentry, Datadog и т.д.)
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

#### **Инициализация при старте сервера**

Функция `register` вызывается один раз при запуске серверного инстанса:

```ts
export function register() {
    console.log('Сервер Next.js запущен');
    // Подключение OpenTelemetry, инициализация SDK мониторинга и т.д.
}
```

> Это стабильный API начиная с Next.js 15 — опция `experimental.instrumentationHook` больше не нужна.

## **Заключение: Полный чек-лист дебага Next.js**

- **Логи (`console.log`, `console.error`)** — Базовый способ, усилен конфигом `logging` в `next.config.ts`.

- **`debugger` и `pnpm dev --inspect`** — Остановка кода и пошаговый анализ на сервере и клиенте.

- **VS Code Debugger** — Full stack отладка с breakpoints через `launch.json`.

- **Проверка API (`curl`, Postman, Network tab)** — Если API не отвечает.

- **Определение среды (`typeof window`, `console.log`)** — Чтобы понять, где выполняется код.

- **Обработчики ошибок (`error.tsx`, `global-error.tsx`)** — Перехват и восстановление без перезагрузки.

- **Инструментация (`instrumentation.ts`)** — Отслеживание серверных ошибок и интеграция с мониторингом.

- **Performance Debugging (_DevTools → Performance_)** — Чтобы ускорить рендеринг.
