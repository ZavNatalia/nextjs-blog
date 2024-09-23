export default function PostSkeleton() {
    return (
        <div className="animate-pulse space-y-4 w-full md:max-w-[750px] lg:max-w-[812px] mt-[76px]">
            <header className='flex justify-between gap-10 w-full pb-8 mb-10 border-b-accent-hover border-b-8'>
                <div className='w-full'>
                    <div className="mb-4 h-16 max-w-96 bg-primary-light rounded-lg"></div>
                    <div className="h-5 max-w-44 bg-primary rounded-lg"></div>
                </div>
                <div className="flex-shrink-0 h-[200px] md:h-[300px] w-[200px] md:w-[300px] bg-primary-light rounded-3xl"></div>
            </header>
            <div className="h-4 bg-primary-light rounded-lg"></div>
            <div className="h-4 bg-primary-light rounded-lg w-3/4"></div>
            <div className="h-4 bg-primary-light rounded-lg w-5/6"></div>
        </div>
    )
}