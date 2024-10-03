import { createPortal } from 'react-dom';

export type NotificationStatus = 'pending' | 'success' | 'error' | null;

export interface NotificationDetails {
    status: NotificationStatus;
    title: string;
    message: string;
}

const bgMap: { [key in NotificationStatus]: string } = {
    pending: 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900',
    success: 'bg-gradient-to-r from-green-700 via-green-800 to-green-900',
    error: 'bg-gradient-to-r from-red-700 via-red-800 to-red-900',
};

const getBg = (status: NotificationStatus) => {
    return bgMap[status] || 'bg-gradient-to-r from-indigo-700 via-purple-800 to-pink-900'; // по умолчанию
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
            className={`z-50 fixed bottom-10 left-1/2 -translate-x-1/2 transform `}
        >
            <div
                className={`relative p-4 text-white shadow-lg overflow-hidden animate-slide-in rounded-3xl px-6 py-4 ${getBg(status)}`}>
                <p className="text-lg font-bold">{title}</p>
                <p>{message}</p>
            </div>
        </div>,
        notificationsRoot,
    );
}
