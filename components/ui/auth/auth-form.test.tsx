import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('next-auth/react', () => ({
    signIn: vi.fn(),
}));

vi.mock('@/app/actions/auth', () => ({
    createUser: vi.fn(),
}));

vi.mock('@/components/ui/TogglePasswordButton', () => ({
    default: () => null,
}));

import type { Dictionary } from '@/get-dictionary';

import AuthForm from './auth-form';

const mockDictionary = {
    login: 'Log In',
    signUp: 'Sign Up',
    invalidEmailAddress: 'Invalid email',
    emailRequired: 'Email required',
    atLeast7Characters: 'At least 7 characters',
    passwordRequired: 'Password required',
    passwordsMustMatch: 'Passwords must match',
    pleaseConfirmPassword: 'Please confirm password',
    yourEmail: 'your@email.com',
    password: 'Password',
    yourPassword: 'Your password',
    confirmPassword: 'Confirm password',
    sending: 'Sending...',
    submitSignUp: 'Create Account',
    haveAccount: 'Already have an account?',
    doNotHaveAccount: "Don't have an account?",
    createAccount: 'Create account',
    failedToLogIn: 'Failed to log in',
    accountCreated: 'Account created',
    accountCreatedYouCanLogin: 'You can now log in',
} as Dictionary['auth-page'];

describe('AuthForm', () => {
    it('renders login form by default', () => {
        render(<AuthForm dictionary={mockDictionary} />);
        expect(
            screen.getByRole('heading', { name: 'Log In' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('does not show confirm password in login mode', () => {
        render(<AuthForm dictionary={mockDictionary} />);
        expect(
            screen.queryByLabelText('Confirm password'),
        ).not.toBeInTheDocument();
    });

    it('switches to sign up mode', async () => {
        render(<AuthForm dictionary={mockDictionary} />);
        await userEvent.click(screen.getByText('Create account'));
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        render(<AuthForm dictionary={mockDictionary} />);
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'invalid');
        await userEvent.tab();
        await waitFor(() => {
            expect(screen.getByText('Invalid email')).toBeInTheDocument();
        });
    });

    it('shows validation error for short password', async () => {
        render(<AuthForm dictionary={mockDictionary} />);
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, 'short');
        await userEvent.tab();
        await waitFor(() => {
            expect(
                screen.getByText('At least 7 characters'),
            ).toBeInTheDocument();
        });
    });
});
