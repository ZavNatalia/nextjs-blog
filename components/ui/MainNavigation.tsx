'use client';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Bars4Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/hooks/useDictionary';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface NavigationItem {
    href: string;
    label: string;
}

export default function MainNavigation() {
    const { data: session, status } = useSession();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dictionary = useDictionary();
    const navDict = dictionary.navigation;

    const NAVIGATION_ITEMS: NavigationItem[] = [
        { href: '/', label: 'home' },
        { href: '/posts', label: 'posts' },
        { href: '/contact', label: 'contact' },
    ];

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const renderListItem = (href: string, label: string, onClick?: () => void) => {

        const normalizedPathname = pathname.replace(/^\/(en|ru)/, '').split('?')[0] || '/';
        const isActive = normalizedPathname === href;

        return (
            <li key={href}>
                <Link
                    href={href}
                    className={`block text-md xl:text-lg transition-colors duration-200 
                    px-2 py-2 rounded-xl hover:text-accent dark:hover:text-accent
                    ${isActive ? 'text-accent' : 'text-foreground dark:text-foreground-onDark'}`}
                    onClick={onClick}
                >
                    {navDict[label]}
                </Link>
            </li>
        );
    };

    const renderLogoutButton = () => (
        <li key="logout">
            <button onClick={() => signOut()} className="button-secondary font-normal bg-primary-light lg:ml-3">
                {navDict.logout}
            </button>
        </li>
    );

    const renderThemeSwitcher = (
    <button onClick={toggleTheme} className="p-2 rounded-xl">
        {theme === 'light' ? <MoonIcon
                className="icon-button w-6 h-6 " /> :
        <SunIcon
                className="icon-button w-6 h-6 " />}
    </button>
    )

    return (
        <header className="bg-primary px-4 dark:bg-dark-strong md:sticky md:top-0 w-full z-10 shadow-lg">
            <div className="container mx-auto h-[88px] flex items-center justify-between p-4">
                <Link href="/" aria-label="Home" className='mr-3'>
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
                        {status === 'loading' && <li>{navDict.loading}</li>}
                        {!session && status !== 'loading' && renderListItem('/auth', 'auth')}
                        {session && renderListItem('/profile', 'profile')}
                        {session && renderLogoutButton()}
                    </ul>
                    <div className="flex items-center gap-2 ml-6 text-muted-dark dark:text-muted-light">
                        <span>|</span>
                        {renderThemeSwitcher}
                        <LocaleSwitcher />
                    </div>
                </nav>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <nav
                    className="absolute top-20 left-0 w-full bg-primary-contrast dark:bg-dark-soft p-6 shadow-lg lg:hidden">
                    <ul className="flex flex-col gap-4 text-lg">
                        {NAVIGATION_ITEMS.map(({ href, label }) => renderListItem(href, label, toggleMenu))}
                        {!session && status !== 'loading' && renderListItem('/auth', 'auth', toggleMenu)}
                        {session && renderListItem('/profile', 'profile', toggleMenu)}
                        {renderThemeSwitcher}
                        <LocaleSwitcher />
                        {session && renderLogoutButton()}
                    </ul>
                </nav>
            )}
        </header>
    );
}
