---
title: 'Отладка кода (debugging) в Next.js'
date: '2025-03-03'
image: 'debugging-next-js.webp'
excerpt: 'Отладка кода включает в себя консольные логи, инструменты разработчика, отладку API, профилирование производительности и анализ ошибок.'
isFeatured: false
---

Отладка кода в Next.js — это процесс поиска и исправления ошибок в коде. Он включает в себя **консольные логи, инструменты разработчика, отладку API, профилирование производительности и анализ ошибок.**

---

## **1. Логи (_console.log_) — Базовый уровень**

Самый простой способ понять, что происходит в коде — использовать _console.log()_.

### **В серверных компонентах (Server Components)**

```js
export default async function Page() {
    console.log('Этот код выполняется на сервере');
    return <h1>Привет!</h1>;
}
```

Лог появится **в терминале** при _next dev_ или _next start_.

### **В клиентских компонентах (Client Components)**

```js
'use client';

export default function ClientComponent() {
    console.log('Этот код выполняется в браузере');
    return <h1>Привет!</h1>;
}
```

Лог появится **в DevTools (F12 → Console)**.

### **Логирование пропсов и состояний**

```js
'use client';

export default function DebugComponent({ message }: { message: string }) {
    console.log("message:", message);
    return <h1>{message}</h1>;
}
```

Позволяет увидеть, какие данные приходят в компонент.

---

## **2. Использование _debugger_ (Остановка кода)**

Если в коде что-то не так, можно **остановить выполнение и пошагово проанализировать значения.**

### **В браузере (клиентский код)**

1. Добавь _debugger_ в код:
    ```js
    'use client';
    export default function ClientComponent() {
        const name = 'Next.js';
        debugger; // Остановка кода
        return <h1>Привет, {name}!</h1>;
    }
    ```
2. Открой **DevTools → Sources → (Ctrl + P) → выбери файл**.
3. Перезагрузи страницу — браузер остановится на _debugger_, и ты сможешь **пошагово смотреть переменные**.

### **В серверном коде**

Если ты используешь **VS Code**, можно **установить breakpoint**:

1. **Открыть файл в VS Code**.
2. **Кликнуть слева от строки кода** — появится красная точка.
3. **Запустить Next.js с дебаггером**:
    ```sh
    node --inspect-brk .next/standalone/server.js
    ```
4. В **VS Code → Run & Debug → Attach to Node.js Process**.

Теперь код **остановится перед выполнением**, и ты сможешь пошагово анализировать переменные.

---

## **3. Дебаг API Routes (_app/api/_)**

Если твои API маршруты (_app/api/route.ts_) не работают, отладь их:

### **✅ 1. Логирование _req_ и _res_**

```js
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    console.log("🔎 API запрос получен:", req);
    return NextResponse.json({ message: "Hello from API" });
}
```

Логи появятся **в терминале** при _next dev_.

### **2. Запросы через _curl_ / Postman**

Если _fetch()_ или _axios_ не работают, попробуй выполнить запрос напрямую:

```sh
curl -X GET http://localhost:3000/api/route
```

или в **Postman** / **Insomnia**.

---

## **4. Инструменты DevTools (Performance, Network)**

### **1. Network (Проверка запросов)**

1. Открой **DevTools (F12) → Network**.
2. Проверь, какие запросы отправляются, и **нет ли ошибок 404, 500**.
3. Если API медленный, попробуй:
    - Убрать ненужные запросы.
    - Кэшировать данные _fetch_ с`{ cache: 'force-cache' }`

### **2. Performance (Оптимизация)**

1. В **DevTools → Performance** нажми **Start profiling**.
2. Перезагрузи страницу.
3. Посмотри, какие компоненты загружаются дольше всего.

---

## **5. Анализ ошибок (_error.tsx_, _console.error_)**

Если в Next.js появляется **страница ошибки 500**, можно создать глобальный обработчик ошибок:

### **1. Глобальная страница ошибки (_error.tsx_)**

```js
'use client';

export default function GlobalError({ error }: { error: Error }) {
    console.error("Ошибка:", error);
    return (
        <div>
            <h1>Что-то пошло не так!</h1>
            <p>{error.message}</p>
        </div>
    );
}
```

Теперь **все ошибки в клиентских компонентах** будут показываться на этой странице.

### **2. Обработчик ошибок API**

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

Теперь ошибка **не сломает сервер**, а вернёт _500_.

---

## **6. Проверка SSR, Streaming и Client/Server рендеринга**

### **1. Как узнать, серверный или клиентский код?**

```js
console.log(
    typeof window === 'undefined'
        ? '👀 Код выполняется на сервере'
        : '🌎 Код выполняется в браузере',
);
```

Если _typeof window === "undefined"_, значит **код работает на сервере**.

### **2. Как отследить SSR и Streaming?**

Запусти **Next.js в production-режиме**, чтобы проверить, какие части рендерятся сервером:

```sh
pnpm build && pnpm start
```

Далее открой **DevTools → Network → посмотри, какие запросы выполняются**.

---

## **7. Дебагging с VS Code (Node.js Debugging)**

Ты можешь **дебажить Next.js в VS Code**, добавив конфигурацию.

### **1. Открываем _.vscode/launch.json_**

Добавь этот конфиг:

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

### **2. Запускаем дебаг**

1. **В VS Code → Run & Debug → Debug Next.js**
2. Теперь ты можешь ставить **breakpoints** в коде!

---

## **Заключение: Полный чек-лист дебага Next.js**

✅ **Логи (_console.log_, _console.error_)** — Базовый способ.  
✅ **_debugger_ и VS Code Debugger** — Остановка кода для анализа.  
✅ **Проверка API (_curl_, Postman, Network tab)** — Если API не отвечает.  
✅ **Streaming Debugging (_typeof window_, _console.log_)** — Чтобы понять, где выполняется код.  
✅ **Обработчики ошибок (_error.tsx_, _try/catch_)** — Чтобы не ломать приложение.  
✅ **Performance Debugging (_DevTools → Performance_)** — Чтобы ускорить рендеринг.

Теперь ты можешь **быстро находить и исправлять ошибки в Next.js!**
