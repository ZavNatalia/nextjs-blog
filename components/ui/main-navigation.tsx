import Logo from '@/components/ui/logo';
import Link from 'next/link';

export default function MainNavigation() {

    return (
        <header className="bg-pink-800 bg-opacity-40 shadow-lg shadow-pink-800/40 flex py-5 px-14 items-center justify-between">
            <Link href="/">
                <Logo/>
            </Link>
            <nav>
                <ul className="flex gap-6">
                    <li>
                        <Link href="/posts">Posts</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}