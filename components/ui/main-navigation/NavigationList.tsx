import Link from 'next/link';
import ProfileButton from '@/components/ui/main-navigation/ProfileButton';
import { Loader } from '@/components/ui/Loader';

interface NavigationItem {
    href: string;
    label: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    { href: '/', label: 'home' },
    { href: '/posts', label: 'posts' },
    { href: '/contact', label: 'contact' },
];

function NavListItem({
    href,
    title,
    normalizedPathname,
    onClick,
}: {
    href: string;
    title: any;
    normalizedPathname: string;
    onClick?: () => void;
}) {
    const isActive = normalizedPathname === href;

    return (
        <li key={href}>
            <Link
                href={href}
                title={title}
                className={`block rounded-xl px-2 py-2 text-base transition-colors duration-200 hover:text-accent dark:hover:text-accent xl:text-lg ${isActive ? 'text-accent' : 'text-foreground dark:text-foreground-onDark'}`}
                onClick={onClick}
            >
                {title}
            </Link>
        </li>
    );
}

export function NavigationList({
    normalizedPathname,
    session,
    status,
    dictionary,
    onClick,
}: {
    normalizedPathname: string;
    session: any;
    status: string;
    dictionary: Record<string, any>;
    onClick?: () => void;
}) {
    return (
        <ul className="flex flex-col items-center gap-4 text-lg md:flex-row md:gap-2 md:text-base">
            {NAVIGATION_ITEMS.map(({ href, label }) => (
                <NavListItem
                    key={href}
                    href={href}
                    title={dictionary[label]}
                    normalizedPathname={normalizedPathname}
                    onClick={onClick}
                />
            ))}
            {status === 'loading' && (
                <Loader size={40} borderWidth={2} paddings={'p-2'} />
            )}

            {!session && status !== 'loading' && (
                <NavListItem
                    key="/auth"
                    href="/auth"
                    title={dictionary['auth']}
                    normalizedPathname={normalizedPathname}
                    onClick={onClick}
                />
            )}
            {status === 'authenticated' && (
                <ProfileButton
                    title={dictionary['userProfile']}
                    normalizedPathname={normalizedPathname}
                    onClick={onClick}
                />
            )}
        </ul>
    );
}
