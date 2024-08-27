import Logo from '@/components/ui/logo';
import Link from 'next/link';

export default function MainNavigation() {

    return (
        <header className="bg-gray-950 flex pt-7 pb-5 px-14 items-center justify-between">
            <Link href="/">
                <Logo/>
            </Link>
            <nav>
                <ul className="flex gap-6 text-lg">
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