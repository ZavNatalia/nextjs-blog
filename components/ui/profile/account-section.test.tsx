import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
    signOut: () => mockSignOut(),
}));

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
        <img alt={alt} {...props} />
    ),
}));

import { AccountSection } from './account-section';

const mockDictionary = {
    yourAccount: 'Your Account',
    logout: 'Log Out',
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('AccountSection', () => {
    it('renders user email', () => {
        render(<AccountSection userEmail="user@test.com" dictionary={mockDictionary} />);
        expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });

    it('renders section title', () => {
        render(<AccountSection userEmail="user@test.com" dictionary={mockDictionary} />);
        expect(screen.getByText('Your Account')).toBeInTheDocument();
    });

    it('renders avatar', () => {
        render(<AccountSection userEmail="user@test.com" dictionary={mockDictionary} />);
        expect(screen.getByAltText('User avatar')).toBeInTheDocument();
    });

    it('calls signOut on logout click', async () => {
        render(<AccountSection userEmail="user@test.com" dictionary={mockDictionary} />);
        await userEvent.click(screen.getByText('Log Out'));
        expect(mockSignOut).toHaveBeenCalledOnce();
    });
});
