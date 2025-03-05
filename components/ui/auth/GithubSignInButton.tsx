'use client'
import type { getDictionary } from '@/get-dictionary';
import { signIn } from 'next-auth/react';
export default function GithubSignInButton({
                                             dictionary,
                                         }: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['auth-page'];
}) {

    const buttonStyle = "bg-[#F2F2F2] text-[#1F1F1F] border border-[#F2F2F2] hover:bg-[#e5e5e5] " +
        "dark:bg-[#131314] dark:text-[#E3E3E3] dark:border dark:border-[#8E918F] dark:hover:bg-[#020202]";


    return (
        <button
            onClick={() => signIn("google")}
            className={`flex font-medium gap-[10px] px-3 py-[10px] text-sm rounded-[20px] transition ${buttonStyle}`}
        >
            <svg
                className="h-[20px] w-[20px] mt-[-2px]"
                fill="currentColor"
                viewBox="0 0 22 22"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.11-1.45-1.11-1.45-.9-.62.07-.6.07-.6 1 .07 1.52 1.04 1.52 1.04.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.69 1.03 1.58 1.03 2.67 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.77c0 .27.16.59.67.49A10.005 10.005 0 0 0 22 12c0-5.52-4.48-10-10-10Z"
                    clipRule="evenodd"
                />
            </svg>
            <span>{dictionary.signInWith} Github</span>
        </button>
    );
}