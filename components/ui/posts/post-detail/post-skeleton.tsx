export default function PostSkeleton() {
    return (
        <div className="mt-[76px] w-full animate-pulse space-y-4 rounded-3xl bg-primary-light/30 p-20 lg:max-w-[980px]">
            <header className="mb-10 flex w-full justify-between gap-10 border-b-8 border-b-accent-hover pb-8">
                <div className="w-full">
                    <div className="mb-4 h-16 max-w-96 rounded-lg bg-primary-light"></div>
                    <div className="h-5 max-w-44 rounded-lg bg-primary"></div>
                </div>
                <div className="h-[200px] w-[200px] flex-shrink-0 rounded-3xl bg-primary-light md:h-[300px] md:w-[300px]"></div>
            </header>
            <div className="h-4 rounded-lg bg-primary-light"></div>
            <div className="h-4 w-3/4 rounded-lg bg-primary-light"></div>
            <div className="h-4 w-5/6 rounded-lg bg-primary-light"></div>
        </div>
    );
}
