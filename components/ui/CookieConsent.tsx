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
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto bg-primary-contrast dark:bg-gray-900 text-foreground p-4 rounded-2xl shadow-md">
            <p className="text-sm">
                We use cookies to improve the website&#39;s functionality. By continuing to use this site, you agree to our&nbsp;
                <Link href="/privacy-policy" className="text-blue-500 dark:text-blue-400 underline">
                    Privacy Policy
                </Link>.
            </p>
            <div className="mt-3 flex justify-end gap-2">
                <button onClick={handleAccept} className="button-accent button-sm">
                    Ok
                </button>
            </div>
        </div>
    );
}
