import Link from 'next/link';

import { useDictionary } from '@/hooks/useDictionary';

export default function Logo({ title }: { title: string }) {
    const dictionary = useDictionary()?.['common'];

    return (
        <Link
            href="/"
            title={title}
            aria-label={title}
            className="link mr-1 px-2 py-1"
        >
            <div className="flex items-center gap-2 font-bold">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-accent md:size-6"
                    aria-hidden="true"
                >
                    {/* Terminal window */}
                    <rect
                        x="2"
                        y="3"
                        width="20"
                        height="18"
                        rx="2.5"
                        ry="2.5"
                    />
                    {/* Title bar dots */}
                    <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
                    <circle cx="9" cy="6.5" r="0.75" fill="currentColor" />
                    <circle cx="12" cy="6.5" r="0.75" fill="currentColor" />
                    {/* Divider */}
                    <line x1="2" y1="9" x2="22" y2="9" />
                    {/* Prompt >_ */}
                    <polyline
                        points="6,12.5 9,14.5 6,16.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <line
                        x1="11"
                        y1="16.5"
                        x2="15"
                        y2="16.5"
                        strokeLinecap="round"
                    />
                </svg>
                <p className="font-mono text-base tracking-wider text-accent md:text-lg">
                    {dictionary.blogTitle}
                </p>
            </div>
        </Link>
    );
}
