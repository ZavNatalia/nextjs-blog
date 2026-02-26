# nextjs-blog

The blog about frontend development — built with Next.js 16 and TypeScript.
Two languages, Markdown-based content, dark theme, auth, and the things I find worth writing about.

**Live:** [zav.me](https://zav.me)

## Tech Stack

- **Next.js 16** (App Router, Turbopack, ISR)
- **React 19**, **TypeScript 5.9**
- **TailwindCSS 4** + `@tailwindcss/typography`
- **MongoDB** (users, contact messages) + file-based content (Markdown)
- **NextAuth** (GitHub, Google OAuth)
- **Vitest** + React Testing Library + **Playwright** (E2E)

## What's Inside

- Bilingual content (English / Russian) with automatic locale detection
- Markdown posts with syntax highlighting, GFM tables, and code copy
- Reading time estimation per post
- Dark / light theme via `next-themes`
- Auth: sign up, sign in (OAuth + credentials), password change, account deletion
- Contact form protected by Cloudflare Turnstile CAPTCHA
- Rate limiting on API routes
- Zod schema validation for all API inputs
- SEO: dynamic sitemap, robots.txt, OpenGraph, JSON-LD, hreflang

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `pnpm dev`           | Dev server (Turbopack)              |
| `pnpm build`         | Production build                    |
| `pnpm start`         | Production server                   |
| `pnpm lint`          | ESLint                              |
| `pnpm format`        | Prettier (with Tailwind class sort) |
| `pnpm test`          | Unit tests (Vitest, watch mode)     |
| `pnpm test:run`      | Unit tests (single run)             |
| `pnpm test:coverage` | Coverage report                     |
| `pnpm e2e`           | E2E tests (Playwright)              |
| `pnpm e2e:ui`        | E2E with Playwright UI              |
| `pnpm e2e:headed`    | E2E in headed browser               |

## Project Structure

```
app/
  [lang]/             # Localized pages (posts, auth, contact, profile, privacy-policy)
  api/                # Route handlers (auth, contact, user)
  actions/            # Server actions (auth)
  sitemap.ts          # Dynamic sitemap
  robots.ts           # Robots config
components/
  ui/                 # UI components (posts, news, auth, contact, profile, navigation)
  utils/              # Helpers (getLocale)
data/
  posts/{en,ru}/      # Markdown blog posts
  news/{en,ru}/       # Markdown news digests
dictionaries/         # Translation files (en.json, ru.json)
hooks/                # Custom hooks (useDictionary, useTheme)
lib/                  # Core logic (posts, news, auth, db, rate-limit, reading-time, validations)
  types/              # Shared TypeScript interfaces
privacy-policy/       # Privacy policy content (Markdown, per locale)
public/images/        # Static assets
e2e/                  # Playwright E2E tests
test/                 # Test setup
```
