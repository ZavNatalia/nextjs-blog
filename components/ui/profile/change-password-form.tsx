'use client';
import Notification, {
    NotificationDetails,
} from '@/components/ui/Notification';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

export type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
};

const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string()
        .min(7, 'New password must be at least 7 characters')
        .required('New password is required'),
});

export default function ChangePasswordForm() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [notificationData, setNotificationData] = useState<NotificationDetails | null>(null);

    const handleSubmit = async (
        values: ChangePasswordFormData,
        { resetForm, setSubmitting, setErrors }: FormikHelpers<ChangePasswordFormData>
    ) => {
        setNotificationData(null);
        setSubmitting(true);

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PATCH',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ oldPassword: data.error || 'Something went wrong!' });
                throw new Error(data.error || 'Something went wrong!');
            }

            setNotificationData({
                title: 'Success!',
                message: 'Password changed successfully.',
                status: 'success',
            });

            resetForm();
        } catch (error: any) {
            setNotificationData({
                title: 'Error!',
                message: error.message || 'Failed to change password.',
                status: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Formik<ChangePasswordFormData>
                initialValues={{ oldPassword: '', newPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="flex flex-col gap-4 w-full max-w-xs bg-primary-dark/40 px-4 py-5 rounded-xl">
                        <div className="relative">
                            <label htmlFor="oldPassword" className="block font-bold text-primary mb-2">
                                Old Password
                            </label>
                            <Field
                                type={showOldPassword ? 'text' : 'password'}
                                name="oldPassword"
                                id="oldPassword"
                                className="input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword((prev) => !prev)}
                                className={`absolute right-2 top-12 text-accent ${
                                    values.oldPassword.length > 0 ? 'block' : 'hidden'
                                }`}
                            >
                                {showOldPassword ? (
                                    <EyeSlashIcon className="w-5 h-5 mr-1" />
                                ) : (
                                    <EyeIcon className="w-5 h-5 mr-1" />
                                )}
                            </button>
                            <ErrorMessage name="oldPassword" component="p" className="mt-2 text-sm text-error" />
                        </div>

                        <div className="relative">
                            <label htmlFor="newPassword" className="block font-bold text-primary mb-2">
                                New Password
                            </label>
                            <Field
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                id="newPassword"
                                className="input w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className={`absolute right-2 top-12 text-accent ${
                                    values.newPassword.length > 0 ? 'block' : 'hidden'
                                }`}
                            >
                                {showNewPassword ? (
                                    <EyeSlashIcon className="w-5 h-5 mr-1" />
                                ) : (
                                    <EyeIcon className="w-5 h-5 mr-1" />
                                )}
                            </button>
                            <ErrorMessage name="newPassword" component="p" className="mt-2 text-sm text-error" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`button-accent w-full ${
                                isSubmitting ? 'cursor-wait' : ''
                            }`}
                        >
                            {isSubmitting ? 'Sending...' : 'Change Password'}
                        </button>
                    </Form>
                )}
            </Formik>

            {notificationData ? <Notification {...notificationData} /> : null}
        </div>
    );
}
