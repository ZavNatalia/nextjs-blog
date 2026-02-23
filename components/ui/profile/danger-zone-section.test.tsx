import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
}));

import { DangerZoneSection } from './danger-zone-section';

const mockDictionary = {
    dangerZone: 'Danger Zone',
    deletingIsIrreversible: 'Deleting your account is irreversible.',
    deleteAccount: 'Delete Account',
    deletingAccount: 'Deleting...',
    confirmAccountDeletion: 'Confirm Deletion',
    areYouSureYouWantToDelete: 'Are you sure you want to delete',
    thisActionCannotBeUndone: 'This action cannot be undone.',
    cancel: 'Cancel',
    confirmDelete: 'Yes, delete',
    success: 'Success',
    error: 'Error',
    accountDeletedSuccessfully: 'Account deleted.',
    failedDeleteAccount: 'Failed to delete.',
    somethingWentWrong: 'Something went wrong.',
};

beforeEach(() => {
    vi.clearAllMocks();
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'notifications');
    document.body.appendChild(portalRoot);
});

afterEach(() => {
    const portalRoot = document.getElementById('notifications');
    if (portalRoot) document.body.removeChild(portalRoot);
});

describe('DangerZoneSection', () => {
    it('renders danger zone heading and warning', () => {
        render(
            <DangerZoneSection userEmail="user@test.com" dictionary={mockDictionary} />,
        );
        expect(screen.getByText('Danger Zone')).toBeInTheDocument();
        expect(screen.getByText('Deleting your account is irreversible.')).toBeInTheDocument();
    });

    it('opens confirmation dialog on delete click', async () => {
        render(
            <DangerZoneSection userEmail="user@test.com" dictionary={mockDictionary} />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    });

    it('closes confirmation dialog on cancel', async () => {
        render(
            <DangerZoneSection userEmail="user@test.com" dictionary={mockDictionary} />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        await userEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });
});
