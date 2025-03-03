'use client';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/hooks/useDictionary';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import Image from 'next/image';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

interface NavigationItem {
    href: string;
    label: string;
}

function ProfileLoadingSpinner() {
    return (
        <div className="mx-2 h-10 w-10 animate-spin rounded-full border-2 border-border-dark/70 border-t-border-dark/40 dark:border-border-dark dark:border-t-border-dark/40" />
    );
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    { href: '/', label: 'home' },
    { href: '/posts', label: 'posts' },
    { href: '/contact', label: 'contact' },
];

export default function MainNavigation() {
    const { data: session, status } = useSession();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dictionary = useDictionary()?.['navigation'];

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const renderListItem = (
        href: string,
        label: string,
        onClick?: () => void,
    ) => {
        const normalizedPathname =
            pathname.replace(/^\/(en|ru)/, '').split('?')[0] || '/';
        const isActive = normalizedPathname === href;

        return (
            <li key={href}>
                <Link
                    href={href}
                    title={dictionary[label]}
                    className={`text-md block rounded-xl px-2 py-2 transition-colors duration-200 hover:text-accent dark:hover:text-accent xl:text-lg ${isActive ? 'text-accent' : 'text-foreground dark:text-foreground-onDark'}`}
                    onClick={onClick}
                >
                    {dictionary[label]}
                </Link>
            </li>
        );
    };

    const renderProfileButton = (onClick?: () => void) => {
        return (
            <li key="profile">
                <Link
                    href="/profile"
                    title={dictionary.userProfile}
                    className="rounded-full"
                    onClick={onClick}
                >
                    <div className="relative mx-2 h-12 w-12 overflow-hidden rounded-full border-2 border-border-dark/70 bg-primary shadow-md transition-colors duration-300 hover:border-accent hover:bg-accent dark:border-border-light hover:dark:border-accent-dark hover:dark:bg-accent-dark md:h-10 md:w-10 md:dark:border-border-dark">
                        <Image
                            src="/images/site/default-avatar.png"
                            alt="User avatar"
                            width={96}
                            height={96}
                            className="rounded-full"
                            priority
                        />
                    </div>
                </Link>
            </li>
        );
    };

    return (
        <header className="z-10 w-full bg-primary px-4 shadow-lg dark:bg-dark-strong md:sticky md:top-0">
            <div className="mx-auto flex h-[88px] max-w-[90rem] items-center justify-between p-4">
                <Link href="/" aria-label="Home" className="mr-3">
                    <Logo />
                </Link>

                {/* Menu button for mobile devices */}
                <button
                    onClick={toggleMenu}
                    className="block p-2 text-foreground transition md:hidden"
                >
                    {isOpen ? (
                        <XMarkIcon className="h-8 w-8" />
                    ) : (
                        <Bars4Icon className="h-8 w-8" />
                    )}
                </button>

                {/* Desktop menu */}
                <nav className="hidden md:flex">
                    <ul className="text-md flex items-center gap-1 md:gap-2">
                        {NAVIGATION_ITEMS.map(({ href, label }) =>
                            renderListItem(href, label),
                        )}
                        {status === 'loading' && <ProfileLoadingSpinner />}
                        {!session &&
                            status !== 'loading' &&
                            renderListItem('/auth', 'auth')}

                        {status === 'authenticated' && renderProfileButton()}
                    </ul>
                    <div className="ml-4 flex items-center gap-1 text-muted-dark dark:text-muted-light md:gap-2">
                        <span>|</span>
                        <LocaleSwitcher />
                        <span>|</span>
                        <ThemeSwitcher
                            theme={theme}
                            dictionary={dictionary}
                            toggleTheme={toggleTheme}
                        />
                    </div>
                </nav>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <nav className="absolute left-0 top-20 w-full bg-primary-contrast p-6 shadow-lg dark:bg-dark-soft md:hidden">
                    <ul className="flex flex-col gap-4 text-lg">
                        {NAVIGATION_ITEMS.map(({ href, label }) =>
                            renderListItem(href, label, toggleMenu),
                        )}
                        {!session &&
                            renderListItem('/auth', 'auth', toggleMenu)}
                        {status === 'authenticated' &&
                            renderProfileButton(toggleMenu)}
                        <hr className="my-2 border-t border-border dark:border-border" />
                        <ThemeSwitcher
                            theme={theme}
                            dictionary={dictionary}
                            toggleTheme={toggleTheme}
                        />
                        <LocaleSwitcher />
                    </ul>
                </nav>
            )}
        </header>
    );
}
