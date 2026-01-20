---
title: 'revalidatePath in Next.js'
date: '2026-01-20'
image: 'revalidate-path.jpeg'
excerpt: 'A practical guide to revalidatePath in Next.js: how to properly invalidate cache after data mutations, differences between type: "page" and type: "layout", and usage in Server Functions.'
isFeatured: true
---

## Core Concept

`revalidatePath` allows you to invalidate cached data on-demand for a specific path. This is a key function for updating content after data mutations.

### Where It Can Be Used

- **Server Functions** — primary use case
- **Route Handlers** — also supported
- ❌ **Does NOT work** in Client Components and Proxy

### Function Signature

```javascript
revalidatePath(path: string, type?: 'page' | 'layout'): void
```

**Parameters:**

- `path` — a path or route pattern (e.g., `/product/[slug]` or `/product/123`)
- `type` — optional parameter `'page'` or `'layout'`

### Important Usage Rules

#### 1. **Dynamic Segments Require the `type` Parameter**

If the path contains a dynamic segment (`[slug]`), the `type` parameter is required:

```javascript
// ✅ Correct
revalidatePath('/blog/[slug]', 'page');

// ❌ Incorrect - will throw an error
revalidatePath('/blog/[slug]');
```

#### 2. **Specific URLs Don't Require `type`**

```javascript
// Update a single specific page
revalidatePath('/product/123');
```

#### 3. **Path Length Limitation**

The path must not exceed 1024 characters and is case-sensitive.

## Behavioral Differences: Server Functions vs Route Handlers

### In Server Functions:

Updates the UI immediately (if you're viewing the affected path). Currently, it also causes all previously visited pages to refresh when navigated to. This behavior is temporary.

### In Route Handlers:

Marks the path for revalidation. The revalidation occurs on the next visit to the specified path.

## Invalidation Scope Based on `type`

- `type: 'page'`

    Invalidates only matching pages, does NOT affect nested pages:

```javascript
revalidatePath('/blog/[slug]', 'page');
// ✅ Invalidates /blog/post-1, /blog/post-2
// ❌ Does NOT invalidate /blog/[slug]/[author]
```

- `type: 'layout'`

    Invalidates the layout at that segment, all nested layouts beneath it, and all pages beneath them. Much broader scope.

## Practical Examples

#### Updating a Specific Page

```javascript
import { revalidatePath } from 'next/cache';

revalidatePath('/blog/post-1');
```

#### Updating All Pages by Pattern

```javascript
import { revalidatePath } from 'next/cache';

// With route groups
revalidatePath('/(main)/blog/[slug]', 'page');
```

#### Updating a Specific Layout and All Pages Beneath It

```javascript
import { revalidatePath } from 'next/cache';

// Will update /blog/layout.tsx + all pages under /blog/*
revalidatePath('/blog', 'layout');
```

_When to use:_ Data changed in the sidebar, category menu, post counters — anything that lives in the layout.

#### Updating a Nested Layout

```javascript
import { revalidatePath } from 'next/cache';

// Will update the layout of a specific post + pages beneath it
revalidatePath('/blog/[category]/[slug]', 'layout');
```

_When to use:_ Post metadata changed (views, likes, author) in the layout, need to update the post and comments.

#### Using `revalidatePath(path)` in a Server Function

```javascript
'use server'
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Update data in the database
  await db.users.update(id, data)

  // Invalidate the cache
  revalidatePath('/profile')
}
```

#### Using `revalidatePath(path, 'layout')` in a Server Function

```javascript
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(category: string) {
  await db.posts.create(...)

  // New post → category counter changed in blog/layout.tsx
  revalidatePath('/blog', 'layout')
}

export async function incrementViews(category: string, slug: string) {
  await db.posts.incrementViews(...)

  // Views in the post header → only this post's layout
  revalidatePath(`/blog/${category}/${slug}`, 'layout')
}
```

## What's New in Next.js 16: Caching API Changes

Next.js 16 introduces important changes to the cache invalidation API.

### Changes to `revalidateTag()`

The `revalidateTag` function now accepts a **second argument** — a cache profile (recommended to specify):

```javascript
// ✅ Next.js 16 — recommended approach
revalidateTag('posts', 'max'); // Uses stale-while-revalidate
revalidateTag('posts', 'hours'); // Cache for hours
revalidateTag('posts', { revalidate: 3600 }); // Custom profile

// ⚠️ Without the second argument — legacy behavior (deprecated)
revalidateTag('posts');
```

When using `revalidateTag` with a profile, data is marked as **stale**, but the user receives cached data while the update happens in the background (SWR semantics).

### New `updateTag()` Function

`updateTag` is a new API for **read-your-writes** scenarios, when the user should immediately see the result of their changes:

```javascript
'use server'
import { updateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const post = await db.posts.create(...)

  // Cache expires immediately, next request waits for fresh data
  updateTag('posts')
  updateTag(`post-${post.id}`)

  redirect(`/posts/${post.id}`) // User will see their post
}
```

**Key Differences from `revalidateTag`:**

| Characteristic | `revalidateTag`                                        | `updateTag`                            |
| -------------- | ------------------------------------------------------ | -------------------------------------- |
| Where it works | Server Functions, Route Handlers                       | **Only** Server Functions              |
| Semantics      | Stale-while-revalidate (SWR)                           | Immediate expiration                   |
| Behavior       | Serves stale data, updates in background               | Waits for update to complete           |
| When to use    | Background updates, eventual consistency is acceptable | Forms, user actions (read-your-writes) |

### Combining `revalidatePath` and `updateTag`

These functions complement each other to ensure data consistency:

```javascript
'use server'
import { revalidatePath, updateTag } from 'next/cache'

export async function updatePost(postId: string) {
  await updatePostInDatabase(postId)

  // Invalidate the specific page
  revalidatePath(`/blog/${postId}`)

  // Expire cache for all pages using the 'posts' tag
  // (e.g., post list on the homepage)
  updateTag('posts')
}
```

### When to Use What

| API                               | Purpose                                 | Example Use Case                      |
| --------------------------------- | --------------------------------------- | ------------------------------------- |
| `revalidatePath(path)`            | Invalidate a specific path or layout    | Update `/blog/post-1` after editing   |
| `revalidatePath(pattern, 'page')` | Invalidate all pages matching a pattern | Update all `/blog/[slug]`             |
| `revalidatePath(path, 'layout')`  | Invalidate layout and all nested pages  | Sidebar or navigation changed         |
| `revalidateTag(tag, profile)`     | Background data update with tag (SWR)   | Periodic product catalog updates      |
| `updateTag(tag)`                  | Immediate update for read-your-writes   | User created a post and should see it |

## Important Notes

1. **No memory between requests** — each `revalidatePath` call works independently, you need to pass the full context

2. **Client-side mechanism**: when called in a Server Function, information is passed to the browser via response headers (`x-nextjs-*` headers), then the client-side Router Cache is cleared and requests fresh data from the server

3. **Doesn't work with forms directly** — use Server Functions with `revalidatePath` inside

4. **Rate limits** don't apply to the function itself, but may exist at the platform level (e.g., Vercel)

5. **`updateTag` is not available in Route Handlers** — if you need tag-based invalidation in a Route Handler, use `revalidateTag`

## Migrating from ISR

If you were using ISR (Incremental Static Regeneration), the transition is straightforward:

```javascript
// Old approach (ISR)
export const revalidate = 3600;

// New approach (on-demand)
('use server');
export async function createPost() {
    // ... create post
    revalidatePath('/posts');
}
```

This gives you more control and predictability over data updates!
