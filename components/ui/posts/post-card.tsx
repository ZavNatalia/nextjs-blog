import Link from 'next/link';
import Image from 'next/image';

export interface IPost {
    slug: string;
    title: string;
    date: string;
    image?: any;
    excerpt: string;
    content?: string;
    isFeatured: boolean;
}

export default function PostCard({post}: { post: IPost }) {
    const {title, date, excerpt, image, slug} = post;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    const linkPath = `posts/${slug}`;

    return (
        <li>
            <Link href={linkPath} className='flex flex-col gap-1 w-[290px] p-5 bg-primary-light/60
            rounded-3xl'>
                <div className='overflow-hidden w-[250px] h-[250px] rounded-xl mb-2'>
                    <Image
                        className='rounded-xl hover:scale-110 transition-transform duration-500'
                        src={imagePath}
                        alt={title}
                        width={250}
                        height={250}
                    />
                </div>
                <h3 className="text-lg font-bold max-h-[4rem] line-clamp-2 leading-6 text-ellipsis">{title}</h3>
                <time className="text-xs text-secondary whitespace-nowrap mb-3">{formattedDate}</time>
                <p className='text-sm max-h-[7rem] line-clamp-5 text-ellipsis'>{excerpt}</p>
            </Link>
        </li>
    )
}