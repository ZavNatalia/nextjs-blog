'use client';
import React, { useState } from 'react';
import {
    ErrorMessage,
    Field,
    Form,
    Formik,
    FormikHelpers,
    FormikProps,
} from 'formik';
import * as Yup from 'yup';
import { createUser } from '@/app/actions/auth';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Notification, {
    NotificationDetails,
} from '@/components/ui/Notification';
import type { getDictionary } from '@/get-dictionary';
import TogglePasswordButton from '@/components/ui/TogglePasswordButton';

export type AuthFormData = {
    email: string;
    password: string;
    confirmPassword?: string;
};

export default function AuthForm({
    dictionary,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['auth-page'];
}) {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notificationData, setNotificationData] =
        useState<NotificationDetails | null>(null);
    const router = useRouter();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(dictionary.invalidEmailAddress)
            .required(dictionary.emailRequired),
        password: Yup.string()
            .min(7, dictionary.atLeast7Characters)
            .required(dictionary.passwordRequired),
        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref('password'), undefined],
                dictionary.passwordsMustMatch,
            )
            .required(dictionary.pleaseConfirmPassword),
    });

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const handleSubmit = async (
        values: AuthFormData,
        { setSubmitting, setErrors }: FormikHelpers<AuthFormData>,
    ) => {
        setSubmitting(true);
        try {
            if (isLogin) {
                const result: SignInResponse | undefined = await signIn(
                    'credentials',
                    {
                        redirect: false,
                        email: values.email,
                        password: values.password,
                    },
                );

                if (!result || !result.ok) {
                    throw new Error(result?.error || dictionary.failedToLogIn);
                }
                router.replace('/', { scroll: false });
            } else {
                await createUser(values.email, values.password);

                setNotificationData({
                    title: dictionary.accountCreated,
                    message: dictionary.accountCreatedYouCanLogin,
                    status: 'success',
                });
                switchAuthModeHandler();
                setTimeout(() => {
                    setNotificationData(null);
                }, 5000);
            }
        } catch (error: any) {
            setErrors({ password: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <h1 className="mb-6 text-center text-2xl font-bold text-accent-500">
                {isLogin ? dictionary.login : dictionary.signUp}
            </h1>

            <Formik<AuthFormData>
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={
                    isLogin
                        ? validationSchema.pick(['email', 'password'])
                        : validationSchema
                }
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<AuthFormData>) => {
                    const { isSubmitting } = formikProps;

                    return (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="email" className="label">
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="input mt-1"
                                    placeholder={dictionary.yourEmail}
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-error mt-2 text-sm"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="label">
                                    {dictionary.password}
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input mt-1"
                                    placeholder={dictionary.yourPassword}
                                />
                                <TogglePasswordButton
                                    onToggle={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    isPasswordVisible={showPassword}
                                    className="top-9"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-error mt-2 text-sm"
                                />
                            </div>

                            {!isLogin && (
                                <div className="relative">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="label"
                                    >
                                        {dictionary.confirmPassword}
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="input mt-1"
                                        placeholder={dictionary.confirmPassword}
                                    />
                                    <TogglePasswordButton
                                        onToggle={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev,
                                            )
                                        }
                                        isPasswordVisible={showConfirmPassword}
                                        className="top-9"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="p"
                                        className="text-error mt-2 text-sm"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`button button-md w-full ${
                                    isSubmitting || !formikProps.isValid
                                        ? 'button-disabled'
                                        : 'button-accent'
                                }`}
                            >
                                {isSubmitting
                                    ? dictionary.sending
                                    : isLogin
                                      ? dictionary.login
                                      : dictionary.submitSignUp}
                            </button>

                            <div className="text-center text-sm">
                                {!isLogin && (
                                    <span>{dictionary.haveAccount} </span>
                                )}
                                {isLogin && (
                                    <span>
                                        {dictionary.doNotHaveAccount}&nbsp;
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={switchAuthModeHandler}
                                    className="text-accent-500 hover:text-accent-700 dark:text-accent-100 hover:dark:text-accent-500"
                                >
                                    {isLogin
                                        ? dictionary.createAccount
                                        : dictionary.login}
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            {notificationData && <Notification {...notificationData} />}
        </>
    );
}
