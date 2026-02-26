'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useDictionary } from '@/hooks/useDictionary';

export default function CookieConsent() {
    const { data: session, status } = useSession();
    const privacyDict = useDictionary()?.['privacy-policy-page'];
    const userId = session?.user?.email || 'guest';

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(`cookieConsent-${userId}`);
        if (!consent && status !== 'loading') {
            setIsVisible(true); // eslint-disable-line react-hooks/set-state-in-effect -- reading from localStorage
        }
        if (consent && isVisible) {
            setIsVisible(false);
        }
    }, [isVisible, session, status, userId]);

    const handleAccept = () => {
        localStorage.setItem(`cookieConsent-${userId}`, 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed right-4 bottom-3 z-10 max-w-lg rounded-2xl border border-border-100 bg-secondary p-4 text-foreground shadow-md">
            <p className="text-base">
                {privacyDict.weUseCookies}&nbsp;
                <Link
                    href="/privacy-policy"
                    className="text-blue-700 hover:underline dark:text-blue-400"
                >
                    {privacyDict.ourPrivacyPolicy}
                </Link>
                .
            </p>
            <div className="flex justify-end">
                <button
                    onClick={handleAccept}
                    className="button button-solid button-sm"
                >
                    {privacyDict.ok}
                </button>
            </div>
        </div>
    );
}
