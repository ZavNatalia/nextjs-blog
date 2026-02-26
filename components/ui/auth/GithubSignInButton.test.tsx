import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSignIn = vi.fn();

vi.mock('next-auth/react', () => ({
    signIn: (...args: unknown[]) => mockSignIn(...args),
}));

import type { Dictionary } from '@/get-dictionary';

import GithubSignInButton from './GithubSignInButton';

const mockDictionary = {
    signInWith: 'Sign in with',
} as Dictionary['auth-page'];

beforeEach(() => {
    vi.clearAllMocks();
});

describe('GithubSignInButton', () => {
    it('renders button text', () => {
        render(<GithubSignInButton dictionary={mockDictionary} />);
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });

    it('calls signIn with github on click', async () => {
        render(<GithubSignInButton dictionary={mockDictionary} />);
        await userEvent.click(screen.getByRole('button'));
        expect(mockSignIn).toHaveBeenCalledWith('github');
    });
});
