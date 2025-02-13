import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function CookieConsent() {
    const { data: session } = useSession();
    const userId = session?.user?.email || "guest";

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(`cookieConsent-${userId}`);
        if (!consent) {
            setIsVisible(true);
        }
    }, [userId]);

    const handleAccept = () => {
        localStorage.setItem(`cookieConsent-${userId}`, "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-3 right-4 max-w-lg text-foreground p-4 rounded-2xl shadow-md
        bg-primary-light dark:bg-gray-900
        border border-primary-contrast dark:border-dark-strong">
            <p className="text-sm">
                We use cookies to improve the website&#39;s functionality. By continuing to use this site, you agree to our&nbsp;
                <Link href="/privacy-policy" className="text-blue-500 dark:text-blue-400 underline">
                    Privacy Policy
                </Link>.
            </p>
            <div className="flex justify-end">
                <button onClick={handleAccept} className="button-accent button-sm">
                    Ok
                </button>
            </div>
        </div>
    );
}
