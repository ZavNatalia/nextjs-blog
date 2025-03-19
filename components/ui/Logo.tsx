import Link from 'next/link';

export default function Logo({ title }: { title: string }) {
    return (
        <Link href="/" title={title} aria-label={title} className="mr-1">
            <div className="flex items-center gap-2 text-sm font-bold">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-accent dark:text-accent-dark md:size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                    />
                </svg>
                <p className="text-sm uppercase tracking-wider text-accent dark:text-accent-dark md:text-base">
                    Natalia&apos;s Next blog
                </p>
            </div>
        </Link>
    );
}
