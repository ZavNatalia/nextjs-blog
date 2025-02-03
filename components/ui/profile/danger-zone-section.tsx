'use client';
import Notification, { NotificationDetails, NotificationStatus } from '@/components/ui/Notification';
import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function DangerZoneSection({userEmail}: {userEmail: string}) {
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
                throw new Error(data.error || 'Something went wrong!');
            }
            setRequestStatus('success');
            setNotificationData({
                title: 'Success!',
                message: 'Account deleted successfully.',
                status: 'success',
            });

        } catch (error: any) {
            setRequestStatus('error');
            setNotificationData({
                title: 'Error!',
                message: error.message || 'Failed to delete account.',
                status: 'error',
            });
        } finally {
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="border border-primary-error/90 bg-primary-error/10 p-4 rounded-xl shadow-md">
            <h3 className="mb-3 text-xl font-semibold text-error">Danger Zone</h3>
            <p className="text-sm text-error">
                Deleting your account is <b>irreversible</b>. Proceed with caution.
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
                {requestStatus === 'pending' ? 'Deleting Account...' : 'Delete Account'}
            </button>

            {isConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-primary-dark/80 p-4">
                    <div className="bg-primary rounded-3xl p-6 text-center shadow-lg max-w-sm">
                        <h3 className="text-lg font-semibold text-error">Confirm Deletion</h3>
                        <p className="text-md text-secondary mt-2">
                            Are you sure you want to delete your account&nbsp;
                            <span className='font-bold font-mono text-primary/80'>{userEmail}</span>
                            ? This action cannot be undone.
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="button"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${requestStatus === 'pending' ? 'button-disabled' : 'button-danger'}`}
                                onClick={deleteAccount}
                            >
                                {requestStatus === 'pending' ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notificationData ? <Notification {...notificationData} /> : null}
        </div>
    );
}
