"use client"
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(7, "Password must be at least 7 characters")
        .required("Password is required"),
});

type FormData = {
    email: string;
    password: string;
};

async function createUser (email: string, password: string) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
            "Content-Type": "application/json",
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

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const handleSubmit = async (
        values: FormData,
        { setSubmitting, setErrors }: FormikHelpers<FormData>
    ) => {
        setSubmitting(true);
        try {
            if (isLogin) {
                console.log("Log user in:", values);
            } else {
                const result = await createUser(values.email, values.password);
                console.log("User created:", result);
            }
        } catch (error: any) {
            console.log(error);
            setErrors({ email: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-primary/60 shadow-lg rounded-2xl p-8 max-w-sm lg:max-w-md w-full ">
                <h1 className="text-2xl font-bold text-accent text-center mb-6">
                    {isLogin ? "Login" : "Sign Up"}
                </h1>

                <Formik<FormData>
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<FormData>) => {
                        const { isSubmitting } = formikProps;

                        return (
                            <Form className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="label"
                                    >
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

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="label"
                                    >
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="mt-1 input sm:text-md"
                                        placeholder="Your password"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="mt-2 text-sm text-error"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full button-accent max-w-full"
                                    >
                                        {isLogin ? "Login" : "Sign Up"}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={switchAuthModeHandler}
                                        className="text-accent hover:text-accent-hover"
                                    >
                                        {isLogin
                                            ? "Switch to Sign Up"
                                            : "Switch to Login"}
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
    );
}
