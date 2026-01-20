---
title: 'revalidatePath в Next.js'
date: '2026-01-20'
image: 'revalidate-path.jpeg'
excerpt: 'Практическое руководство по revalidatePath в Next.js: как правильно инвалидировать кэш после мутаций данных, различия между type: "page" и type: "layout", и использование в Server Functions.'
isFeatured: true
---

## Основная концепция

`revalidatePath` позволяет инвалидировать кэшированные данные по требованию для конкретного пути. Это ключевая функция для обновления контента после мутаций данных.

### Где можно использовать

- **Server Functions** — основное место применения
- **Route Handlers** — также поддерживается
- ❌ **НЕ работает** в Client Components и Proxy

### Сигнатура функции

```javascript
revalidatePath(path: string, type?: 'page' | 'layout'): void
```

**Параметры:**

- `path` — путь или паттерн роута (например, `/product/[slug]` или `/product/123`)
- `type` — опциональный параметр `'page'` или `'layout'`

### Важные правила использования

#### 1. **Динамические сегменты требуют параметр `type`**

Если path содержит динамический сегмент (`[slug]`), параметр `type` обязателен:

```javascript
// ✅ Правильно
revalidatePath('/blog/[slug]', 'page');

// ❌ Неправильно - вызовет ошибку
revalidatePath('/blog/[slug]');
```

#### 2. **Конкретные URL не требуют `type`**

```javascript
// Обновить одну конкретную страницу
revalidatePath('/product/123');
```

#### 3. **Ограничение длины пути**

Путь не должен превышать 1024 символа и чувствителен к регистру.

## Различия в поведении: Server Functions vs Route Handlers

### В Server Functions:

Обновляет UI немедленно (если вы просматриваете затронутый путь). В настоящее время также вызывает обновление всех ранее посещенных страниц при переходе к ним. Это поведение временное.

### В Route Handlers:

Помечает путь для ревалидации. Ревалидация происходит при следующем посещении указанного пути.

## Область действия (scope) инвалидации в зависимости от `type`

- `type: 'page'`

    Инвалидирует только совпадающие страницы, НЕ затрагивает вложенные страницы:

```javascript
revalidatePath('/blog/[slug]', 'page');
// ✅ Инвалидирует /blog/post-1, /blog/post-2
// ❌ НЕ инвалидирует /blog/[slug]/[author]
```

- `type: 'layout'`

    Инвалидирует layout на этом сегменте, все вложенные layouts под ним и все страницы под ними. Гораздо более широкая область действия (scope).

## Практические примеры

#### Обновление конкретной страницы

```javascript
import { revalidatePath } from 'next/cache';

revalidatePath('/blog/post-1');
```

#### Обновление всех страниц по паттерну

```javascript
import { revalidatePath } from 'next/cache';

// С route groups
revalidatePath('/(main)/blog/[slug]', 'page');
```

#### Обновление конкретного layout и всех страниц под ним

```javascript
import { revalidatePath } from 'next/cache';

// Обновит /blog/layout.tsx + все страницы под /blog/*
revalidatePath('/blog', 'layout');
```

_Когда использовать:_ Изменились данные в сайдбаре, меню категорий, счетчики постов — всё, что живет в layout.

#### Обновление вложенного layout

```javascript
import { revalidatePath } from 'next/cache';

// Обновит layout конкретного поста + страницы под ним
revalidatePath('/blog/[category]/[slug]', 'layout');
```

_Когда использовать:_ Изменились метаданные поста (просмотры, лайки, автор) в layout, нужно обновить пост и комментарии.

#### Использование `revalidatePath(path)` в Server Function

```javascript
'use server'
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Обновляем данные в БД
  await db.users.update(id, data)

  // Инвалидируем кэш
  revalidatePath('/profile')
}
```

#### Использование `revalidatePath(path, 'layout')` в Server Function

```javascript
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(category: string) {
  await db.posts.create(...)

  // Новый пост → изменился счетчик категорий в blog/layout.tsx
  revalidatePath('/blog', 'layout')
}

export async function incrementViews(category: string, slug: string) {
  await db.posts.incrementViews(...)

  // Просмотры в шапке поста → только layout этого поста
  revalidatePath(`/blog/${category}/${slug}`, 'layout')
}
```

## Новое в Next.js 16: изменения в API кэширования

Next.js 16 вносит важные изменения в API инвалидации кэша.

### Изменения в `revalidateTag()`

Функция `revalidateTag` теперь принимает **второй аргумент** — профиль кэша (рекомендуется указывать):

```javascript
// ✅ Next.js 16 — рекомендуемый способ
revalidateTag('posts', 'max'); // Использует stale-while-revalidate
revalidateTag('posts', 'hours'); // Кэш на часы
revalidateTag('posts', { revalidate: 3600 }); // Кастомный профиль

// ⚠️ Без второго аргумента — legacy-поведение (deprecated)
revalidateTag('posts');
```

При использовании `revalidateTag` с профилем данные помечаются как **stale** (устаревшие), но пользователь получает кэшированные данные, пока в фоне происходит обновление (SWR-семантика).

### Новая функция `updateTag()`

`updateTag` — новый API для сценариев **read-your-writes**, когда пользователь должен сразу увидеть результат своих изменений:

```javascript
'use server'
import { updateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const post = await db.posts.create(...)

  // Кэш немедленно истекает, следующий запрос ждёт свежие данные
  updateTag('posts')
  updateTag(`post-${post.id}`)

  redirect(`/posts/${post.id}`) // Пользователь увидит свой пост
}
```

**Ключевые отличия от `revalidateTag`:**

| Характеристика     | `revalidateTag`                                    | `updateTag`                                     |
| ------------------ | -------------------------------------------------- | ----------------------------------------------- |
| Где работает       | Server Functions, Route Handlers                   | **Только** Server Functions                     |
| Семантика          | Stale-while-revalidate (SWR)                       | Немедленное истечение                           |
| Поведение          | Отдаёт stale-данные, обновляет в фоне              | Ждёт завершения обновления                      |
| Когда использовать | Фоновые обновления, допустима eventual consistency | Формы, действия пользователя (read-your-writes) |

### Комбинирование `revalidatePath` и `updateTag`

Эти функции дополняют друг друга для обеспечения консистентности данных:

```javascript
'use server'
import { revalidatePath, updateTag } from 'next/cache'

export async function updatePost(postId: string) {
  await updatePostInDatabase(postId)

  // Инвалидировать конкретную страницу
  revalidatePath(`/blog/${postId}`)

  // Истечь кэш для всех страниц, использующих тег 'posts'
  // (например, список постов на главной)
  updateTag('posts')
}
```

### Когда использовать что

| API                               | Назначение                                  | Пример использования                          |
| --------------------------------- | ------------------------------------------- | --------------------------------------------- |
| `revalidatePath(path)`            | Инвалидация конкретного пути или layout     | Обновить `/blog/post-1` после редактирования  |
| `revalidatePath(pattern, 'page')` | Инвалидация всех страниц по паттерну        | Обновить все `/blog/[slug]`                   |
| `revalidatePath(path, 'layout')`  | Инвалидация layout и всех вложенных страниц | Изменился сайдбар или навигация               |
| `revalidateTag(tag, profile)`     | Фоновое обновление данных с тегом (SWR)     | Периодическое обновление каталога товаров     |
| `updateTag(tag)`                  | Немедленное обновление для read-your-writes | Пользователь создал пост и должен его увидеть |

## Важные нюансы

1. **Нет памяти между запросами** — каждый вызов `revalidatePath` работает независимо, необходимо передавать весь контекст

2. **Механизм работы с клиентом**: при вызове в Server Function информация передаётся браузеру через response headers (заголовки `x-nextjs-*`), затем клиентский Router Cache очищается и запрашивает свежие данные с сервера

3. **Не работает с формами напрямую** — используйте Server Functions с `revalidatePath` внутри

4. **Ограничения частоты запросов** не применяются к самой функции, но могут быть на уровне платформы (например, Vercel)

5. **`updateTag` недоступен в Route Handlers** — если нужна инвалидация по тегу в Route Handler, используйте `revalidateTag`

## Миграция с ISR

Если вы использовали ISR (Incremental Static Regeneration), то переход простой:

```javascript
// Старый подход (ISR)
export const revalidate = 3600;

// Новый подход (on-demand)
('use server');
export async function createPost() {
    // ... создание поста
    revalidatePath('/posts');
}
```

Это дает больше контроля и предсказуемости обновления данных!
