import Logo from '@/components/ui/logo';
import Link from 'next/link';

const NAVIGATION_ITEMS = [
    { href: '/posts', label: 'Posts' },
    { href: '/contact', label: 'Contact' },
];

export default function MainNavigation() {
    return (
        <header className="bg-primary-dark">
            <div className="container mx-auto flex items-center justify-between
            py-6 px-4 sm:px-12 lg:px-20">
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
                <nav>
                    <ul className="flex gap-4 sm:gap-6 text-base md:text-xl">
                        {NAVIGATION_ITEMS.map(({ href, label }) => (
                            <li key={href}>
                                <Link href={href} className="text-white hover:text-gray-300 transition-colors">
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