'use client';

import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.ok ? r.json() : null);

export function ModerationNavItem({
    title,
    normalizedPathname,
    onClick,
}: {
    title: string;
    normalizedPathname: string;
    onClick?: () => void;
}) {
    const isActive = normalizedPathname === '/admin/comments';

    const { data } = useSWR('/api/comments/pending-count', fetcher, {
        refreshInterval: 60_000,
        revalidateOnFocus: true,
        dedupingInterval: 10_000,
    });

    const pendingCount: number = data?.count ?? 0;

    return (
        <li>
            <Link
                href="/admin/comments"
                title={title}
                className={`link relative block px-2 py-2 text-lg font-medium transition-colors duration-200 hover:text-accent md:py-1 ${isActive ? 'text-accent' : 'text-foreground'}`}
                onClick={onClick}
            >
                {title}
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1 text-xs font-bold text-white">
                        {pendingCount}
                    </span>
                )}
            </Link>
        </li>
    );
}
