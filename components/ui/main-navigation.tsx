import Logo from '@/components/ui/logo';
import Link from 'next/link';

const NAVIGATION_ITEMS = [
    { href: '/posts', label: 'Posts' },
    { href: '/contact', label: 'Contact' },
    { href: '/auth', label: 'Auth' },

];

export default function MainNavigation() {
    return (
        <header className="bg-primary-dark">
            <div className="container mx-auto flex items-center justify-between px-4 py-6 sm:px-12 lg:px-20">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
                <nav>
                    <ul className="flex gap-4 text-base sm:gap-6 md:text-lg">
                        {NAVIGATION_ITEMS.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="text-white transition-colors hover:text-amber-500"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
