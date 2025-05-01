import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type NotificationStatus = 'pending' | 'success' | 'error';

export interface NotificationDetails {
    status: NotificationStatus;
    title: string;
    message: string;
    onClose?: () => void;
}

const bgMap: { [key in NotificationStatus]: string } = {
    pending: 'bg-tertiary dark:bg-secondary',
    success: 'bg-green-200 dark:bg-green-900',
    error: 'bg-red-300 dark:bg-error-dark',
};

const getBg = (status: NotificationStatus) => {
    return (
        bgMap[status] ||
        'bg-gradient-to-r from-indigo-700 via-purple-800 to-pink-900'
    );
};

export default function Notification({
    status,
    title,
    message,
    onClose,
}: NotificationDetails) {
    const notificationsRoot = document.getElementById('notifications');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!notificationsRoot || !visible) return null;

    return createPortal(
        <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 transform">
            <div
                className={`relative animate-slide-in overflow-hidden rounded-3xl p-4 px-6 py-4 text-foreground shadow-lg ${getBg(status)}`}
            >
                <button
                    className="absolute right-4 top-3 text-foreground transition-opacity hover:opacity-75"
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
                <p className="text-lg font-bold">{title}</p>
                <p>{message}</p>
            </div>
        </div>,
        notificationsRoot,
    );
}
