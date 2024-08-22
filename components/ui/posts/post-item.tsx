import Link from 'next/link';
import Image from 'next/image';

export interface IPost {
    slug: string;
    title: string;
    date: string;
    image: string;
    excerpt: string;
}
export default function PostItem({post}: {post: IPost}) {
    const {title, date, excerpt, image, slug} = post;
    const formattedDate = new Date(date). toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    return (
        <li>
            <Link href={`/posts/${slug}`}>
                <div>
                    <Image
                        src={imagePath}
                        alt={title}
                        width={300}
                        height={200}
                    />
                </div>
                <div>
                    <h3>{title}</h3>
                    <time>{formattedDate}</time>
                    <p>{excerpt}</p>
                </div>
            </Link>
        </li>
    )
}