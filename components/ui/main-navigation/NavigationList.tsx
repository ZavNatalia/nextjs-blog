import Link from 'next/link';

import { Loader } from '@/components/ui/Loader';
import { MessagesNavItem } from '@/components/ui/main-navigation/MessagesNavItem';
import { ModerationNavItem } from '@/components/ui/main-navigation/ModerationNavItem';
import ProfileButton from '@/components/ui/main-navigation/ProfileButton';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import { localePath } from '@/lib/locale-path';

type NavLabel = 'home' | 'posts' | 'contact';

interface NavigationItem {
    href: string;
    label: NavLabel;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    { href: '/', label: 'home' },
    { href: '/posts', label: 'posts' },
    { href: '/contact', label: 'contact' },
];

function NavListItem({
    href,
    locale,
    title,
    normalizedPathname,
    onClick,
}: {
    href: string;
    locale: Locale;
    title: string;
    normalizedPathname: string;
    onClick?: () => void;
}) {
    const isActive = normalizedPathname === href;

    return (
        <li key={href}>
            <Link
                href={localePath(locale, href)}
                title={title}
                className={`link block px-2 py-2 text-base font-medium transition-colors duration-200 hover:text-accent md:py-1 ${isActive ? 'text-accent' : 'text-foreground'}`}
                onClick={onClick}
            >
                {title}
            </Link>
        </li>
    );
}

export function NavigationList({
    locale,
    normalizedPathname,
    session,
    status,
    dictionary,
    onClick,
}: {
    locale: Locale;
    normalizedPathname: string;
    session: {
        user?: {
            email?: string | null;
            name?: string | null;
            isAdmin?: boolean;
        };
    } | null;
    status: string;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['navigation'];
    onClick?: () => void;
}) {
    return (
        <ul className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            {NAVIGATION_ITEMS.map(({ href, label }) => (
                <NavListItem
                    key={href}
                    href={href}
                    locale={locale}
                    title={dictionary[label]}
                    normalizedPathname={normalizedPathname}
                    onClick={onClick}
                />
            ))}
            {status === 'loading' && (
                <Loader size={32} borderWidth={2} paddings={'p-2'} />
            )}

            {!session && status !== 'loading' && (
                <NavListItem
                    key="/auth"
                    href="/auth"
                    locale={locale}
                    title={dictionary['auth']}
                    normalizedPathname={normalizedPathname}
                    onClick={onClick}
                />
            )}
            {status === 'authenticated' && (
                <ProfileButton
                    locale={locale}
                    title={dictionary['userProfile']}
                    normalizedPathname={normalizedPathname}
                    userName={session?.user?.name || undefined}
                    userEmail={session?.user?.email || undefined}
                    onClick={onClick}
                />
            )}
            {status === 'authenticated' && session?.user?.isAdmin && (
                <>
                    <ModerationNavItem
                        locale={locale}
                        title={dictionary['moderation']}
                        normalizedPathname={normalizedPathname}
                        onClick={onClick}
                    />
                    <MessagesNavItem
                        locale={locale}
                        title={dictionary['messages']}
                        normalizedPathname={normalizedPathname}
                        onClick={onClick}
                    />
                </>
            )}
        </ul>
    );
}
