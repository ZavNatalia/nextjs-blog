'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Notification, {
    NotificationDetails,
    NotificationStatus,
} from '@/components/ui/Notification';
import { getDictionary } from '@/get-dictionary';

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
};

async function sendContactDetails(
    contactDetails: ContactDetails,
    dictionary: Awaited<ReturnType<typeof getDictionary>>['contact-page'],
): Promise<void> {
    const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contactDetails),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message || dictionary.somethingWentWrong);
    }
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
                className="input"
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                rows={rows}
            />
        </div>
    );
}

const getNotificationData = (
    status: NotificationStatus,
    error: string | null,
    dictionary: Record<string, any>,
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
    userEmail,
    dictionary,
}: {
    userEmail: string;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['contact-page'];
}) {
    const [messageDetails, setMessageDetails] = useState<ContactDetails>({
        email: userEmail,
        name: '',
        message: '',
    });
    const [requestStatus, setRequestStatus] =
        useState<NotificationStatus | null>(null);
    const [requestError, setRequestError] = useState<string | null>(null);

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
        };

    const sendMessageHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestStatus('pending');
        try {
            await sendContactDetails(messageDetails, dictionary);
            setRequestStatus('success');
            setMessageDetails({ email: '', name: '', message: '' });
        } catch (error) {
            setRequestError(
                error instanceof Error
                    ? error.message
                    : dictionary.unknownError,
            );
            setRequestStatus('error');
        }
    };

    const notificationData =
        requestStatus !== null
            ? getNotificationData(requestStatus, requestError, dictionary)
            : null;

    return (
        <section className="w-full max-w-xl flex-1">
            <form className="flex flex-col gap-3" onSubmit={sendMessageHandler}>
                <div className="flex flex-col gap-3 lg:flex-row">
                    <InputField
                        id="email"
                        label={dictionary.yourEmail}
                        type="email"
                        value={messageDetails.email}
                        onChange={handleInputChange('email')}
                        placeholder="your@example.com"
                        required
                    />
                    <InputField
                        id="name"
                        label={dictionary.yourName}
                        type="text"
                        value={messageDetails.name}
                        onChange={handleInputChange('name')}
                        placeholder={dictionary.enterYourName}
                        required
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
                />
                <button
                    disabled={requestStatus === 'pending'}
                    type="submit"
                    className="button-accent flex items-center gap-1 self-end"
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
            </form>
            {notificationData && requestStatus !== 'pending' ? (
                <Notification {...notificationData} />
            ) : null}
        </section>
    );
}
