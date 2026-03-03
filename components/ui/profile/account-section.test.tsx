import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
    signOut: () => mockSignOut(),
    useSession: () => ({ update: vi.fn() }),
}));

import { AccountSection } from './account-section';

const mockDictionary = {
    yourAccount: 'Your Account',
    name: 'Display Name',
    namePlaceholder: 'Enter your name',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdatedSuccessfully: 'Profile updated successfully!',
    failedUpdateProfile: 'Failed to update profile.',
    somethingWentWrong: 'Something went wrong.',
    success: 'Success',
    error: 'Error',
    nameRequired: 'Name is required',
    nameMinLength: 'Name must be at least 2 characters',
    nameMaxLength: 'Name must not exceed 50 characters',
    logout: 'Log Out',
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('AccountSection', () => {
    it('renders user email', () => {
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });

    it('renders section title', () => {
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('Your Account')).toBeInTheDocument();
    });

    it('renders name initial when name is set', () => {
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('renders email initial when no name', () => {
        render(
            <AccountSection
                userEmail="user@test.com"
                userName=""
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('calls signOut on logout click', async () => {
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        await userEvent.click(screen.getByText('Log Out'));
        expect(mockSignOut).toHaveBeenCalledOnce();
    });
});
