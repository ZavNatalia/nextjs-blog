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

export default function ChangePasswordForm({
    dictionary,
}: {
    dictionary: Record<string, any>;
}) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [notificationData, setNotificationData] =
        useState<NotificationDetails | null>(null);

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required(dictionary.oldPasswordRequired),
        newPassword: Yup.string()
            .min(7, dictionary.atLeast7Characters)
            .required(dictionary.newPasswordRequired),
    });

    const handleSubmit = async (
        values: ChangePasswordFormData,
        {
            resetForm,
            setSubmitting,
            setErrors,
        }: FormikHelpers<ChangePasswordFormData>,
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
            const errorMessage =
                data.error === 'Old password is incorrect.'
                    ? dictionary.oldPasswordIncorrect
                    : data.error;

            if (!response.ok) {
                setErrors({
                    oldPassword: errorMessage || dictionary.somethingWentWrong,
                });
                throw new Error(errorMessage || dictionary.somethingWentWrong);
            }

            setNotificationData({
                title: dictionary.success,
                message: dictionary.passwordChangedSuccessfully,
                status: 'success',
            });

            resetForm();
        } catch (error: any) {
            const errorMessage =
                error.message === 'Old password is incorrect.'
                    ? dictionary.oldPasswordIncorrect
                    : error.message;
            setNotificationData({
                title: dictionary.error,
                message: errorMessage || dictionary.failedChangePassword,
                status: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik<ChangePasswordFormData>
                initialValues={{ oldPassword: '', newPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="bg-primary flex w-full max-w-md flex-col gap-4 rounded-xl px-5 py-6 shadow-md">
                        <div className="relative">
                            <label
                                htmlFor="oldPassword"
                                className="mb-2 block font-bold text-foreground"
                            >
                                {dictionary.oldPassword}
                            </label>
                            <Field
                                type={showOldPassword ? 'text' : 'password'}
                                name="oldPassword"
                                id="oldPassword"
                                className="input"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowOldPassword((prev) => !prev)
                                }
                                className={`link absolute right-2 top-12 mr-1 text-accent-500 transition-colors duration-200 hover:text-accent-700 ${
                                    values.oldPassword.length > 0
                                        ? 'block'
                                        : 'hidden'
                                }`}
                            >
                                {showOldPassword ? (
                                    <EyeSlashIcon
                                        aria-label={dictionary.hidePassword}
                                        title={dictionary.hidePassword}
                                        className="h-5 w-5"
                                    />
                                ) : (
                                    <EyeIcon
                                        aria-label={dictionary.showPassword}
                                        title={dictionary.showPassword}
                                        className="h-5 w-5"
                                    />
                                )}
                            </button>
                            <ErrorMessage
                                name="oldPassword"
                                component="p"
                                className="text-error mt-2 text-sm"
                            />
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block font-bold text-foreground"
                            >
                                {dictionary.newPassword}
                            </label>
                            <Field
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                id="newPassword"
                                className="input w-full"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword((prev) => !prev)
                                }
                                className={`absolute right-2 top-12 text-accent-500 ${
                                    values.newPassword.length > 0
                                        ? 'block'
                                        : 'hidden'
                                }`}
                            >
                                {showNewPassword ? (
                                    <EyeSlashIcon className="mr-1 h-5 w-5" />
                                ) : (
                                    <EyeIcon className="mr-1 h-5 w-5" />
                                )}
                            </button>
                            <ErrorMessage
                                name="newPassword"
                                component="p"
                                className="text-error mt-2 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`button button-accent button-md w-full ${
                                isSubmitting ? 'cursor-wait' : ''
                            }`}
                        >
                            {isSubmitting
                                ? dictionary.sending
                                : dictionary.changePassword}
                        </button>
                    </Form>
                )}
            </Formik>

            {notificationData ? <Notification {...notificationData} /> : null}
        </>
    );
}
