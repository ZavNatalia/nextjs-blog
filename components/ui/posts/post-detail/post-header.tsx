import Image from 'next/image';

export default function PostHeader({title, date, imagePath}: { title: string, date: string, imagePath: string }) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return (
        <header className='flex justify-between gap-10 max-w-[820px] pb-8 mb-10 border-b-accent-hover border-b-8'>
            <div>
                <h1 className='font-bold text-5xl mb-4 leading-snug'>{title}</h1>
                <span className='text-secondary text-lg'>{formattedDate}</span>
            </div>
            <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] flex-shrink-0 relative">
                <Image
                    className="rounded-3xl object-cover"
                    src={imagePath}
                    alt={title}
                    fill
                    sizes="300px"
                />
            </div>
        </header>
    )
}