---
title: 'Виды рендеринга в Next.js'
date: '2025-04-01'
image: 'types-of-rendering-in-next-js.png'
excerpt: 'Основные методы рендеринга в Next.js 15 — SSG, SSR, ISR, CSR — с примерами, их влиянием на SEO и возможностями стриминга через React Server Components.'
isFeatured: true
---

Next.js 15 предоставляет гибкую систему рендеринга, которая позволяет достичь как высокой производительности, так и хорошего SEO. В этой статье разберём основные методы рендеринга, их плюсы, особенности использования, влияние на SEO и современную возможность стриминга с помощью React Server Components.

---

## 1. Static Site Generation (SSG) — Статическая генерация

- HTML генерируется на этапе сборки (build time)
- Очень быстрая загрузка, отлично кэшируется
- Используется для редко меняющегося контента

### Пример:

```js
// app/blog/[slug]/page.tsx
export const dynamic = 'error';

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.title}</article>;
}
```

**_dynamic = 'error'_** — запрет динамического рендеринга

Если во время рендеринга страницы Next.js обнаружит что-либо, требующее динамического рендеринга (например, _cookies()_, _headers()_, _fetch(..., { cache: 'no-store' })_, _useSearchParams()_ и т.д.), то вызовется ошибка сборки или выполнения.

### Для чего это нужно?

- Гарантирует, что страница полностью статическая (SSG)
- Полезно для SEO и быстрой загрузки
- Помогает поймать ошибочные или неожиданные динамические зависимости

---

## 2. Server-Side Rendering (SSR) — Рендеринг на сервере

- HTML создаётся на каждый запрос
- Используется для часто обновляющихся данных

### Пример:

```js
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const stats = await fetchStats();
    return <div>Активные пользователи: {stats.activeUsers}</div>;
}
```

**_force-dynamic_** вынуждает страницу всегда рендериться на сервере при каждом запросе — то есть включает Server-Side Rendering (SSR) даже если данные могли бы быть закэшированы или предрендерены.

Если в компоненте используются _cookies_, _headers_, _useSearchParams_, данные, зависящие от времени запроса (_request-time data_), или вызывается _unstable_noStore()_, Next.js автоматически применяет режим динамического рендеринга (_force-dynamic_). Однако, при необходимости, этот режим можно задать явно с помощью _export const dynamic = 'force-dynamic'_.

### Когда и зачем использовать force-dynamic?

- Страница зависит от данных, которые часто меняются
- Ты не хочешь кэширования
- Используешь запросы к базе данных, API, которые возвращают свежие данные каждый раз

---

## 3. Incremental Static Regeneration (ISR) — Инкрементальная регенерация

- HTML создаётся при сборке и обновляется в фоне через указанное время
- Компромисс между SSG и SSR

### Пример:

```js
// app/news/page.tsx
export const revalidate = 60; // обновлять раз в минуту

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

---

## 4. Client-Side Rendering (CSR) — Рендеринг на клиенте

- Компонент загружается без данных, затем делает fetch на клиенте
- Используется для интерактивных компонентов

### Пример:

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

---

## SEO и рендеринг

| Метод (полное название)                   | SEO-дружелюбность | Комментарий                                              |
| ----------------------------------------- | ----------------- | -------------------------------------------------------- |
| **SSG** (Static Site Generation)          | Да                | HTML уже готов — поисковики видят всё                    |
| **SSR** (Server-Side Rendering)           | Да                | HTML отрендерен на сервере при запросе                   |
| **ISR** (Incremental Static Regeneration) | Да                | Почти как SSG, HTML обновляется, но всегда есть          |
| **CSR** (Client-Side Rendering)           | Нет               | HTML пустой, контент появляется только после загрузки JS |

Для хорошего SEO старайтесь использовать SSG, SSR или ISR. CSR подходит для вспомогательных компонентов, но не для основной страницы.

---

## Streaming и React Server Components

Streaming в Next.js позволяет отображать часть страницы сразу, пока другие компоненты ещё загружаются. Это делается с помощью _<Suspense>_ и React Server Components.

### Пример Streaming:

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
// app/products/SlowSection.tsx
export default async function SlowSection() {
    const recommendations = await fetchRecommendations();
    return (
        <div>
            {recommendations.map((r) => (
                <p key={r.id}>{r.title}</p>
            ))}
        </div>
    );
}
```

_Suspense_ позволяет Next.js отправить HTML части страницы сразу, не дожидаясь завершения всех async-компонентов.

- [Гранулярный контроль](https://nextjs.org/learn/dashboard-app/streaming) стриминга с помощью <Suspense>: оборачивайте отдельные компоненты, чтобы управлять порядком загрузки и приоритетами.
- React Server Components позволяют не только стримить, но и сократить объём JS-кода на клиенте.
- Кэширование данных и повторное использование улучшает производительность и снижает нагрузку на сервер.

---

## Заключение

- Выбирайте метод рендеринга под задачу: SSG — для контента, SSR — для динамики, ISR — компромисс, CSR — для интерактива.
- Для SEO важен серверный HTML (SSG/SSR/ISR).
- Streaming + Suspense = быстрый UX и плавный рендеринг.

Next.js даёт невероятную гибкость. Вы можете комбинировать подходы, выносить интерактив в клиентские компоненты и строить производительные и SEO-дружественные приложения.
