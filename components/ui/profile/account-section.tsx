import Image from 'next/image';
import { signOut } from 'next-auth/react';

export function AccountSection({
    userEmail,
    dictionary,
}: {
    userEmail: string;
    dictionary: Record<string, any>;
}) {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-accent-500 shadow-md dark:border-accent-700">
                <Image
                    src="/images/site/default-avatar.png"
                    alt="User avatar"
                    width={96}
                    height={96}
                    className="rounded-full"
                    priority
                />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
                {dictionary.yourAccount}
            </h2>
            <p className="mb-4 text-base text-foreground-muted dark:text-muted-100">
                {userEmail}
            </p>
            <button
                onClick={() => signOut()}
                className="button button-ghost button-md group"
            >
                {dictionary.logout}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                    />
                </svg>
            </button>
        </div>
    );
}
