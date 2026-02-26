import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
    usePathname: () => '/en/profile',
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        common: {
            showPassword: 'Show password',
            hidePassword: 'Hide password',
        },
    }),
}));

import ChangePasswordForm from './change-password-form';

const mockDictionary: Record<string, string> = {
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    changePassword: 'Change Password',
    oldPasswordRequired: 'Old password is required',
    newPasswordRequired: 'New password is required',
    atLeast7Characters: 'At least 7 characters',
    sending: 'Sending...',
    success: 'Success',
    error: 'Error',
    passwordChangedSuccessfully: 'Password changed.',
    failedChangePassword: 'Failed.',
    somethingWentWrong: 'Error occurred.',
    oldPasswordIncorrect: 'Incorrect old password.',
};

describe('ChangePasswordForm', () => {
    it('renders form fields and submit button', () => {
        render(<ChangePasswordForm dictionary={mockDictionary} />);
        expect(screen.getByLabelText('Old Password')).toBeInTheDocument();
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Change Password' }),
        ).toBeInTheDocument();
    });

    it('shows validation error for empty old password', async () => {
        render(<ChangePasswordForm dictionary={mockDictionary} />);
        const newPasswordInput = screen.getByLabelText('New Password');
        await userEvent.type(newPasswordInput, 'newpass123');
        await userEvent.click(
            screen.getByRole('button', { name: 'Change Password' }),
        );
        await waitFor(() => {
            expect(
                screen.getByText('Old password is required'),
            ).toBeInTheDocument();
        });
    });

    it('shows validation error for short new password', async () => {
        render(<ChangePasswordForm dictionary={mockDictionary} />);
        const oldPasswordInput = screen.getByLabelText('Old Password');
        const newPasswordInput = screen.getByLabelText('New Password');
        await userEvent.type(oldPasswordInput, 'oldpass123');
        await userEvent.type(newPasswordInput, 'short');
        await userEvent.click(
            screen.getByRole('button', { name: 'Change Password' }),
        );
        await waitFor(() => {
            expect(
                screen.getByText('At least 7 characters'),
            ).toBeInTheDocument();
        });
    });
});
