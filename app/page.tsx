import Hero from '@/components/ui/hero-card';
import { IPost } from '@/components/ui/posts/post-item';
import FeaturedPosts from '@/components/ui/posts/featured-posts';

const DUMMY_DATA: IPost[] = [
    {
        slug: 'next-js-15-RC',
        title: 'Next.js 15 RC',
        date: '2024-05-23',
        image: 'next-js-15-rc.webp',
        excerpt: 'The Next.js 15 Release Candidate (RC) is now available. This early version allows you to test the latest features before the upcoming stable release.',
    },
    {
        slug: 'next-js-14-2',
        title: 'Next.js 14.2',
        date: '2024-04-11',
        image: 'next-js-14-2.webp',
        excerpt: 'Next.js 14.2 includes development, production, and caching improvements.',
    },
    {
        slug: 'next-js-14-3',
        title: 'Next.js 14.3',
        date: '2024-04-12',
        image: 'next-js-14-3.webp',
        excerpt: 'Next.js 14.3 includes development, production, and caching improvements.',
    },
    {
        slug: 'next-js-14-4',
        title: 'Next.js 14.4',
        date: '2024-04-14',
        image: 'next-js-14-4.webp',
        excerpt: 'Next.js 14.4 includes development, production, and caching improvements.',
    }
]
export default function Home() {
  return (
      <main className="flex min-h-full flex-col items-center justify-between p-14 gap-8">
         <Hero/>
          <FeaturedPosts posts={DUMMY_DATA}/>
      </main>
  );
}
