export default function NewsItemSkeleton() {
    return (
        <li>
            <header className="after:bg-accent relative mb-6 flex w-full flex-col gap-3 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full dark:after:bg-accent-700 md:mb-10 md:flex-row md:justify-between md:gap-10 md:pb-8">
                <div>
                    <div className="mb-2 h-8 w-3/4 animate-pulse rounded-lg bg-foreground-muted/20 md:mb-4 md:h-9 lg:h-10" />
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-foreground-muted/20" />
                </div>
            </header>
            <div className="flex flex-col gap-4">
                <div className="h-4 w-full animate-pulse rounded-lg bg-foreground-muted/10" />
                <div className="h-4 w-5/6 animate-pulse rounded-lg bg-foreground-muted/10" />
                <div className="h-4 w-4/6 animate-pulse rounded-lg bg-foreground-muted/10" />
                <div className="h-4 w-3/4 animate-pulse rounded-lg bg-foreground-muted/10" />
            </div>
        </li>
    );
}
