const SquareSkeletonElement = () => (
    <div className="square-skeleton mb-2 aspect-square w-full animate-pulse rounded-xl bg-primary-light" />
);

function PostCardSkeleton() {
    return (
        <li className="grid grid-cols-[220px_1fr] gap-5 rounded-3xl bg-primary-light/60 p-3 md:p-4">
            <SquareSkeletonElement />
            <div className="mt-2 flex flex-col gap-2">
                <div className="mb-1 h-10 w-full rounded-lg bg-primary-light/90" />
                <div className="mb-2 h-3 max-w-24 rounded-lg bg-primary/50" />
                <div className="h-4 w-full rounded-lg bg-primary-light/80" />
                <div className="h-4 w-full rounded-lg bg-primary-light/80" />
                <div className="h-4 w-full rounded-lg bg-primary-light/80" />
                <div className="h-4 w-2/3 rounded-lg bg-primary-light/80" />
            </div>
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
        <div className="w-full">
            <h2 className="mb-10 text-center text-4xl font-bold">{title}</h2>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: count }, (_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </ul>
        </div>
    );
}
