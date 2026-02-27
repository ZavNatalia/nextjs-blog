export default function HeroCardSkeleton() {
    return (
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-background-secondary px-2 py-4 shadow-lg">
            <div className="flex flex-col items-center gap-4 px-4 py-6 sm:px-10 sm:py-10 md:max-w-[60%] md:items-start md:py-8">
                <div className="h-9 w-3/4 animate-pulse rounded-lg bg-foreground-muted/20 md:h-10 lg:h-12" />
                <div className="flex w-full max-w-md flex-col gap-2">
                    <div className="h-5 w-full animate-pulse rounded-lg bg-foreground-muted/15 md:h-6" />
                    <div className="h-5 w-5/6 animate-pulse rounded-lg bg-foreground-muted/15 md:h-6" />
                </div>
                <div className="mt-2 h-10 w-[160px] animate-pulse rounded-lg bg-foreground-muted/20" />
            </div>
        </div>
    );
}
