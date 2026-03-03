import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-auth/react', () => ({
    signOut: vi.fn(),
}));

import { getDictionary } from '@/get-dictionary';

import { DangerZoneSection } from './danger-zone-section';

type DangerZoneDictionary = Awaited<
    ReturnType<typeof getDictionary>
>['profile-page']['dangerZoneSection'];

const mockDictionary: DangerZoneDictionary = {
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
    noEmailProvided: 'No email provided',
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
            <DangerZoneSection
                userEmail="user@test.com"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('Danger Zone')).toBeInTheDocument();
        expect(
            screen.getByText('Deleting your account is irreversible.'),
        ).toBeInTheDocument();
    });

    it('opens confirmation dialog on delete click', async () => {
        render(
            <DangerZoneSection
                userEmail="user@test.com"
                dictionary={mockDictionary}
            />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    });

    it('closes confirmation dialog on cancel', async () => {
        render(
            <DangerZoneSection
                userEmail="user@test.com"
                dictionary={mockDictionary}
            />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        await userEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });

    it('has role="dialog" and aria-modal="true" when open', async () => {
        render(
            <DangerZoneSection
                userEmail="user@test.com"
                dictionary={mockDictionary}
            />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute(
            'aria-labelledby',
            'delete-account-dialog-title',
        );
    });

    it('closes dialog on Escape key', async () => {
        render(
            <DangerZoneSection
                userEmail="user@test.com"
                dictionary={mockDictionary}
            />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('focuses Cancel button when dialog opens', async () => {
        render(
            <DangerZoneSection
                userEmail="user@test.com"
                dictionary={mockDictionary}
            />,
        );
        await userEvent.click(screen.getByText('Delete Account'));
        expect(screen.getByText('Cancel')).toHaveFocus();
    });
});
