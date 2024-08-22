import Logo from '@/app/ui/logo';
import Link from 'next/link';

export default function MainNavigation() {

    return (
        <div className="bg-pink-800">
            <Link href="/">
                <Logo/>
            </Link>
            <nav>
                <ul>
                    <li>
                        <Link href="/posts">Posts</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}