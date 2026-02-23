import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type NotificationStatus = 'pending' | 'success' | 'error';

export interface NotificationDetails {
    status: NotificationStatus;
    title: string;
    message: string;
    onClose?: () => void;
}

const bgMap: { [key in NotificationStatus]: string } = {
    pending: 'bg-tertiary',
    success: 'bg-success-100 dark:bg-success-700',
    error: 'bg-error-500 text-contrast dark:text-foreground',
};

const getToastColors = (status: NotificationStatus) => {
    return bgMap[status] || 'bg-tertiary text-foreground';
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
                className={`relative animate-slide-in overflow-hidden rounded-3xl px-6 py-4 shadow-lg ${getToastColors(status)}`}
            >
                <button
                    className="absolute right-4 top-3 transition-opacity hover:opacity-75"
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
                <h4 className="mb-3 text-lg font-bold">{title}</h4>
                <p>{message}</p>
            </div>
        </div>,
        notificationsRoot,
    );
}
