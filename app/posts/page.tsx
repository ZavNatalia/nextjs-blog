import AllPosts from '@/components/ui/posts/all-posts';
import { getAllPosts } from '@/lib/posts-util';

const DUMMY_ALL_DATA = [
    {
        slug: 'next-js-15-rc',
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
    },
    {
        slug: 'security-in-next-js',
        title: 'How to Think About Security in Next.js',
        date: '2023-10-23',
        image: 'security-in-next-js.webp',
        excerpt: 'React Server Components (RSC) in App Router is a novel paradigm that eliminates much of the redundancy and potential risks linked with conventional methods. Given the newness, developers and subsequently security teams may find it challenging to align their existing security protocols with this model.',
    },
    {
        slug: 'next-js-app-router-update',
        title: 'Next.js App Router Update',
        date: '2023-06-22',
        image: 'next-js-app-router-update.webp',
        excerpt: 'The App Router represents a new foundation for the future of Next.js, but we recognize there are opportunities to make the experience better. We\'d like to give an update on what our current priorities are.',
    }
]
export default function Posts() {
    const posts = getAllPosts();
    return (
        <main className="flex min-h-full flex-col items-center justify-between p-24 w-full">
            <AllPosts posts={posts}/>
        </main>
    )
}