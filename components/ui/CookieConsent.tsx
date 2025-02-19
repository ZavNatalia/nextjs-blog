'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useDictionary } from '@/hooks/useDictionary';

export default function CookieConsent() {
    const { data: session, status } = useSession();
    const privacyDict = useDictionary()?.['privacy-policy-page'];
    const userId = session?.user?.email || "guest";

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(`cookieConsent-${userId}`);
        if (!consent && status !== 'loading') {
            setIsVisible(true);
        }
        if (consent && isVisible) {
            setIsVisible(false);
        }
    }, [session]);

    const handleAccept = () => {
        localStorage.setItem(`cookieConsent-${userId}`, "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="z-10 fixed bottom-3 right-4 max-w-lg text-foreground p-4 rounded-2xl shadow-md
        bg-primary-light dark:bg-gray-900
        border border-primary-contrast dark:border-dark-strong">
            <p className="text-sm">
                {privacyDict.weUseCookies}&nbsp;
                <Link href="/privacy-policy" className="text-blue-500 dark:text-blue-400 underline">
                    {privacyDict.privacyPolicy}
                </Link>.
            </p>
            <div className="flex justify-end">
                <button onClick={handleAccept} className="button-accent button-sm">
                    {privacyDict.ok}
                </button>
            </div>
        </div>
    );
}
