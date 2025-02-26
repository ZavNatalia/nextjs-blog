---
title: 'Composable Caching'  
date: '2025-01-31'  
image: 'composable-caching-with-next-js.webp'  
excerpt: 'Next.js has introduced Composable Caching — a new caching approach that simplifies cache management at different levels of an application, from data to components and pages.'  
isFeatured: true
---

Next.js has introduced **Composable Caching** — a new caching approach that simplifies cache management at different levels of an application, from data to components and pages.

---

## **Key Innovations**
### 1️⃣ **Unified Caching Model**
Next.js now uses a **single caching model** across the entire application:
- **fetch()** – caches API requests.
- **rendering** – caches components and pages.
- **revalidateTag() / revalidatePath()** – enables precise cache control.

### 2️⃣ **Flexible Cache Management**
You can configure caching based on your needs:
- **force-cache** – strict caching (similar to SSG).
- **no-store** – disables caching (similar to SSR).
- **revalidate: X** – automatically refreshes the cache every X seconds (similar to ISR).

### 3️⃣ **New revalidateTag() Strategy**
Now you can **update cache selectively**:
- Cache is grouped by tags.
- You can refresh specific data without affecting other parts of the page.

**Example:**
```ts
import { revalidateTag } from 'next/cache';

async function updateData() {
  await fetch('/api/update', { method: 'POST' });
  revalidateTag('products'); // Refreshes only the cache data tagged as "products"
}
```

### 4️⃣ **Caching on Server and Client**
- Cache can be used **inside React components**.
- Supports **Edge Runtime**, **Vercel**, and **Self-Hosting**.

### 5️⃣ **Integration with next/image and next/font**
Next.js applies the same caching model to images and fonts, speeding up loading times.

---

## **Conclusion**
- **Composable Caching** gives **full control over caching** at multiple levels.
- **Cache tags** allow **granular updates** without unnecessary re-renders.
- Improved cache support **for both server and client**.

**Bottom line:** better performance, simpler cache management!

---

_Author of [the original post](https://nextjs.org/blog/composable-caching): Lee Robinson_