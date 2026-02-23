import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReset = vi.fn();

vi.mock('react-turnstile', () => ({
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <button data-testid="turnstile" onClick={() => onVerify('test-token')}>
            Verify
        </button>
    ),
}));

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
    bySubmittingMessage: 'By submitting a message you agree to',
    privacyPolicy: 'Privacy Policy',
    openPrivacyPolicyPage: 'Open Privacy Policy page',
    consentProcessingPersonalData: 'and consent to the processing of your personal data.',
    somethingWentWrong: 'Something went wrong!',
} as never;

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
        render(<ContactForm userEmail="" dictionary={mockDictionary} />);
        expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Your name')).toBeInTheDocument();
        expect(screen.getByLabelText('Your message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    });

    it('pre-fills email when userEmail is provided', () => {
        render(<ContactForm userEmail="user@test.com" dictionary={mockDictionary} />);
        expect(screen.getByLabelText('Your Email')).toHaveValue('user@test.com');
    });

    it('updates input values on typing', async () => {
        const user = userEvent.setup();
        render(<ContactForm userEmail="" dictionary={mockDictionary} />);

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

        render(<ContactForm userEmail="test@test.com" dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(screen.getByText('Message sent successfully')).toBeInTheDocument();
        });
    });

    it('clears form fields after successful submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Success' }),
        } as Response);

        render(<ContactForm userEmail="test@test.com" dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByLabelText('Your Email')).toHaveValue('');
            expect(screen.getByLabelText('Your name')).toHaveValue('');
            expect(screen.getByLabelText('Your message')).toHaveValue('');
        });
    });

    it('shows error notification on failed submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Invalid email' }),
        } as Response);

        render(<ContactForm userEmail="test@test.com" dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        await waitFor(() => {
            expect(screen.getByText('Error!')).toBeInTheDocument();
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
        });
    });

    it('disables submit button while sending', async () => {
        const user = userEvent.setup();
        mockFetch.mockReturnValue(new Promise(() => {}));

        render(<ContactForm userEmail="test@test.com" dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
        await user.click(screen.getByRole('button', { name: 'Send message' }));

        expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
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

        render(<ContactForm userEmail="test@test.com" dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
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

        render(<ContactForm userEmail="test@test.com" dictionary={mockDictionary} />);

        await user.type(screen.getByLabelText('Your name'), 'John');
        await user.type(screen.getByLabelText('Your message'), 'Hello');
        await user.click(screen.getByTestId('turnstile'));
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
            });
        });
    });
});
