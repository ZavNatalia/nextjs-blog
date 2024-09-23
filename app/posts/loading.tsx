import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

export default function Loading() {
    return (
        <main className="page">
            <div className='w-full mt-[76px] mr-[14px]'>
                <PostsGridSkeleton title='All posts'/>
            </div>
        </main>
    )
}