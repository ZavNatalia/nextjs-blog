import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
    useSession: () => ({ update: vi.fn() }),
}));

vi.mock('next/link', () => ({
    default: ({
        children,
        href,
        ...props
    }: {
        children: React.ReactNode;
        href: string;
        [key: string]: unknown;
    }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        common: {
            showPassword: 'Show password',
            hidePassword: 'Hide password',
        },
    }),
}));

import type { Dictionary } from '@/get-dictionary';

import UserProfile from './user-profile';

const mockDictionary = {
    profile: 'Profile',
    yourAccount: 'Your Account',
    security: 'Security',
    dangerZone: 'Danger Zone',
    accountSection: {
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
    },
    securitySection: {
        security: 'Security',
        wantToChangeYourPassword: 'Want to change your password?',
        oldPassword: 'Old Password',
        newPassword: 'New Password',
        changePassword: 'Change Password',
        oldPasswordRequired: 'Required',
        newPasswordRequired: 'Required',
        atLeast7Characters: 'At least 7 characters',
        sending: 'Sending...',
        success: 'Success',
        error: 'Error',
        passwordChangedSuccessfully: 'Password changed.',
        failedChangePassword: 'Failed.',
        somethingWentWrong: 'Error.',
        oldPasswordIncorrect: 'Incorrect.',
        reviewPrivacyPolicy: 'Review our privacy policy',
        here: 'here',
    },
    dangerZoneSection: {
        dangerZone: 'Danger Zone',
        deletingIsIrreversible: 'This is irreversible.',
        deleteAccount: 'Delete Account',
        deletingAccount: 'Deleting...',
        confirmAccountDeletion: 'Confirm',
        areYouSureYouWantToDelete: 'Are you sure?',
        thisActionCannotBeUndone: 'Cannot be undone.',
        cancel: 'Cancel',
        confirmDelete: 'Yes, delete',
        success: 'Success',
        error: 'Error',
        accountDeletedSuccessfully: 'Deleted.',
        failedDeleteAccount: 'Failed.',
        noEmailProvided: 'No email provided',
        somethingWentWrong: 'Error.',
    },
} as Dictionary['profile-page'];

describe('UserProfile', () => {
    it('renders Account section by default', () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });

    it('switches to Security section', async () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const securityButtons = screen.getAllByText('Security');
        await userEvent.click(securityButtons[0]);
        expect(
            screen.getByText('Want to change your password?'),
        ).toBeInTheDocument();
    });

    it('switches to Danger Zone section', async () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const dangerButtons = screen.getAllByText('Danger Zone');
        await userEvent.click(dangerButtons[0]);
        expect(screen.getByText('This is irreversible.')).toBeInTheDocument();
    });

    it('renders tablist with role="tablist"', () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const tablists = screen.getAllByRole('tablist');
        expect(tablists.length).toBeGreaterThanOrEqual(1);
    });

    it('renders tabs with role="tab" and correct aria-selected', () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const tabs = screen.getAllByRole('tab');
        expect(tabs.length).toBeGreaterThanOrEqual(3);

        const accountTabs = tabs.filter(
            (t) => t.getAttribute('aria-selected') === 'true',
        );
        expect(accountTabs.length).toBeGreaterThanOrEqual(1);
    });

    it('renders tabpanel with correct aria-labelledby', () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveAttribute('id', 'panel-Account');
        expect(panel).toHaveAttribute('aria-labelledby', 'tab-Account');
    });

    it('updates aria-selected when switching tabs', async () => {
        render(
            <UserProfile
                userEmail="user@test.com"
                userName="Test User"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const securityTabs = screen
            .getAllByRole('tab')
            .filter((t) => t.textContent === 'Security');
        await userEvent.click(securityTabs[0]);

        expect(securityTabs[0]).toHaveAttribute('aria-selected', 'true');
        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveAttribute('id', 'panel-Security');
    });
});
