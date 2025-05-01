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
        <div className="rounded-xl border border-error-500 bg-error-500/20 p-4 shadow-md">
            <h3 className="mb-3 text-xl font-semibold text-error-700">
                {dictionary.dangerZone}
            </h3>
            <p className="text-base text-error-700">
                {dictionary.deletingIsIrreversible}
            </p>
            <button
                disabled={
                    requestStatus === 'pending' || requestStatus === 'success'
                }
                className={`button button-md mt-4 ${
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
                <div
                    className="fixed inset-0 flex items-center justify-center bg-background-tertiary/80 p-4"
                    onClick={() => setIsConfirmOpen(false)}
                >
                    <div
                        className="max-w-sm rounded-3xl bg-background-secondary p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-error text-lg font-semibold">
                            {dictionary.confirmAccountDeletion}
                        </h3>
                        <p className="mt-2 text-base text-foreground">
                            {dictionary.areYouSureYouWantToDelete}
                            <span className="font-mono font-bold text-foreground">
                                &nbsp;{userEmail}
                            </span>
                            ?<br />
                            {dictionary.thisActionCannotBeUndone}
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="button button-secondary button-md"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                {dictionary.cancel}
                            </button>
                            <button
                                className={`button button-md ${requestStatus === 'pending' ? 'button-disabled' : 'button-danger'}`}
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
