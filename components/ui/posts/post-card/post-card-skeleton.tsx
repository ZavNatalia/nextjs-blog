const SquareSkeletonElement = () => (
    <div className="square-skeleton mb-2 hidden aspect-square w-full animate-pulse rounded-xl bg-primary-light lg:block" />
);

export function PostCardSkeleton() {
    return (
        <li className="grid grid-cols-1 gap-5 rounded-3xl bg-primary-light/60 p-4 transition-colors duration-500 hover:bg-primary-light/80 lg:grid-cols-[220px_1fr]">
            <SquareSkeletonElement />
            <div className="flex flex-col gap-2 lg:mt-2">
                <div className="mb-1 h-8 w-full animate-pulse rounded-lg bg-primary-light/90 lg:h-10 lg:animate-none" />
                <div className="h-3 max-w-24 rounded-lg bg-primary/50 lg:mb-2" />
                <hr className="mx-[-16px] my-2 border-t border-primary-light lg:hidden" />
                <div className="h-4 w-full rounded-lg bg-primary-light/80" />
                <div className="h-4 w-full rounded-lg bg-primary-light/80" />
                <div className="h-4 w-2/3 rounded-lg bg-primary-light/80" />
            </div>
        </li>
    );
}
