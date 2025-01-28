'use client';

import Logo from '@/components/ui/logo';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface NavigationItem {
    href: string;
    label: string;
}

export default function MainNavigation() {
    const { data: session, status } = useSession();

    const NAVIGATION_ITEMS: NavigationItem[] = [
        { href: '/posts', label: 'Posts' },
        { href: '/contact', label: 'Contact' },
    ];

    const renderListItem = (href: string, label: string) => {
        return (
            <li key={href}>
                <Link
                    href={href}
                    className='text-lg transition-colors duration-200 px-2 py-3 hover:text-accent text-primary'
                >
                    {label}
                </Link>
            </li>
        );
    };

    const renderLogoutButton = () => (
        <li key="logout">
            <button
                onClick={() => signOut()}
                className="button"
            >
                Log out
            </button>
        </li>
    );

    return (
        <header className="bg-primary-dark">
            <div className="container mx-auto h-[88px] flex items-center justify-between px-4 py-6 sm:px-12 lg:px-20">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
                <nav>
                    <ul className="flex text-base items-center md:gap-3 md:text-md">
                        {NAVIGATION_ITEMS.map(({ href, label }) => renderListItem(href, label))}
                        {status === 'loading' && <li>Loading...</li>}
                        {!session && status !== 'loading' && renderListItem('/auth', 'Auth')}
                        {session && renderListItem('/profile', 'Profile')}
                        {session && renderLogoutButton()}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
