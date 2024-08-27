import Link from 'next/link';
import Image from 'next/image';

export interface IPost {
    slug: string;
    title: string;
    date: string;
    image: any;
    excerpt: string;
}

export default function PostItem({post}: { post: IPost }) {
    const {title, date, excerpt, image, slug} = post;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    const linkPath = `posts/${slug}`

    return (
        <li>
            <Link href={linkPath} className='flex flex-col gap-2 p-5 bg-gray-700
            rounded-3xl hover:scale-105 transition-transform duration-300'>
                <Image
                    className='rounded-xl mb-2'
                    src={imagePath}
                    alt={title}
                    width={250}
                    height={180}
                    layout='responsive'
                />
                <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <time className="text-sm text-gray-400">{formattedDate}</time>
                </div>
                <p>{excerpt}</p>
            </Link>
        </li>
    )
}