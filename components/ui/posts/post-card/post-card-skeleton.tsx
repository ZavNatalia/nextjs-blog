export function PostCardSkeleton() {
    return (
        <li className="w-full overflow-hidden rounded-3xl shadow-md">
            <div className="flex justify-between rounded-t-3xl bg-background-tertiary/50 px-5 py-4 shadow-md lg:px-6 lg:py-5">
                <div className="h-7 w-2/5 animate-pulse rounded-lg bg-foreground-muted/20 lg:h-8" />
                <div className="h-4 w-20 rounded-lg bg-foreground-muted/20" />
            </div>
            <div className="bg-secondary flex flex-col justify-between gap-4 rounded-b-3xl px-5 pb-5 pt-4 shadow-md lg:px-6">
                <div className="mt-1 flex flex-col gap-4">
                    <div className="bg-tertiary h-4 w-full rounded-lg" />
                    <div className="bg-tertiary h-4 w-5/6 rounded-lg" />
                    <div className="bg-tertiary hidden h-4 w-3/4 rounded-lg lg:block" />
                </div>
                <div className="h-10 w-[136px] self-end rounded-lg bg-background-tertiary/70" />
            </div>
        </li>
    );
}
