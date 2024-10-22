import { PostCardSkeleton } from '@/components/ui/posts/post-card/post-card-skeleton';

export default function PostsGridSkeleton({count = 4, }: { count?: number; }) {
    return (
        <ul className="w-full mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: count }, (_, index) => (
                <PostCardSkeleton key={index} />
            ))}
        </ul>
    );
}
