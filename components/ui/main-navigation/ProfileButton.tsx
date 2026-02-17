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
        border-2 border-accent-500
        `
            : `
        border-2 border-border-500 
        hover:bg-accent 
        hover:border-accent-500 
        `
    }
    relative h-12 w-12 md:h-10 md:w-10 rounded-full
    bg-primary shadow-md
    transition-colors duration-600
`;

    return (
        <li key="profile">
            <Link
                href="/profile"
                title={title}
                aria-label={title}
                onClick={onClick}
                className={`focus-visible:ring-accent group inline-block rounded-full px-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-0`}
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
