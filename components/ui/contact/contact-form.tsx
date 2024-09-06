'use client'
import { ChangeEvent, FormEvent, useState } from 'react';
import Notification, { NotificationDetails } from '@/components/ui/notification';

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
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string;
    required?: boolean;
    rows?: number;
}

async function sendContactDetails(contactDetails: ContactDetails): Promise<void> {
    const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contactDetails),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message || 'Something went wrong!')
    }
}

function InputField({id, label, type, value, onChange, placeholder, required = false, rows}: InputFieldProps) {
    const InputComponent = rows ? 'textarea' : 'input';
    return (
        <div>
            <label htmlFor={id} className="block text-md font-medium">
                {label}
            </label>
            <InputComponent
                id={id}
                type={type}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-amber-500 focus:border-amber-500
                   sm:text-sm text-gray-100 bg-gray-800"
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
        message: ''
    });
    const [requestStatus, setRequestStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [requestError, setRequestError] = useState();
    const handleInputChange = (field: keyof ContactDetails) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setMessageDetails(prev => ({...prev, [field]: event.target.value}));
    };

    const sendMessageHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestStatus('pending');
        try {
            await sendContactDetails(messageDetails);
            setRequestStatus('success');
            setMessageDetails({email: '', name: '', message: ''});
        } catch (error) {
            setRequestError(error.message);
            setRequestStatus('error');
            console.error(error);
        }
    }

    let notificationData: NotificationDetails;

    if (requestStatus === 'pending') {
        notificationData = {
            status: 'pending',
            title: 'Sending message...',
            message: 'Your message is on its way'
        }
    }
    if (requestStatus === 'success') {
        notificationData = {
            status: 'success',
            title: 'Success!',
            message: 'Message sent successfully'
        }
    }
    if (requestStatus === 'error') {
        notificationData = {
            status: 'error',
            title: 'Error!',
            message: requestError,
        }
    }

    return (
        <section>
            <h1 className='text-4xl font-bold mb-6 text-center relative'>
                How can I help you?
            </h1>
            <form className='flex flex-col gap-3' onSubmit={sendMessageHandler}>
                <div className='flex gap-3'>
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
                    type='submit'
                    className="bg-gray-700 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg"
                >
                    {requestStatus === 'pending' ? 'Sending...' : 'Send message'}
                </button>
            </form>
            {notificationData
                ? <Notification {...notificationData} />
                : null
            }
        </section>
    )
}