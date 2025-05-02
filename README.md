# nextjs-blog

`nextjs-blog` is a modern **Next.js** application designed for publishing posts and curating the latest trends and news in the frontend development ecosystem. Built with **TypeScript** and styled using **TailwindCSS**, this platform provides an elegant, fast, and responsive experience for developers and enthusiasts alike.

---

## Features

- **Frontend News Hub**: Stay updated with the latest news and trends in frontend technologies like JavaScript, TypeScript, CSS, and HTML.
- **Blog Posts**: Publish and explore detailed posts on various frontend topics, including frameworks, tools, and best practices.
- **Markdown Support**: Write posts in Markdown with dynamic rendering via `react-markdown` and `react-syntax-highlighter`.
- **Dynamic Data Fetching**: News and posts are powered by MongoDB, allowing for a dynamic and scalable backend.
- **Modern UI/UX**: Responsive and clean design powered by TailwindCSS and enhanced by the `@tailwindcss/typography` plugin.
- **High Performance**: Optimized using **Turbopack** and features like Incremental Static Regeneration (ISR).
- **TypeScript Support**: Fully typed codebase for safer and scalable development.

---

## Tech Stack

### Core Technologies:

- **Next.js 15.1.2**: Built on the latest version, with full integration of React 19 features like `useEvent` and `useOptimistic`.
- **React 19**: Leveraging the experimental features of React 19 for better developer experience.
- **TypeScript 5.6.2**: For a fully typed, maintainable codebase.
- **TailwindCSS 3.4.13**: Modern utility-first CSS framework for rapid styling.
- **MongoDB 6.9.0**: A scalable NoSQL database for storing posts and news.

### Key Libraries:

- **@heroicons/react 2.1.5**: Beautiful and scalable icons for the UI.
- **@tailwindcss/typography 0.5.15**: Enhanced typography for content-rich pages.
- **gray-matter 4.0.3**: To parse frontmatter metadata in Markdown files.
- **react-markdown 9.0.1**: For rendering Markdown posts dynamically.
- **react-syntax-highlighter 15.5.0**: To add syntax highlighting for code snippets in blog posts.

### Developer Tools:

- **Turbopack**: A fast bundler for development builds, ensuring optimal performance.
- **ESLint 8.57.1**: For maintaining a clean and consistent code style.
- **Prettier 3.3.3 + Prettier Plugin for TailwindCSS 0.6.8**: For automatically formatting code, including Tailwind class sorting.
- **PostCSS 8.4.47**: Configured to work seamlessly with TailwindCSS.

---

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js**: >= 16.x
- **pnpm**: Latest version

### Clone the Repository

```bash
git clone https://github.com/ZavNatalia/nextjs-blog.git
cd nextjs-blog
```

### Install Dependencies

Using `pnpm`:

```bash
pnpm install
```

### Run the Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to view the application.

---

## Project Structure

```plaintext
.
├── .next/             # Build output directory (generated automatically)
├── app/               # Next.js App Router (pages and layouts)
├── components/        # Reusable UI components
├── lib/               # Utility functions and helpers
├── news/              # List of articles with news
├── posts/             # List of articles with posts
├── public/            # Static assets (images, favicons, etc.)
```

---

## Scripts

The project includes the following scripts:

| Script        | Description                           |
| ------------- | ------------------------------------- |
| `pnpm dev`    | Starts the development server         |
| `pnpm build`  | Builds the application for production |
| `pnpm export` | Exports the static version of the app |
| `pnpm start`  | Starts the production server          |
| `pnpm lint`   | Runs ESLint to check for code issues  |
| `pnpm format` | Formats the code using Prettier       |

---

## Styling and Theming

This project uses **TailwindCSS** for styling. The configuration is extended using the `@tailwindcss/typography` plugin, which enhances the readability of content-rich pages like blogs.

Example Tailwind utility for buttons:

```css
.button {
    @apply focus-visible:ring-accent inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary;
}
```

---

## Future Enhancements

- **Search Functionality**: Add a feature to search for posts and news.
- **User Authentication**: Enable users to log in and submit their own posts.
- **Commenting System**: Allow discussions on posts.
- **Integration with APIs**: Dynamically fetch news and trends from external sources.
- **Theming**: Add light and dark theme support.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- Thanks to the **Next.js**, **React**, **TailwindCSS**, and **TypeScript** communities for their incredible tools and support.

---
