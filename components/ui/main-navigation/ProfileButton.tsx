import Link from 'next/link';
import Image from 'next/image';

interface ProfileButtonProps {
    title: string;
    normalizedPathname: string;
    onClick?: () => void;
}

export default function ProfileButton({
    title,
    normalizedPathname,
    onClick,
}: ProfileButtonProps) {
    const isActive = normalizedPathname === '/profile';
    const imageStyles = `
    ${
        isActive
            ? `
        border-2 border-accent dark:border-accent-dark
        `
            : `
        border-2 border-border dark:border-border-light md:dark:border-border-dark
        hover:bg-accent hover:dark:bg-accent-dark
        hover:border-accent hover:dark:border-accent-dark
        `
    }
    relative mx-2 h-12 w-12 md:h-10 md:w-10 rounded-full
    bg-primary shadow-md
    transition-colors duration-600
`;

    return (
        <li key="profile">
            <Link
                href="/profile"
                title={title}
                aria-label={title}
                className="rounded-full"
                onClick={onClick}
            >
                <div className={imageStyles}>
                    <Image
                        src="/images/site/default-avatar.png"
                        alt="User avatar"
                        width={96}
                        height={96}
                        className="rounded-full"
                        priority
                    />
                </div>
            </Link>
        </li>
    );
}
