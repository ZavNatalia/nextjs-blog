'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Notification, {
    NotificationDetails,
    NotificationStatus,
} from '@/components/ui/notification';

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
        throw new Error(data?.message || 'Something went wrong!');
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
        <div className='w-full'>
            <label htmlFor={id} className="label">
                {label}
            </label>
            <InputComponent
                id={id}
                type={type}
                className="input sm:text-md"
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                rows={rows}
            />
        </div>
    );
}

const notificationMap: {
    [key in NotificationStatus]: NotificationDetails;
} = {
    pending: {
        status: 'pending',
        title: 'Sending message...',
        message: 'Your message is on its way',
    },
    success: {
        status: 'success',
        title: 'Success!',
        message: 'Message sent successfully',
    },
    error: {
        status: 'error',
        title: 'Error!',
        message: '',
    },
};

const getNotificationData = (
    status: NotificationStatus,
    error: string | null,
): NotificationDetails | null => {
    if (status) {
        const notification = notificationMap[status];
        if (status === 'error' && notification) {
            return {
                ...notification,
                message: error || 'An error occurred',
            };
        }
        return notification;
    }
    return null;
};

export default function ContactForm() {
    const [messageDetails, setMessageDetails] = useState<ContactDetails>({
        email: '',
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
            await sendContactDetails(messageDetails);
            setRequestStatus('success');
            setMessageDetails({ email: '', name: '', message: '' });
        } catch (error) {
            setRequestError(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred',
            );
            setRequestStatus('error');
            console.error(error);
        }
    };

    const notificationData =
        requestStatus !== null
            ? getNotificationData(requestStatus, requestError)
            : null;

    return (
        <section className='w-3/4 lg:w-[600px]'>
            <h1 className="relative mb-6 text-center text-4xl font-bold">
                How can I help you?
            </h1>
            <form className="flex flex-col gap-3" onSubmit={sendMessageHandler}>
                <div className="flex gap-3 flex-col lg:flex-row">
                    <InputField
                        id="email"
                        label="Your Email"
                        type="email"
                        value={messageDetails.email}
                        onChange={handleInputChange('email')}
                        placeholder="your@example.com"
                        required
                    />
                    <InputField
                        id="name"
                        label="Your name"
                        type="text"
                        value={messageDetails.name}
                        onChange={handleInputChange('name')}
                        placeholder="enter your name"
                        required
                    />
                </div>
                <InputField
                    id="message"
                    label="Your message"
                    type="text"
                    value={messageDetails.message}
                    onChange={handleInputChange('message')}
                    placeholder="enter your message"
                    required
                    rows={5}
                />
                <button
                    disabled={requestStatus === 'pending'}
                    type="submit"
                    className="button self-end"
                >
                    {requestStatus === 'pending'
                        ? 'Sending...'
                        : 'Send message'}
                </button>
            </form>
            {notificationData && requestStatus !== 'pending' ? (
                <Notification {...notificationData} />
            ) : null}
        </section>
    );
}
