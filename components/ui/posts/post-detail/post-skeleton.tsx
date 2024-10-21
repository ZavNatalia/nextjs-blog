export default function PostSkeleton() {
    return (
        <div className="mt-[76px] w-full max-w-5xl animate-pulse space-y-4 rounded-3xl bg-primary-light/30 p-5 lg:p-10">
            <header className="relative mb-6 md:mb-10 flex flex-col gap-3 md:gap-10 pb-6 md:pb-8 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent-hover md:flex-row md:justify-between">
                <div className="w-full">
                    <div className="mb-4 h-12 md:h-14 max-w-96 rounded-lg bg-primary-light"></div>
                    <div className="h-4 md:h-5 max-w-32 md:max-w-44 rounded-lg bg-primary/50"></div>
                </div>
                <div className="h-[200px] w-[200px] flex-shrink-0 rounded-xl bg-primary-light md:h-[300px] md:w-[300px] self-center"/>
            </header>
            <div className="h-3 md:h-4 rounded-lg bg-primary-light"></div>
            <div className="h-3 md:h-4 w-5/6 rounded-lg bg-primary-light"></div>
            <div className="h-3 md:h-4 w-full rounded-lg bg-primary-light"></div>
            <div className="h-3 md:h-4 w-3/4 rounded-lg bg-primary-light"></div>
        </div>
    );
}
