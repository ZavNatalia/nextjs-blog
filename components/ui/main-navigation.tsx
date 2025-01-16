'use client';

import Logo from '@/components/ui/logo';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavigationItem {
    href: string;
    label: string;
}

export default function MainNavigation() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const NAVIGATION_ITEMS: NavigationItem[] = [
        { href: '/posts', label: 'Posts' },
        { href: '/contact', label: 'Contact' },
    ];

    const renderLink = (
        href: string,
        label: string,
        { isButton = false }: { isButton?: boolean } = {}
    ) => {
        const isActive = pathname === href;

        return (
            <li key={href}>
                <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                        isButton ? 'button-outline' : 'transition-colors duration-200 px-2 py-1 hover:text-accent',
                        isActive ? 'text-accent font-bold' : 'text-primary'
                    )}
                >
                    {label}
                </Link>
            </li>
        );
    };

    return (
        <header className="bg-primary-dark">
            <div className="container mx-auto flex items-center justify-between px-4 py-6 sm:px-12 lg:px-20">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
                <nav>
                    <ul className="flex text-base md:gap-4 md:text-md">
                        {NAVIGATION_ITEMS.map(({ href, label }) =>
                            renderLink(href, label)
                        )}
                        {status === 'loading' && <li>Loading...</li>}
                        {!session && status !== 'loading' && renderLink('/auth', 'Login')}
                        {session && renderLink('/profile', 'Profile')}
                        {session && renderLink('/logout', 'Log out', { isButton: true })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
