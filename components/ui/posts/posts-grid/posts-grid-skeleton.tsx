const SkeletonElement = (className: { className: string }) => (
    <div className={`rounded-lg bg-primary-light ${className}`} />
);

const SquareSkeletonElement = () => (
    <div className="square-skeleton mb-2 aspect-square w-full animate-pulse rounded-xl bg-primary-light" />
);

function PostCardSkeleton() {
    return (
        <li className="flex w-full flex-col gap-2 rounded-3xl bg-primary-light/60 p-4 md:p-5">
            <SquareSkeletonElement />
            <SkeletonElement className="mb-1 h-6 w-full" />
            <SkeletonElement className="mb-2 h-3 max-w-24 bg-primary/80" />
            <SkeletonElement className="h-4 w-full" />
            <SkeletonElement className="h-4 w-2/3" />
        </li>
    );
}

export default function PostsGridSkeleton({
    title,
    count = 4,
}: {
    title: string;
    count?: number;
}) {
    return (
        <div>
            <h2 className="mb-10 text-center text-4xl font-bold">{title}</h2>
            <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: count }, (_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </ul>
        </div>
    );
}
