import Link from 'next/link';
import { useDictionary } from '@/hooks/useDictionary';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const dictionary = useDictionary()?.['common'];

    return (
        <div className="bg-primary dark:bg-dark flex w-full items-center justify-center gap-2 p-3">
            <p className="text-muted text-sm">© {currentYear} Next.js Craft</p>
            <Link
                href="https://github.com/ZavNatalia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dictionary.githubAccount}
                className="link text-muted hover:text-accent flex items-center gap-2"
            >
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.11-1.45-1.11-1.45-.9-.62.07-.6.07-.6 1 .07 1.52 1.04 1.52 1.04.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.69 1.03 1.58 1.03 2.67 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.77c0 .27.16.59.67.49A10.005 10.005 0 0 0 22 12c0-5.52-4.48-10-10-10Z"
                        clipRule="evenodd"
                    />
                </svg>
            </Link>
        </div>
    );
}
