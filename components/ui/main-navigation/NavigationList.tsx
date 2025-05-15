import Link from 'next/link';
import ProfileButton from '@/components/ui/main-navigation/ProfileButton';
import { Loader } from '@/components/ui/Loader';
import { getDictionary } from '@/get-dictionary';

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
                className={`link hover:text-accent block px-2 py-1 text-base font-medium transition-colors duration-200 ${isActive ? 'text-accent' : 'text-foreground'}`}
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
    dictionary: Awaited<ReturnType<typeof getDictionary>>['navigation'];
    onClick?: () => void;
}) {
    return (
        <ul className="flex flex-col items-center gap-2 text-lg md:flex-row md:gap-3 md:text-base">
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
