import clsx from 'clsx';
import Link from 'next/link';

interface ProfileButtonProps {
    title: string;
    normalizedPathname: string;
    userName?: string;
    userEmail?: string;
    onClick?: () => void;
}

export default function ProfileButton({
    title,
    normalizedPathname,
    userName,
    userEmail,
    onClick,
}: ProfileButtonProps) {
    const isActive = normalizedPathname === '/profile';
    const imageStyles = clsx(
        'relative h-12 w-12 md:h-10 md:w-10 rounded-full bg-primary shadow-md overflow-hidden border-2 transition-colors duration-600',
        isActive
            ? 'border-accent-500'
            : 'border-border-500 hover:bg-accent hover:border-accent-500',
    );

    const avatarLetter = userName
        ? userName.charAt(0).toUpperCase()
        : (userEmail || '?').charAt(0).toUpperCase();

    return (
        <li>
            <Link
                href="/profile"
                title={title}
                aria-label={title}
                onClick={onClick}
                className="group inline-block rounded-full px-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
            >
                <div className={imageStyles}>
                    <div className="flex h-full w-full items-center justify-center bg-accent-500 text-lg font-bold text-white dark:bg-accent-700">
                        {avatarLetter}
                    </div>
                </div>
            </Link>
        </li>
    );
}
