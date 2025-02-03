'use client';

import { useState } from 'react';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

interface NavigationItem {
    href: string;
    label: string;
}

export default function MainNavigation() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const pathname =  usePathname();

    const NAVIGATION_ITEMS: NavigationItem[] = [
        { href: '/', label: 'Home' },
        { href: '/posts', label: 'Posts' },
        { href: '/contact', label: 'Contact' },
    ];

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const renderListItem = (href: string, label: string, onClick?: () => void) => {
        const isActive = pathname === href;

        return (
            <li key={href}>
                <Link
                    href={href}
                    className={`block text-lg transition-colors duration-200 
                    px-2 py-3 hover:text-accent 
                    ${isActive ? 'text-accent' : 'text-primary'}`}
                    onClick={onClick} // Close the menu when clicking on mobile devices
                >
                    {label}
                </Link>
            </li>
        );
    };


    const renderLogoutButton = () => (
        <li key="logout">
            <button onClick={() => signOut()} className="button md:w-full">
                Log out
            </button>
        </li>
    );

    return (
        <header className="bg-primary-dark md:fixed w-full z-10 shadow-xl">
            <div className="container mx-auto h-[88px] flex items-center justify-between p-4">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>

                {/* Menu button for mobile devices */}
                <button
                    onClick={toggleMenu}
                    className="block md:hidden p-2 text-primary transition hover:text-accent"
                >
                    {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars4Icon className="w-8 h-8" />}
                </button>

                {/* Desktop menu */}
                <nav className="hidden md:block">
                    <ul className="flex items-center md:gap-3 text-md">
                        {NAVIGATION_ITEMS.map(({ href, label }) => renderListItem(href, label))}
                        {status === 'loading' && <li>Loading...</li>}
                        {!session && status !== 'loading' && renderListItem('/auth', 'Auth')}
                        {session && renderListItem('/profile', 'Profile')}
                        {session && renderLogoutButton()}
                    </ul>
                </nav>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <nav className="absolute top-20 left-0 w-full bg-primary-dark p-6 shadow-lg md:hidden">
                    <ul className="flex flex-col gap-4 text-lg">
                        {NAVIGATION_ITEMS.map(({ href, label }) => renderListItem(href, label, toggleMenu))}
                        {!session && status !== 'loading' && renderListItem('/auth', 'Auth', toggleMenu)}
                        {session && renderListItem('/profile', 'Profile', toggleMenu)}
                        {session && renderLogoutButton()}
                    </ul>
                </nav>
            )}
        </header>
    );
}
