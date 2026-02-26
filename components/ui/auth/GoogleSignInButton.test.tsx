import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSignIn = vi.fn();

vi.mock('next-auth/react', () => ({
    signIn: (...args: unknown[]) => mockSignIn(...args),
}));

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
    ),
}));

import type { Dictionary } from '@/get-dictionary';

import GoogleSignInButton from './GoogleSignInButton';

const mockDictionary = {
    signInWith: 'Sign in with',
} as Dictionary['auth-page'];

beforeEach(() => {
    vi.clearAllMocks();
});

describe('GoogleSignInButton', () => {
    it('renders button text and Google logo', () => {
        render(<GoogleSignInButton dictionary={mockDictionary} />);
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
        expect(screen.getByAltText('Google Logo')).toBeInTheDocument();
    });

    it('calls signIn with google on click', async () => {
        render(<GoogleSignInButton dictionary={mockDictionary} />);
        await userEvent.click(screen.getByRole('button'));
        expect(mockSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
    });
});
