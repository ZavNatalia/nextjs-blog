import { createPortal } from 'react-dom';

export type NotificationStatus = 'pending' | 'success' | 'error' | null;

export interface NotificationDetails {
    status: NotificationStatus;
    title: string;
    message: string;
}

const getBg = (status: NotificationStatus) => {
    switch (status) {
        case 'pending':
            return 'bg-cyan-800/60 border-3 border-cyan-900/30';
        case 'success':
            return 'bg-emerald-800/60 border-3 border-emerald-900/30';
        case 'error':
            return 'bg-red-800/60 border-3 border-red-900/30';
    }
};
export default function Notification({
    status,
    title,
    message,
}: NotificationDetails) {
    const notificationsRoot = document.getElementById('notifications');

    if (!notificationsRoot) return null;

    return createPortal(
        <div
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 transform rounded-3xl px-6 py-4 ${getBg(status)} shadow-lg backdrop-blur-sm`}
        >
            <p className="text-lg font-bold">{title}</p>
            <p>{message}</p>
        </div>,
        notificationsRoot,
    );
}
