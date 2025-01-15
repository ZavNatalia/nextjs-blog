'use client';
import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Импорт иконок

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(7, 'Password must be at least 7 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Please confirm your password'),
});

type FormData = {
    email: string;
    password: string;
    confirmPassword?: string;
};

async function createUser(email: string, password: string) {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong!');
    }
    return data;
}

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const handleSubmit = async (
        values: FormData,
        { setSubmitting, setErrors }: FormikHelpers<FormData>,
    ) => {
        setSubmitting(true);
        try {
            if (isLogin) {
                console.log('Log user in:', values);
            } else {
                const result = await createUser(values.email, values.password);
                console.log('User created:', result);
            }
        } catch (error: any) {
            console.log(error);
            setErrors({ password: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-primary/60 shadow-lg rounded-2xl p-8 max-w-sm lg:max-w-md w-full ">
            <h1 className="text-2xl font-bold text-accent text-center mb-6">
                {isLogin ? 'Login' : 'Sign Up'}
            </h1>

            <Formik<FormData>
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={isLogin
                    ? validationSchema.pick(['email', 'password']) // Only validate email and password for login
                    : validationSchema // Validate all fields for sign up
                }
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<FormData>) => {
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
                                    placeholder="Your email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="mt-2 text-sm text-error"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="label">
                                    Password
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="mt-1 input sm:text-md"
                                    placeholder="Your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-10 text-accent"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5 mr-1" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5 mr-1" />
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
                                        Confirm Password
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="mt-1 input sm:text-md"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-10 text-accent"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5 mr-1" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5 mr-1" />
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
                                disabled={isSubmitting || !formikProps.isValid}
                                className={`w-full max-w-full ${
                                    isSubmitting || !formikProps.isValid ? 'button-disabled' : 'button-accent'
                                }`}
                            >
                                {isSubmitting ? 'Sending...' : isLogin ? 'Login' : 'Sign Up'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={switchAuthModeHandler}
                                    className="text-accent hover:text-accent-hover"
                                >
                                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
