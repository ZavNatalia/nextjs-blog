import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReset = vi.fn();

vi.mock('react-turnstile', () => ({
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button
            type="button"
            data-testid="turnstile"
            onClick={() => onVerify('test-token')}
        >
            Verify
        </button>
    ),
}));

import type { Dictionary } from '@/get-dictionary';

import ContactForm from './contact-form';

const mockDictionary = {
    main: 'main',
    contactMe: 'Contact Me',
    pageDescription: 'Here you can send me a message',
    contact: 'contact',
    howCanIHelp: 'How can I help you?',
    yourEmail: 'Your Email',
    yourName: 'Your name',
    enterYourName: 'Enter your name',
    yourMessage: 'Your message',
    enterYourMessage: 'Enter your message',
    sending: 'Sending...',
    sendMessage: 'Send message',
    sendingMessage: 'Sending message...',
    messageOnItsWay: 'Your message is on its way',
    success: 'Success!',
    messageSentSuccessfully: 'Message sent successfully',
    error: 'Error!',
    errorOccurred: 'An error occurred',
    openPrivacyPolicyPage: 'Open Privacy Policy page',
    consentLabelPrefix:
        'By clicking the «Send» button, I consent to the processing of my personal data and agree to the terms of the',
    consentPrivacyPolicyLink: 'Privacy Policy',
    consentRequired: 'Consent to the processing of personal data is required',
    errorInvalidEmail: 'Invalid email address.',
    errorEmailTooLong: 'Email must not exceed 254 characters.',
    errorNameRequired: 'Please enter your name.',
    errorNameTooLong: 'Name must not exceed 100 characters.',
    errorMessageRequired: 'Please enter a message.',
    errorMessageTooLong: 'Message must not exceed 5000 characters.',
    errorCaptchaRequired: 'Please confirm that you are not a robot.',
    errorCaptchaFailed: 'Captcha verification failed. Please try again.',
    errorTooManyRequests: 'Too many requests. Please try again later.',
    somethingWentWrong: 'Something went wrong!',
} as Dictionary['contact-page'];

const mockFetch = vi.fn();

beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    const notificationsRoot = document.createElement('div');
    notificationsRoot.id = 'notifications';
    document.body.appendChild(notificationsRoot);
    window.turnstile = { reset: mockReset };
});

afterEach(() => {
    document.getElementById('notifications')?.remove();
    delete window.turnstile;
});

describe('ContactForm', () => {
    it('renders all form fields', () => {
        render(<ContactForm dictionary={mockDictionary} />);
        expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Your name')).toBeInTheDocument();
        expect(screen.getByLabelText('Your message')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Send message' }),
        ).toBeInTheDocument();
    });

    it('pre-fills email when userEmail is provided', () => {
        render(
            <ContactForm userEmail="user@test.com" dictionary={mockDictionary} />,
        );
        expect(screen.getByLabelText('Your Email')).toHaveValue(
            'user@test.com',
        );
    });

    it('pre-fills name when userName is provided', () => {
        render(
            <ContactForm userName="John Doe" dictionary={mockDictionary} />,
        );
        expect(screen.getByLabelText('Your name')).toHaveValue('John Doe');
    });

    it('updates input values on typing', async () => {
        const user = userEvent.setup();
        render(<ContactForm dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');

        expect(screen.getByLabelText('Your name')).toHaveValue('John');
        expect(screen.getByLabelText('Your message')).toHaveValue('Hello');
    });

    it('shows success notification on successful submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Success' }),
        } as Response);

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(
                screen.getByText('Message sent successfully'),
            ).toBeInTheDocument();
        });
    });

    it('clears form fields after successful submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Success' }),
        } as Response);

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByLabelText('Your Email')).toHaveValue('');
            expect(screen.getByLabelText('Your name')).toHaveValue('');
            expect(screen.getByLabelText('Your message')).toHaveValue('');
        });
    });

    it('shows a localized error notification on failed submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Captcha token is required.' }),
        } as Response);

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByText('Error!')).toBeInTheDocument();
            // raw server string is mapped to the localized dictionary message
            expect(
                screen.getByText('Please confirm that you are not a robot.'),
            ).toBeInTheDocument();
        });
    });

    it('falls back to a generic message for unknown server errors', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Some unexpected server failure' }),
        } as Response);

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
        });
    });

    it('disables submit button while sending', async () => {
        const user = userEvent.setup();
        mockFetch.mockReturnValue(new Promise(() => {}));

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(
            screen.getByRole('button', { name: 'Send message' }),
        ).toBeDisabled();
        expect(screen.getByText('Sending...')).toBeInTheDocument();
    });

    it('resets turnstile widget after successful submit', async () => {
        const user = userEvent.setup();
        const el = document.createElement('div');
        el.id = 'turnstile-widget';
        document.body.appendChild(el);

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Success' }),
        } as Response);

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(mockReset).toHaveBeenCalled();
        });

        el.remove();
    });

    it('sends correct data to the API', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Success' }),
        } as Response);

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/contact',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }),
            );
            const body = JSON.parse(mockFetch.mock.calls[0][1].body);
            expect(body).toMatchObject({
                email: 'test@test.com',
                name: 'John',
                message: 'Hello',
                consent: true,
            });
        });
    });

    it('shows field validation errors instead of submitting when fields are empty', async () => {
        const user = userEvent.setup();

        render(<ContactForm dictionary={mockDictionary} />);

        // Give consent so the button is enabled, but leave the fields empty.
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        // The request is not sent...
        expect(mockFetch).not.toHaveBeenCalled();
        // ...and a localized hint is shown for each empty field.
        expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
        expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
        expect(screen.getByText('Please enter a message.')).toBeInTheDocument();

        // Typing into a field clears its error.
        await user.type(screen.getByLabelText('Your name'), 'John');
        expect(
            screen.queryByText('Please enter your name.'),
        ).not.toBeInTheDocument();
    });

    it('shows a consent hint when trying to submit without consent', async () => {
        const user = userEvent.setup();

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');

        // No hint before the user interacts with the disabled button.
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        // The button is disabled, so the click is captured by its wrapper.
        const button = screen.getByRole('button', { name: 'Send message' });
        await user.click(button.parentElement as HTMLElement);

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Consent to the processing of personal data is required',
        );

        // Giving consent clears the hint.
        await user.click(screen.getByRole('checkbox'));
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('disables submit button until consent is given', async () => {
        const user = userEvent.setup();

        render(
            <ContactForm
                userEmail="test@test.com"
                dictionary={mockDictionary}
            />,
        );

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));

        expect(
            screen.getByRole('button', { name: 'Send message' }),
        ).toBeDisabled();

        await user.click(screen.getByRole('checkbox'));

        expect(
            screen.getByRole('button', { name: 'Send message' }),
        ).toBeEnabled();
    });
});
