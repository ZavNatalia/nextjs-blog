'use client';
import Notification, {
    NotificationDetails,
    NotificationStatus,
} from '@/components/ui/Notification';
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function DangerZoneSection({
    userEmail,
    dictionary,
}: {
    userEmail: string;
    dictionary: Record<string, any>;
}) {
    const [notificationData, setNotificationData] =
        useState<NotificationDetails | null>(null);
    const [requestStatus, setRequestStatus] =
        useState<NotificationStatus | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (requestStatus === 'success') {
            const timer = setTimeout(() => {
                setNotificationData(null);
                signOut();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [requestStatus]);

    const deleteAccount = async () => {
        setRequestStatus('pending');
        try {
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || dictionary.somethingWentWrong);
            }
            setRequestStatus('success');
            setNotificationData({
                title: dictionary.success,
                message: dictionary.accountDeletedSuccessfully,
                status: 'success',
            });
        } catch (error: any) {
            setRequestStatus('error');
            setNotificationData({
                title: dictionary.error,
                message: error.message || dictionary.failedDeleteAccount,
                status: 'error',
            });
        } finally {
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="rounded-xl border border-error bg-error-light/10 p-4 shadow-md dark:bg-error/10">
            <h3 className="mb-3 text-xl font-semibold text-error">
                {dictionary.dangerZone}
            </h3>
            <p className="text-md text-error">
                {dictionary.deletingIsIrreversible}
            </p>
            <button
                disabled={
                    requestStatus === 'pending' || requestStatus === 'success'
                }
                className={`mt-4 flex items-center gap-1 ${
                    requestStatus === 'pending' || requestStatus === 'success'
                        ? 'button-disabled'
                        : 'button-danger'
                }`}
                onClick={() => setIsConfirmOpen(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                </svg>

                {requestStatus === 'pending'
                    ? dictionary.deletingAccount
                    : dictionary.deleteAccount}
            </button>

            {isConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-primary-contrast/80 p-4 dark:bg-dark-strong/90" onClick={() => setIsConfirmOpen(false)}>
                    <div className="max-w-sm rounded-3xl bg-primary p-6 text-center shadow-lg dark:bg-dark" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-error">
                            {dictionary.confirmAccountDeletion}
                        </h3>
                        <p className="text-md text-foreground-muted dark:text-muted-light mt-2">
                            {dictionary.areYouSureYouWantToDelete}&nbsp;
                            <span className="font-mono font-bold text-foreground">
                                {userEmail}
                            </span>
                            ? {dictionary.thisActionCannotBeUndone}
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="button-primary"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                {dictionary.cancel}
                            </button>
                            <button
                                className={`${requestStatus === 'pending' ? 'button-disabled' : 'button-danger'}`}
                                onClick={deleteAccount}
                            >
                                {requestStatus === 'pending'
                                    ? dictionary.deletingAccount
                                    : dictionary.confirmDelete}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notificationData ? <Notification {...notificationData} /> : null}
        </div>
    );
}
