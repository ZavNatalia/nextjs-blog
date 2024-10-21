import { PostCardSkeleton } from '@/components/ui/posts/post-card/post-card-skeleton';

export default function PostsGridSkeleton({
    title,
    count = 4,
}: {
    title: string;
    count?: number;
}) {
    return (
        <div className="mx-auto w-full">
            <h2 className="mb-5 text-center text-2xl font-bold lg:mb-10 lg:text-4xl">
                {title}
            </h2>
            <ul className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {Array.from({ length: count }, (_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </ul>
        </div>
    );
}
