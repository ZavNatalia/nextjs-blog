export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <div className='w-full flex justify-center items-center bg-primary dark:bg-dark p-2'>
            <p className='text-muted-light text-xs'>© {currentYear} Natalia&apos;s Next blog</p>
        </div>
    )
}