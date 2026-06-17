export default function NewsItemSkeleton() {
    return (
        <li>
            <header className="relative mb-6 flex w-full flex-col gap-4 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent md:mb-10 md:flex-row md:justify-between md:pb-8 dark:after:bg-accent-700">
                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-foreground-muted/20 md:h-9" />
                <div className="h-6 w-40 shrink-0 animate-pulse rounded-lg bg-foreground-muted/20" />
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
