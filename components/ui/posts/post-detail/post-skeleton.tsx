export default function PostSkeleton() {
    return (
        <div className="mx-auto w-full space-y-4 rounded-2xl p-3 md:p-4 lg:max-w-7xl lg:p-10">
            <header className="relative mb-6 flex animate-pulse flex-col gap-1 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent md:mb-10 md:gap-4 md:pb-8">
                <div className="h-8 max-w-96 rounded-lg bg-background-tertiary md:h-10"></div>
                <div className="h-4 max-w-32 rounded-lg bg-background-tertiary md:h-5 md:max-w-44"></div>
            </header>
            <div className="h-3 animate-pulse rounded-lg bg-background-tertiary md:h-4" />
            <div className="h-3 w-5/6 animate-pulse rounded-lg bg-background-tertiary md:h-4" />
            <div className="h-3 w-full animate-pulse rounded-lg bg-background-tertiary md:h-4" />
            <div className="h-3 w-3/4 animate-pulse rounded-lg bg-background-tertiary md:h-4" />
        </div>
    );
}
