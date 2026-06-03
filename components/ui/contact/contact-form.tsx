'use client';
import Link from 'next/link';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';

import Notification, {
    NotificationDetails,
    NotificationStatus,
} from '@/components/ui/Notification';
import { getDictionary } from '@/get-dictionary';

declare global {
    interface Window {
        turnstile?: {
            reset: (element: HTMLElement) => void;
        };
    }
}

type ContactDetails = {
    email: string;
    name: string;
    message: string;
};

type InputFieldProps = {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    placeholder: string;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    error?: string;
};

// The API returns hardcoded English messages (Zod / route errors). Map the
// known ones to localized dictionary strings; fall back to a generic message
// for anything unexpected (e.g. 500s).
function localizeContactError(
    serverError: string | undefined,
    dictionary: Awaited<ReturnType<typeof getDictionary>>['contact-page'],
): string {
    const messages: Record<string, string> = {
        'Invalid email address.': dictionary.errorInvalidEmail,
        'Email must not exceed 254 characters.': dictionary.errorEmailTooLong,
        'Name is required.': dictionary.errorNameRequired,
        'Name must not exceed 100 characters.': dictionary.errorNameTooLong,
        'Message is required.': dictionary.errorMessageRequired,
        'Message must not exceed 5000 characters.':
            dictionary.errorMessageTooLong,
        'Captcha token is required.': dictionary.errorCaptchaRequired,
        'Captcha verification failed': dictionary.errorCaptchaFailed,
        'Consent to the processing of personal data is required.':
            dictionary.consentRequired,
        'Too many requests. Please try again later.':
            dictionary.errorTooManyRequests,
    };

    return (
        (serverError && messages[serverError]) || dictionary.somethingWentWrong
    );
}

async function sendContactDetails(
    token: string,
    contactDetails: ContactDetails,
    consent: boolean,
    dictionary: Awaited<ReturnType<typeof getDictionary>>['contact-page'],
): Promise<string | null> {
    const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...contactDetails, token, consent }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        return localizeContactError(data?.error, dictionary);
    }
    return null;
}

function InputField({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
    required = false,
    rows,
    maxLength,
    error,
}: InputFieldProps) {
    const InputComponent = rows ? 'textarea' : 'input';
    return (
        <div className="w-full">
            <label htmlFor={id} className="label">
                {label}
            </label>
            <InputComponent
                id={id}
                type={type}
                className={`input ${error ? 'border-error-500 ring-2 ring-error-500' : ''}`}
                placeholder={placeholder}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                value={value}
                onChange={onChange}
                rows={rows}
                maxLength={maxLength}
            />
            {error ? (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="mt-1 text-sm text-error-500"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}

const getNotificationData = (
    status: NotificationStatus,
    error: string | null,
    dictionary: Awaited<ReturnType<typeof getDictionary>>['contact-page'],
) => {
    const notificationMap: {
        [key in NotificationStatus]: NotificationDetails;
    } = {
        pending: {
            status: 'pending',
            title: dictionary.sendingMessage,
            message: dictionary.messageOnItsWay,
        },
        success: {
            status: 'success',
            title: dictionary.success,
            message: dictionary.messageSentSuccessfully,
        },
        error: {
            status: 'error',
            title: dictionary.error,
            message: dictionary.errorOccurred,
        },
    };

    if (status) {
        const notification = notificationMap[status];
        if (status === 'error' && notification) {
            return {
                ...notification,
                message: error || dictionary.errorOccurred,
            };
        }
        return notification;
    }
    return null;
};

export default function ContactForm({
    userEmail = '',
    userName = '',
    dictionary,
}: {
    userEmail?: string;
    userName?: string;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['contact-page'];
}) {
    const [token, setToken] = useState('');
    const [messageDetails, setMessageDetails] = useState<ContactDetails>({
        email: userEmail,
        name: userName,
        message: '',
    });
    const [requestStatus, setRequestStatus] =
        useState<NotificationStatus | null>(null);
    const [requestError, setRequestError] = useState<string | null>(null);
    const [consent, setConsent] = useState(false);
    const [showConsentHint, setShowConsentHint] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof ContactDetails, string>>
    >({});

    useEffect(() => {
        if (requestStatus === 'success' || requestStatus === 'error') {
            const timer = setTimeout(() => {
                setRequestStatus(null);
                setRequestError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [requestStatus]);
    const handleInputChange =
        (field: keyof ContactDetails) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setMessageDetails((prev) => ({
                ...prev,
                [field]: event.target.value,
            }));
            setFieldErrors((prev) => {
                if (!prev[field]) {
                    return prev;
                }
                const next = { ...prev };
                delete next[field];
                return next;
            });
        };

    const validateFields = () => {
        const errors: Partial<Record<keyof ContactDetails, string>> = {};
        const email = messageDetails.email.trim();
        const name = messageDetails.name.trim();
        const message = messageDetails.message.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = dictionary.errorInvalidEmail;
        }
        if (!name) {
            errors.name = dictionary.errorNameRequired;
        }
        if (!message) {
            errors.message = dictionary.errorMessageRequired;
        }
        return errors;
    };

    const resetTurnstile = () => {
        if (typeof window !== 'undefined' && window.turnstile) {
            const el = document.getElementById('turnstile-widget');
            if (el) {
                window.turnstile.reset(el);
            }
        }
    };

    const sendMessageHandler = async (
        event: SyntheticEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!consent) {
            setShowConsentHint(true);
            document.getElementById('consent')?.focus();
            return;
        }

        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            const firstInvalid = (
                ['email', 'name', 'message'] as const
            ).find((field) => errors[field]);
            if (firstInvalid) {
                document.getElementById(firstInvalid)?.focus();
            }
            return;
        }
        setFieldErrors({});
        setRequestStatus('pending');

        const error = await sendContactDetails(
            token,
            messageDetails,
            consent,
            dictionary,
        );
        resetTurnstile();

        if (error) {
            setRequestError(error);
            setRequestStatus('error');
            return;
        }

        setRequestStatus('success');
        setMessageDetails({ email: '', name: '', message: '' });
        setConsent(false);
        setShowConsentHint(false);
    };

    const notificationData =
        requestStatus !== null
            ? getNotificationData(requestStatus, requestError, dictionary)
            : null;

    return (
        <section className="card max-w-2xl">
            <h2 className="mb-6 text-center text-lg font-bold text-accent lg:text-2xl">
                {dictionary.howCanIHelp}
            </h2>
            <form
                noValidate
                className="flex flex-col gap-3"
                onSubmit={sendMessageHandler}
            >
                <div className="flex flex-col gap-3 lg:flex-row">
                    <InputField
                        id="email"
                        label={dictionary.yourEmail}
                        type="email"
                        value={messageDetails.email}
                        onChange={handleInputChange('email')}
                        placeholder="your@example.com"
                        required
                        maxLength={254}
                        error={fieldErrors.email}
                    />
                    <InputField
                        id="name"
                        label={dictionary.yourName}
                        type="text"
                        value={messageDetails.name}
                        onChange={handleInputChange('name')}
                        placeholder={dictionary.enterYourName}
                        required
                        maxLength={100}
                        error={fieldErrors.name}
                    />
                </div>
                <InputField
                    id="message"
                    label={dictionary.yourMessage}
                    type="text"
                    value={messageDetails.message}
                    onChange={handleInputChange('message')}
                    placeholder={dictionary.enterYourMessage}
                    required
                    rows={5}
                    maxLength={5000}
                    error={fieldErrors.message}
                />
                <div className="h-16.5">
                    <Turnstile
                        sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                        onVerify={(token) => setToken(token)}
                        className="text-center"
                        id="turnstile-widget"
                    />
                </div>

                <div className="flex items-start gap-2">
                    <input
                        id="consent"
                        type="checkbox"
                        aria-describedby={
                            showConsentHint ? 'consent-hint' : undefined
                        }
                        className={`mt-1 size-4 shrink-0 cursor-pointer accent-accent-500 ${
                            showConsentHint
                                ? 'rounded-xs ring-2 ring-error-500 ring-offset-2 ring-offset-background-primary'
                                : ''
                        }`}
                        checked={consent}
                        onChange={(event) => {
                            setConsent(event.target.checked);
                            if (event.target.checked) {
                                setShowConsentHint(false);
                            }
                        }}
                        required
                    />
                    <label
                        htmlFor="consent"
                        className="cursor-pointer text-sm text-secondary"
                    >
                        {dictionary.consentLabelPrefix}&nbsp;
                        <Link
                            title={dictionary.openPrivacyPolicyPage}
                            aria-label={dictionary.openPrivacyPolicyPage}
                            href="/privacy-policy"
                            className="link text-blue-700 hover:underline dark:text-blue-400"
                        >
                            {dictionary.consentPrivacyPolicyLink}
                        </Link>
                        .
                    </label>
                </div>

                {showConsentHint ? (
                    <p
                        id="consent-hint"
                        role="alert"
                        className="text-sm text-error-500"
                    >
                        {dictionary.consentRequired}
                    </p>
                ) : null}

                {/* The button is genuinely `disabled`, so it cannot receive
                    clicks. The wrapper captures the click attempt to surface a
                    hint (`pointer-events-none` lets the event reach it). */}
                <div
                    className="flex justify-center"
                    onClick={() => {
                        if (!consent) {
                            setShowConsentHint(true);
                            document.getElementById('consent')?.focus();
                        }
                    }}
                >
                    <button
                        aria-label={dictionary.sendMessage}
                        title={dictionary.sendMessage}
                        disabled={requestStatus === 'pending' || !consent}
                        type="submit"
                        className="button button-solid button-md disabled:pointer-events-none"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                    </svg>

                    {requestStatus === 'pending'
                        ? dictionary.sending
                        : dictionary.sendMessage}
                    </button>
                </div>
            </form>
            {notificationData && requestStatus !== 'pending' ? (
                <Notification {...notificationData} />
            ) : null}
        </section>
    );
}
