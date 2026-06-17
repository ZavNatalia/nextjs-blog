export default function HeroCardSkeleton() {
    return (
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-background-secondary px-2 py-4 shadow-lg">
            <div className="flex flex-col items-center gap-4 px-2 py-6 sm:p-6 md:max-w-[60%] md:items-start md:px-4 md:py-6">
                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-foreground-muted/20 md:h-9" />
                <div className="flex w-full max-w-md flex-col gap-2">
                    <div className="h-6 w-full animate-pulse rounded-lg bg-foreground-muted/15" />
                    <div className="h-6 w-5/6 animate-pulse rounded-lg bg-foreground-muted/15" />
                </div>
                <div className="mt-2 h-10 w-[160px] animate-pulse rounded-lg bg-foreground-muted/20" />
            </div>
        </div>
    );
}
