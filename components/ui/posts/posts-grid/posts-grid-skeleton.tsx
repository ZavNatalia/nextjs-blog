const SkeletonElement = ({ className }) => (
    <div className={`bg-primary-light rounded-lg ${className}`} />
);

const SquareSkeletonElement = () => (
    <div className='w-full mb-2 aspect-square square-skeleton animate-pulse bg-primary-light rounded-xl' />
);

function PostCardSkeleton() {
    return (
        <li className="flex w-full flex-col gap-2 p-4 md:p-5 bg-primary-light/60 rounded-3xl">
            <SquareSkeletonElement/>
            <SkeletonElement className="h-6 mb-1 w-full" />
            <SkeletonElement className="h-3 mb-2 max-w-24 bg-primary/80" />
            <SkeletonElement className="h-4 w-full" />
            <SkeletonElement className="h-4 w-2/3" />
        </li>
    );
}

export default function PostsGridSkeleton({ count = 4, title }) {
    return (
        <div>
            <h2 className="text-4xl font-bold mb-10 text-center">{title}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                {Array.from({length: count}, (_, index) => (
                    <PostCardSkeleton key={index}/>
                ))}
            </ul>
        </div>
    );
}
