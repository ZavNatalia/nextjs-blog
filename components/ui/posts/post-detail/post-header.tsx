import Image from 'next/image';

export default function PostHeader({title, date, imagePath}: { title: string, date: string, imagePath: string }) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return (
        <header className='flex justify-between gap-10 max-w-[820px] pb-8 mb-10 border-b-amber-600 border-b-8'>
            <div>
                <h1 className='font-bold text-5xl mb-4'>{title}</h1>
                <span className='text-gray-400 text-lg'>{formattedDate}</span>
            </div>
            <Image
                className='object-contain rounded-3xl'
                src={imagePath}
                alt={title}
                width={280}
                height={280}
                priority
            />
        </header>
    )
}