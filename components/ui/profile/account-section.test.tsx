import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSignOut = vi.fn();
const mockUpdate = vi.fn();
const mockFetch = vi.fn();

vi.mock('next-auth/react', () => ({
    signOut: () => mockSignOut(),
    useSession: () => ({ update: mockUpdate }),
}));

beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    mockUpdate.mockReset();
});

import { getDictionary } from '@/get-dictionary';

import { AccountSection } from './account-section';

type AccountDictionary = Awaited<
    ReturnType<typeof getDictionary>
>['profile-page']['accountSection'];

const mockDictionary: AccountDictionary = {
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
    noEmailProvided: 'No email provided',
};

beforeAll(() => {
    const notificationsRoot = document.createElement('div');
    notificationsRoot.id = 'notifications';
    document.body.appendChild(notificationsRoot);
});

afterEach(() => {
    vi.unstubAllGlobals();
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

    it('disables save button when name is unchanged', () => {
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        const saveButton = screen.getByRole('button', {
            name: 'Save Changes',
        });
        expect(saveButton).toBeDisabled();
    });

    it('enables save button when name is changed', async () => {
        const user = userEvent.setup();
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        const input = screen.getByPlaceholderText('Enter your name');
        await user.clear(input);
        await user.type(input, 'New Name');

        const saveButton = screen.getByRole('button', {
            name: 'Save Changes',
        });
        expect(saveButton).toBeEnabled();
    });

    it('shows validation error for short name', async () => {
        const user = userEvent.setup();
        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        const input = screen.getByPlaceholderText('Enter your name');
        await user.clear(input);
        await user.type(input, 'A');

        const saveButton = screen.getByRole('button', {
            name: 'Save Changes',
        });
        await user.click(saveButton);

        await waitFor(() => {
            expect(
                screen.getByText('Name must be at least 2 characters'),
            ).toBeInTheDocument();
        });
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('shows success notification after successful submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Profile updated successfully.' }),
        });

        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        const input = screen.getByPlaceholderText('Enter your name');
        await user.clear(input);
        await user.type(input, 'New Name');
        await user.click(
            screen.getByRole('button', { name: 'Save Changes' }),
        );

        await waitFor(() => {
            expect(
                screen.getByText('Profile updated successfully!'),
            ).toBeInTheDocument();
        });
    });

    it('shows error notification on failed submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'User not found.' }),
        });

        render(
            <AccountSection
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
            />,
        );
        const input = screen.getByPlaceholderText('Enter your name');
        await user.clear(input);
        await user.type(input, 'New Name');
        await user.click(
            screen.getByRole('button', { name: 'Save Changes' }),
        );

        await waitFor(() => {
            expect(
                screen.getByText('User not found.'),
            ).toBeInTheDocument();
        });
    });
});
