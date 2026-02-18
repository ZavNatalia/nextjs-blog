import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
}));

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
        <img alt={alt} {...props} />
    ),
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

import UserProfile from './user-profile';

const mockDictionary = {
    yourAccount: 'Your Account',
    security: 'Security',
    dangerZone: 'Danger Zone',
    accountSection: {
        yourAccount: 'Your Account',
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
        somethingWentWrong: 'Error.',
    },
} as never;

describe('UserProfile', () => {
    it('renders Account section by default', () => {
        render(<UserProfile userEmail="user@test.com" dictionary={mockDictionary} />);
        expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });

    it('switches to Security section', async () => {
        render(<UserProfile userEmail="user@test.com" dictionary={mockDictionary} />);
        const securityButtons = screen.getAllByText('Security');
        await userEvent.click(securityButtons[0]);
        expect(screen.getByText('Want to change your password?')).toBeInTheDocument();
    });

    it('switches to Danger Zone section', async () => {
        render(<UserProfile userEmail="user@test.com" dictionary={mockDictionary} />);
        const dangerButtons = screen.getAllByText('Danger Zone');
        await userEvent.click(dangerButtons[0]);
        expect(screen.getByText('This is irreversible.')).toBeInTheDocument();
    });
});
