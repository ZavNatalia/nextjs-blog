export default function PostSkeleton() {
    return (
        <div className="dark:bg-secondary bg-tertiary mt-[40px] w-full max-w-5xl animate-pulse space-y-4 rounded-3xl p-3 md:p-4 lg:mt-[44px] lg:p-10">
            <header className="relative mb-6 flex flex-col gap-3 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent-700 md:mb-10 md:flex-row md:justify-between md:gap-10 md:pb-8">
                <div className="w-full">
                    <div className="dark:bg-secondary bg-tertiary mb-4 h-12 max-w-96 rounded-lg md:h-14"></div>
                    <div className="bg-background/50 h-4 max-w-32 rounded-lg md:h-5 md:max-w-44"></div>
                </div>
                <div className="dark:bg-secondary bg-tertiary h-[200px] w-[200px] flex-shrink-0 self-center rounded-xl md:h-[260px] md:w-[260px]" />
            </header>
            <div className="dark:bg-secondary bg-tertiary h-3 rounded-lg md:h-4" />
            <div className="dark:bg-secondary bg-tertiary h-3 w-5/6 rounded-lg md:h-4" />
            <div className="dark:bg-secondary bg-tertiary h-3 w-full rounded-lg md:h-4" />
            <div className="dark:bg-secondary bg-tertiary h-3 w-3/4 rounded-lg md:h-4" />
        </div>
    );
}
