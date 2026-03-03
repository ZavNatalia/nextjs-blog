'use client';

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ZodError } from 'zod';

import Notification, {
    NotificationDetails,
} from '@/components/ui/Notification';
import { getDictionary } from '@/get-dictionary';
import { updateProfileSchema } from '@/lib/validations';

type ProfileFormData = {
    name: string;
};

export function AccountSection({
    userEmail,
    userName,
    dictionary,
}: {
    userEmail: string;
    userName: string;
    dictionary: Awaited<
        ReturnType<typeof getDictionary>
    >['profile-page']['accountSection'];
}) {
    const { update } = useSession();
    const [currentName, setCurrentName] = useState(userName);
    const [notificationData, setNotificationData] =
        useState<NotificationDetails | null>(null);

    const localizedMessages: Record<string, string> = {
        'Name must be at least 2 characters.': dictionary.nameMinLength,
        'Name must not exceed 50 characters.': dictionary.nameMaxLength,
    };

    const validate = (values: ProfileFormData) => {
        try {
            updateProfileSchema.parse(values);
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
        values: ProfileFormData,
        { setSubmitting }: FormikHelpers<ProfileFormData>,
    ) => {
        setNotificationData(null);
        setSubmitting(true);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setNotificationData({
                    title: dictionary.error,
                    message: data?.error || dictionary.failedUpdateProfile,
                    status: 'error',
                });
                return;
            }

            await update();
            setCurrentName(values.name);

            setNotificationData({
                title: dictionary.success,
                message: dictionary.profileUpdatedSuccessfully,
                status: 'success',
            });
        } catch {
            setNotificationData({
                title: dictionary.error,
                message: dictionary.somethingWentWrong,
                status: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const avatarLetter = currentName
        ? currentName.charAt(0).toUpperCase()
        : userEmail.charAt(0).toUpperCase();

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <div
                className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-accent-500 shadow-md dark:border-accent-700"
                aria-hidden="true"
            >
                <div className="flex h-full w-full items-center justify-center bg-accent-500 text-3xl font-bold text-white dark:bg-accent-700">
                    {avatarLetter}
                </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
                {dictionary.yourAccount}
            </h2>
            <p className="mb-3 text-base text-secondary">{userEmail}</p>

            <Formik<ProfileFormData>
                initialValues={{
                    name: userName,
                }}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-primary px-5 py-6 shadow-md">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block font-bold text-foreground"
                            >
                                {dictionary.name}
                            </label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                placeholder={dictionary.namePlaceholder}
                                className="input w-full"
                                aria-describedby="name-error"
                            />
                            <ErrorMessage
                                name="name"
                                component="p"
                                className="mt-2 text-base text-error"
                                id="name-error"
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
                                ? dictionary.saving
                                : dictionary.saveChanges}
                        </button>
                    </Form>
                )}
            </Formik>

            {notificationData ? <Notification {...notificationData} /> : null}

            <button
                onClick={() => signOut()}
                className="button button-ghost button-md group mt-4"
            >
                {dictionary.logout}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                    />
                </svg>
            </button>
        </div>
    );
}
