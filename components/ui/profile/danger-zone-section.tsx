'use client';
import Notification, { NotificationDetails, NotificationStatus } from '@/components/ui/Notification';
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function DangerZoneSection({userEmail, dictionary}: {userEmail: string, dictionary: Record<string, any> }) {
    const [notificationData, setNotificationData] = useState<NotificationDetails | null>(null);
    const [requestStatus, setRequestStatus] = useState<NotificationStatus | null>(null);
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
        <div className="border border-error bg-error-light/10 dark:bg-error/10 p-4 rounded-xl shadow-md">
            <h3 className="mb-3 text-xl font-semibold text-error">{dictionary.dangerZone}</h3>
            <p className="text-md text-error">
                {dictionary.deletingIsIrreversible}
            </p>
            <button
                disabled={requestStatus === 'pending' || requestStatus === 'success'}
                className={`mt-4 ${
                    requestStatus === 'pending' || requestStatus === 'success'
                        ? 'button-disabled'
                        : 'button-danger'
                }`}
                onClick={() => setIsConfirmOpen(true)}
            >
                {requestStatus === 'pending' ? dictionary.deletingAccount : dictionary.deleteAccount}
            </button>

            {isConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-primary-contrast/80 dark:bg-dark-strong/90 p-4">
                    <div className="bg-primary dark:bg-dark rounded-3xl p-6 text-center shadow-lg max-w-sm">
                        <h3 className="text-lg font-semibold text-error">{dictionary.confirmAccountDeletion}</h3>
                        <p className="text-md text-secondary mt-2">
                            {dictionary.areYouSureYouWantToDelete}&nbsp;
                            <span className='font-bold font-mono text-foreground'>{userEmail}</span>
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
                                {requestStatus === 'pending' ? dictionary.deletingAccount : dictionary.confirmDelete}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notificationData ? <Notification {...notificationData} /> : null}
        </div>
    );
}
