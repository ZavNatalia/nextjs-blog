'use client';

import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) =>
    fetch(url).then((r) => (r.ok ? r.json() : null));

export function MessagesNavItem({
    title,
    normalizedPathname,
    onClick,
}: {
    title: string;
    normalizedPathname: string;
    onClick?: () => void;
}) {
    const isActive = normalizedPathname === '/admin/messages';

    const { data } = useSWR('/api/messages/unread-count', fetcher, {
        refreshInterval: 60_000,
        revalidateOnFocus: true,
        dedupingInterval: 10_000,
    });

    const unreadCount: number = data?.count ?? 0;

    return (
        <li>
            <Link
                href="/admin/messages"
                title={title}
                className={`link relative block px-2 py-2 text-lg font-medium transition-colors duration-200 hover:text-accent md:py-1 ${isActive ? 'text-accent' : 'text-foreground'}`}
                onClick={onClick}
            >
                {title}
                {unreadCount > 0 && (
                    <span
                        aria-label={`${unreadCount} unread`}
                        className="absolute -top-1 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1 text-xs font-bold text-white"
                    >
                        {unreadCount}
                    </span>
                )}
            </Link>
        </li>
    );
}
