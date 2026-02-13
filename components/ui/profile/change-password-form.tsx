'use client';
import Notification, {
    NotificationDetails,
} from '@/components/ui/Notification';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import TogglePasswordButton from '@/components/ui/TogglePasswordButton';

export type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
};

export default function ChangePasswordForm({
    dictionary,
}: {
    dictionary: Record<string, string>;
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
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            const errorMessage =
                message === 'Old password is incorrect.'
                    ? dictionary.oldPasswordIncorrect
                    : message;
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
                    <Form className="bg-primary flex w-full max-w-xs flex-col gap-4 rounded-xl px-5 py-6 shadow-md">
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
                                className="text-error mt-2 text-base"
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
                                className="text-error mt-2 text-base"
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
