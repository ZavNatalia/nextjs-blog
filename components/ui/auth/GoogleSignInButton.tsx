'use client';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import type { getDictionary } from '@/get-dictionary';

export default function GoogleSignInButton({
    dictionary,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['auth-page'];
}) {
    const buttonStyle =
        'bg-[#EEEEEE] text-[#1f1f1f] border border-[#EEEEEE] hover:bg-[#e5e5e5] ' +
        'dark:bg-[#131314] dark:text-[#e3e3e3] dark:border dark:border-[#8E918F] dark:hover:bg-[#020202]';

    return (
        <button
            onClick={() => signIn('google', { redirect: true })}
            className={`flex items-center justify-center gap-[10px] rounded-[20px] px-3 py-[10px] text-sm font-medium transition ${buttonStyle}`}
        >
            <Image
                src="/images/site/google-logo.svg"
                alt="Google Logo"
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
            />
            <span>{dictionary.signInWith} Google</span>
        </button>
    );
}
