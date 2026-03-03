'use client';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { ZodError } from 'zod';

import Notification, {
    NotificationDetails,
} from '@/components/ui/Notification';
import TogglePasswordButton from '@/components/ui/TogglePasswordButton';
import { getDictionary } from '@/get-dictionary';
import { changePasswordSchema } from '@/lib/validations';

export type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
};

type SecurityDictionary = Awaited<
    ReturnType<typeof getDictionary>
>['profile-page']['securitySection'];

export default function ChangePasswordForm({
    dictionary,
}: {
    dictionary: SecurityDictionary;
}) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [notificationData, setNotificationData] =
        useState<NotificationDetails | null>(null);

    const localizedMessages: Record<string, string> = {
        'Old password is required.': dictionary.oldPasswordRequired,
        'New password must be at least 7 characters.':
            dictionary.atLeast7Characters,
    };

    const validate = (values: ChangePasswordFormData) => {
        try {
            changePasswordSchema.parse(values);
            return {};
        } catch (err) {
            if (err instanceof ZodError) {
                const errors: Record<string, string> = {};
                for (const issue of err.issues) {
                    const field = issue.path[0] as string;
                    if (!errors[field]) {
                        errors[field] =
                            localizedMessages[issue.message] || issue.message;
                    }
                }
                return errors;
            }
            return {};
        }
    };

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

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage =
                    data?.error === 'Old password is incorrect.'
                        ? dictionary.oldPasswordIncorrect
                        : data?.error;
                setErrors({
                    oldPassword: errorMessage || dictionary.somethingWentWrong,
                });
                setNotificationData({
                    title: dictionary.error,
                    message: errorMessage || dictionary.failedChangePassword,
                    status: 'error',
                });
                return;
            }

            setNotificationData({
                title: dictionary.success,
                message: dictionary.passwordChangedSuccessfully,
                status: 'success',
            });

            resetForm();
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            setNotificationData({
                title: dictionary.error,
                message: message || dictionary.failedChangePassword,
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
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-primary px-5 py-6 shadow-md">
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
                                aria-describedby="old-password-error"
                            />
                            <TogglePasswordButton
                                visible={values.oldPassword.length > 0}
                                onToggle={() =>
                                    setShowOldPassword((prev) => !prev)
                                }
                                isPasswordVisible={showOldPassword}
                                className="top-12"
                            />
                            <ErrorMessage
                                name="oldPassword"
                                component="p"
                                className="mt-2 text-base text-error"
                                id="old-password-error"
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
                                aria-describedby="new-password-error"
                            />
                            <TogglePasswordButton
                                visible={values.newPassword.length > 0}
                                onToggle={() =>
                                    setShowNewPassword((prev) => !prev)
                                }
                                isPasswordVisible={showNewPassword}
                                className="top-12"
                            />
                            <ErrorMessage
                                name="newPassword"
                                component="p"
                                className="mt-2 text-base text-error"
                                id="new-password-error"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`button button-solid button-md w-full ${
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
