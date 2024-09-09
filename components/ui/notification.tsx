import { createPortal } from 'react-dom';

export type NotificationStatus = 'idle' | 'pending' | 'success' | 'error';

export interface NotificationDetails {
    status: NotificationStatus,
    title: string,
    message: string,
}

const getBg = (status: NotificationStatus) => {
    switch (status) {
        case 'pending':
            return 'bg-cyan-800/80';
        case 'success':
            return 'bg-emerald-800/80';
        case 'error':
            return 'bg-red-800/80';
    }
}
export default function Notification({status, title, message}: NotificationDetails) {
    return (
        createPortal(
            <div
                className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-3xl ${getBg(status)}`}>
                <p className='font-bold text-lg'>{title}</p>
                <p>{message}</p>
            </div>,
            document.getElementById('notifications')
        )
    );
}