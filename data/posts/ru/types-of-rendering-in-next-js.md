---
title: 'Виды рендеринга в Next.js'
date: '2025-12-25'
image: 'types-of-rendering-in-next-js.png'
excerpt: 'Основные методы рендеринга в Next.js 15 – SSG, SSR, ISR, CSR – с примерами, их влиянием на SEO и возможностями стриминга через React Server Components.'
isFeatured: true
---

Next.js 15 предоставляет гибкую систему рендеринга, которая позволяет достичь как высокой производительности, так и хорошего SEO. В этой статье разберём основные методы рендеринга, их плюсы, особенности использования, влияние на SEO и современную возможность стриминга с помощью React Server Components.

## 1. Static Site Generation (SSG) – Статическая генерация

- HTML генерируется на этапе сборки (build time)
- Очень быстрая загрузка, отлично кэшируется
- Используется для редко меняющегося контента

#### Пример:

```js
// app/blog/[slug]/page.tsx
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const post = await getPost(slug);
    return <article>{post.title}</article>;
}
```

### Что означает `dynamic = 'force-static'`?

Это директива, которая **принудительно** делает страницу статической. Если в компоненте используются динамические API (`cookies()`, `headers()`, `searchParams`), Next.js **не выбросит ошибку**, а молча подставит **пустые значения** — `cookies()` вернёт пустой объект, `headers()` — пустые заголовки, `searchParams` — `{}`.

### Для чего это нужно?

- Гарантирует, что страница полностью статическая (SSG)
- Отлично для SEO и максимально быстрой загрузки
- Позволяет использовать компоненты с динамическими API в статическом контексте (они получат пустые значения)

### Альтернатива: `dynamic = 'error'`

Режим `'error'` тоже делает страницу статической, но **выбрасывает ошибку** при обнаружении любых динамических API или некешированных данных. Это строгий режим: если вы случайно используете `cookies()` или `headers()`, сборка упадёт. Используйте `'error'`, когда хотите гарантировать отсутствие динамических зависимостей.

## 2. Server-Side Rendering (SSR) – Рендеринг на сервере

- HTML создаётся на каждый запрос
- Используется для часто обновляющихся данных
- Данные всегда свежие

#### Пример:

```js
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const stats = await fetchStats();
    return <div>Активные пользователи: {stats.activeUsers}</div>;
}
```

### Что означает `force-dynamic`?

Эта директива вынуждает страницу **всегда рендериться на сервере при каждом запросе** – то есть включает Server-Side Rendering (SSR), даже если данные могли бы быть закэшированы или сгенерированы заранее.

Next.js автоматически применяет динамический рендеринг, если в компоненте используются:

- `cookies()` или `headers()`
- `searchParams` (в Page или Layout)
- `connection()` из `next/server` (замена устаревшей `unstable_noStore()`)
- `draftMode()`
- `fetch()` с `{ cache: 'no-store' }` или `{ next: { revalidate: 0 } }`

> **Важно:** В Next.js 15 `fetch()` **не кешируется по умолчанию** (в отличие от Next.js 14, где значением по умолчанию был `force-cache`). Это значит, что для кеширования данных нужно явно указывать `{ cache: 'force-cache' }` или `{ next: { revalidate: N } }`.

Однако вы можете задать этот режим явно с помощью `export const dynamic = 'force-dynamic'`.

### Когда использовать `force-dynamic`?

- Страница зависит от данных, которые постоянно меняются
- Требуются актуальные данные на каждом запросе
- Используются запросы к базе данных или API, которые возвращают свежие данные
- Нужен доступ к данным запроса (cookies, headers)

## 3. Incremental Static Regeneration (ISR) – Инкрементальная статическая регенерация

- HTML создаётся при сборке и обновляется в фоновом режиме через указанное время
  Next.js в фоновом режиме регенерирует страницу с новыми данными
- Компромисс между SSG и SSR: статика + свежесть данных
- Кэшированные версии отдаются моментально, новые генерируются в фоновом режиме

#### Пример с временной ревалидацией:

```js
// app/news/page.tsx
export const revalidate = 60; // ревалидация каждые 60 секунд

export default async function NewsPage() {
    const news = await getLatestNews();
    return (
        <ul>
            {news.map((n) => (
                <li key={n.id}>{n.title}</li>
            ))}
        </ul>
    );
}
```

### Как это работает?

1. При первом запросе после истечения интервала `revalidate` пользователь получает закэшированную версию
2. Next.js в фоне регенерирует страницу с новыми данными
3. Следующий пользователь получает обновлённую версию

### On-Demand Revalidation (ревалидация по требованию):

Вместо временных интервалов можно обновлять контент по событию (например, после публикации статьи):

```js
// app/actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateNews() {
    // Обновить конкретный путь
    revalidatePath('/news');

    // Или обновить все запросы с определённым тегом
    revalidateTag('news');
}
```

```js
// app/news/page.tsx
export default async function NewsPage() {
    const res = await fetch('https://api.example.com/news', {
        next: { tags: ['news'] },
    });
    const news = await res.json();

    return (
        <ul>
            {news.map((n) => (
                <li key={n.id}>{n.title}</li>
            ))}
        </ul>
    );
}
```

## 4. Client-Side Rendering (CSR) – Рендеринг на клиенте

- Компонент загружается без данных, затем делает запрос на клиенте
- Используется для интерактивных компонентов, для которых SEO не важно
- Подходит для персонализированного контента (например, профиль пользователя)

#### Пример:

```js
// app/profile/client-profile.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/me')
            .then((res) => res.json())
            .then(setUser);
    }, []);

    if (!user) return <p>Загрузка...</p>;
    return <p>Привет, {user.name}!</p>;
}
```

### Когда использовать CSR?

- Интерактивные виджеты (чаты, комментарии, лайки)
- Персонализированный контент, зависящий от аутентификации
- Данные, которые часто меняются и не критичны для SEO
- Компоненты, требующие API браузера (localStorage, geolocation и т.д.)

## SEO и рендеринг

| Метод                                     | SEO-дружелюбность | Производительность | Комментарий                                              |
| ----------------------------------------- | ----------------- | ------------------ | -------------------------------------------------------- |
| **SSG** (Static Site Generation)          | ✅ Отлично        | ✅ Максимальная    | HTML готов заранее – поисковики видят весь контент       |
| **SSR** (Server-Side Rendering)           | ✅ Отлично        | ⚡ Хорошая         | HTML генерируется на сервере при каждом запросе          |
| **ISR** (Incremental Static Regeneration) | ✅ Отлично        | ✅ Очень хорошая   | Как SSG, но с автоматическим обновлением                 |
| **CSR** (Client-Side Rendering)           | ❌ Плохо          | ⚠️ Зависит от JS   | Начальный HTML пустой, контент появляется после загрузки |

### Рекомендации для SEO:

- **Для публичных страниц** (блог, товары, новости) → используйте SSG или ISR
- **Для динамического контента** (дашборды, аналитика) → используйте SSR
- **Для интерактивных элементов** (комментарии, модальные окна) → используйте CSR
- **Комбинируйте подходы**: SSG/SSR для основного контента + CSR для интерактива

## Streaming и React Server Components

Streaming в Next.js позволяет отображать части страницы по мере их готовности, не дожидаясь загрузки всех данных. Это достигается с помощью `<Suspense>` и React Server Components.

### Как работает Streaming:

1. Браузер получает начальный HTML сразу
2. Медленные компоненты временно заменяются на fallback (например, скелетоны)
3. По мере готовности данных Next.js передаёт готовые фрагменты и заменяет fallback реальным контентом

#### Пример Streaming:

```js
// app/products/page.tsx
import { Suspense } from 'react';
import FastSection from './FastSection';
import SlowSection from './SlowSection';

export default function ProductsPage() {
    return (
        <>
            <h1>Каталог товаров</h1>
            <FastSection />
            <Suspense fallback={<p>Загрузка рекомендаций...</p>}>
                <SlowSection />
            </Suspense>
        </>
    );
}
```

```js
// app/products/SlowSection.tsx (async Server Component)
export default async function SlowSection() {
    // Медленный запрос к базе данных или API
    const recommendations = await fetchRecommendations();

    return (
        <div>
            <h2>Рекомендации</h2>
            {recommendations.map((r) => (
                <p key={r.id}>{r.title}</p>
            ))}
        </div>
    );
}
```

### Ключевые особенности:

- `SlowSection` **должен быть async Server Component** (без `'use client'`)
- `Suspense` позволяет Next.js отправить HTML-фрагменты страницы сразу
- Пользователь видит контент быстрее, даже если часть данных ещё загружается
- Отлично работает с SSR — страница остаётся оптимизированной для SEO

### Преимущества Streaming:

- **Лучший UX**: пользователь видит контент быстрее
- **Точечный контроль**: можно оборачивать разные части страницы в отдельные `<Suspense>`
- **SEO-совместимость**: поисковики получают полный HTML после завершения стриминга
- **Меньше JavaScript**: Server Components не отправляют код на клиент

### Дополнительные возможности:

- [Точечный контроль стриминга](https://nextjs.org/learn/dashboard-app/streaming): оборачивайте отдельные компоненты для управления приоритетами загрузки
- **Loading UI**: используйте файлы `loading.tsx` для автоматических Suspense-границ
- **Параллельная загрузка**: несколько `<Suspense>` блоков загружаются одновременно

```js
// Пример с несколькими Suspense
<Suspense fallback={<ProductsSkeleton />}>
  <Products />
</Suspense>

<Suspense fallback={<ReviewsSkeleton />}>
  <Reviews />
</Suspense>

<Suspense fallback={<RecommendationsSkeleton />}>
  <Recommendations />
</Suspense>
```

---

## Заключение

Next.js 15 предоставляет полный спектр методов рендеринга для любых задач:

- **SSG** (`force-static`) – максимальная производительность для статического контента
- **SSR** (`force-dynamic`) – всегда свежие данные для динамических страниц
- **ISR** (`revalidate`) – баланс между скоростью SSG и актуальностью SSR
- **CSR** (`'use client'`) – интерактивность и персонализация

### Ключевые принципы:

✅ Для SEO важен серверный HTML (SSG/SSR/ISR)  
✅ Streaming + Suspense = быстрый UX без ущерба для SEO  
✅ Комбинируйте подходы: Server Components для контента + Client Components для интерактива  
✅ Используйте `generateStaticParams()` для статических динамических маршрутов  
✅ Ревалидация по требованию позволяет обновлять ISR-страницы по событиям

Next.js даёт невероятную гибкость: вы можете комбинировать подходы на уровне отдельных компонентов, строя высокопроизводительные и SEO-дружественные приложения с отличным пользовательским опытом.
