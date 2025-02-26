'use client';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { createUser } from '@/app/actions/auth';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Notification, { NotificationDetails } from '@/components/ui/Notification';


export type AuthFormData = {
    email: string;
    password: string;
    confirmPassword?: string;
};

export default function AuthForm({ dictionary }: { dictionary: Record<string, any> }) {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [notificationData, setNotificationData] = useState<NotificationDetails | null>(null);
    const router = useRouter();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(dictionary.invalidEmailAddress)
            .required(dictionary.emailRequired),
        password: Yup.string()
            .min(7, dictionary.atLeast7Characters)
            .required(dictionary.passwordRequired),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], dictionary.passwordsMustMatch)
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
                const result: SignInResponse | undefined = await signIn('credentials', {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                });

                if (!result || !result.ok) {
                    throw new Error(result?.error || dictionary.failedToLogIn);
                }
                router.replace('/profile', { scroll: false });

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
        <div
            className="bg-primary-light/60 dark:bg-dark-soft/30 shadow-lg rounded-3xl p-8 max-w-sm lg:max-w-md w-full ">
            <h1 className="text-2xl font-bold text-accent text-center mb-6">
                {isLogin ? dictionary.login : dictionary.signUp}
            </h1>

            <Formik<AuthFormData>
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={isLogin
                    ? validationSchema.pick(['email', 'password'])
                    : validationSchema
                }
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<AuthFormData>) => {
                    const { isSubmitting } = formikProps;

                    return (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="label">
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="mt-1 input sm:text-md"
                                    placeholder={dictionary.yourEmail}
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="mt-2 text-sm text-error"
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
                                    className="mt-1 input sm:text-md"
                                    placeholder={dictionary.yourPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-10 text-accent"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5 mr-1" title={dictionary.hidePassword} />
                                    ) : (
                                        <EyeIcon className="w-5 h-5 mr-1" title={dictionary.showPassword}/>
                                    )}
                                </button>
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="mt-2 text-sm text-error"
                                />
                            </div>

                            {!isLogin && (
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="label">
                                        {dictionary.confirmPassword}
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="mt-1 input sm:text-md"
                                        placeholder={dictionary.confirmPassword}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-10 text-accent"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5 mr-1" title={dictionary.hidePassword}/>
                                        ) : (
                                            <EyeIcon className="w-5 h-5 mr-1" title={dictionary.showPassword}/>
                                        )}
                                    </button>
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="p"
                                        className="mt-2 text-sm text-error"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full max-w-full ${
                                    isSubmitting || !formikProps.isValid ? 'button-disabled' : 'button-accent'
                                }`}
                            >
                                {isSubmitting ? dictionary.sending : isLogin ? dictionary.login : dictionary.submitSignUp}
                            </button>

                            <div className="text-center">
                                {!isLogin && <span>{dictionary.haveAccount} </span>}
                                {isLogin && <span>{dictionary.doNotHaveAccount} </span>}
                                <button
                                    type="button"
                                    onClick={switchAuthModeHandler}
                                    className="text-accent hover:text-accent-dark"
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
        </div>
    );
}
