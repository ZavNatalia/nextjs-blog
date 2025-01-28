const SquareSkeletonElement = () => (
    <div className="square-skeleton hidden aspect-square w-full animate-pulse rounded-xl bg-primary-light lg:block" />
);

export function PostCardSkeleton() {
    return (
        <li className="w-full overflow-hidden">
            <div className="flex justify-between rounded-t-3xl bg-primary-light/25 px-5 py-4 shadow-md lg:px-6 lg:py-5">
                <div className="h-7 w-3/5 animate-pulse rounded-lg bg-primary-light/90 lg:h-8 lg:animate-none" />
                <div className="h-4 w-20 rounded-lg bg-primary-light/60" />
            </div>
            <div className="grid grid-cols-1 gap-5 rounded-b-3xl bg-primary-light/40 px-5 pb-5 pt-4 lg:grid-cols-[180px_1fr] lg:px-6">
                <SquareSkeletonElement />
                <div className="flex flex-col justify-between gap-3">
                    <div className="mt-1 flex flex-col gap-3">
                        <div className="h-4 w-full rounded-lg bg-primary-light/80" />
                        <div className="h-4 w-5/6 rounded-lg bg-primary-light/80" />
                        <div className="h-4 w-3/4 rounded-lg bg-primary-light/80" />
                    </div>
                    <div className="h-12 w-[121px] self-end rounded-lg bg-primary-light/80" />
                </div>
            </div>
        </li>
    );
}
