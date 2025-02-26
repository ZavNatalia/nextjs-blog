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
    return <div className="animate-spin h-10 mx-2 w-10 rounded-full border-2
    border-border-dark/70 border-t-border-dark/40
    dark:border-border-dark dark:border-t-border-dark/40"/>;
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

    const renderListItem = (href: string, label: string, onClick?: () => void) => {

        const normalizedPathname = pathname.replace(/^\/(en|ru)/, '').split('?')[0] || '/';
        const isActive = normalizedPathname === href;

        return (
            <li key={href}>
                <Link
                    href={href}
                    title={dictionary[label]}
                    className={`block text-md xl:text-lg transition-colors duration-200 
                    px-2 py-2 rounded-xl hover:text-accent dark:hover:text-accent
                    ${isActive ? 'text-accent' : 'text-foreground dark:text-foreground-onDark'}`}
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
                <Link href="/profile" title={dictionary.userProfile} onClick={onClick}>
                    <div className="relative h-12 lg:h-10 w-12 lg:w-10 mx-2 overflow-hidden rounded-full shadow-md
                        transition-colors duration-300
                        bg-primary
                        hover:bg-accent hover:dark:bg-accent-dark
                        border-2 border-border-dark/70 hover:border-accent
                        dark:border-border-light lg:dark:border-border-dark hover:dark:border-accent-dark">
                        <Image src="/images/site/default-avatar.png" alt="User avatar" width={96} height={96}
                               className="rounded-full" priority />
                    </div>
                </Link>
            </li>
        );
    };

    return (
        <header className="bg-primary px-4 dark:bg-dark-strong md:sticky md:top-0 w-full z-10 shadow-lg">
            <div className="container mx-auto h-[88px] flex items-center justify-between p-4">
                <Link href="/" aria-label="Home" className="mr-3">
                    <Logo />
                </Link>

                {/* Menu button for mobile devices */}
                <button
                    onClick={toggleMenu}
                    className="block lg:hidden p-2 text-foreground transition"
                >
                    {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars4Icon className="w-8 h-8 " />}
                </button>

                {/* Desktop menu */}
                <nav className="hidden lg:flex">
                    <ul className="flex items-center gap-1 lg:gap-2 text-md">
                        {NAVIGATION_ITEMS.map(({ href, label }) => renderListItem(href, label))}
                        {status === 'loading' && <ProfileLoadingSpinner/>}
                        {!session && status !== 'loading' && renderListItem('/auth', 'auth')}

                        {status === 'authenticated' && renderProfileButton()}
                    </ul>
                    <div className="flex items-center gap-1 lg:gap-2 ml-4 text-muted-dark dark:text-muted-light">
                        <span>|</span>
                        <LocaleSwitcher />
                        <span>|</span>
                        <ThemeSwitcher theme={theme} dictionary={dictionary} toggleTheme={toggleTheme}/>
                    </div>
                </nav>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <nav
                    className="absolute top-20 left-0 w-full bg-primary-contrast dark:bg-dark-soft p-6 shadow-lg lg:hidden">
                    <ul className="flex flex-col gap-4 text-lg">
                        {NAVIGATION_ITEMS.map(({ href, label }) => renderListItem(href, label, toggleMenu))}
                        {!session && renderListItem('/auth', 'auth', toggleMenu)}
                        {status === 'authenticated' && renderProfileButton(toggleMenu)}
                        <hr className="border-t border-border dark:border-border my-2" />
                        <ThemeSwitcher theme={theme} dictionary={dictionary} toggleTheme={toggleTheme}/>
                        <LocaleSwitcher />
                    </ul>
                </nav>
            )}
        </header>
    );
}
