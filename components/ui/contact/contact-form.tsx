'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Notification, {
    NotificationDetails,
} from '@/components/ui/notification';

interface ContactDetails {
    email: string;
    name: string;
    message: string;
}

interface InputFieldProps {
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
}

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
        <div>
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

export default function ContactForm() {
    const [messageDetails, setMessageDetails] = useState<ContactDetails>({
        email: '',
        name: '',
        message: '',
    });
    const [requestStatus, setRequestStatus] = useState<
        'idle' | 'pending' | 'success' | 'error'
    >('idle');
    const [requestError, setRequestError] = useState();

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
            setRequestError(error.message);
            setRequestStatus('error');
            console.error(error);
        }
    };

    let notificationData: NotificationDetails;

    if (requestStatus === 'pending') {
        notificationData = {
            status: 'pending',
            title: 'Sending message...',
            message: 'Your message is on its way',
        };
    }
    if (requestStatus === 'success') {
        notificationData = {
            status: 'success',
            title: 'Success!',
            message: 'Message sent successfully',
        };
    }
    if (requestStatus === 'error') {
        notificationData = {
            status: 'error',
            title: 'Error!',
            message: requestError,
        };
    }

    return (
        <section>
            <h1 className="relative mb-6 text-center text-4xl font-bold">
                How can I help you?
            </h1>
            <form className="flex flex-col gap-3" onSubmit={sendMessageHandler}>
                <div className="flex gap-3">
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
