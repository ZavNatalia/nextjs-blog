import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: vi.fn() }),
}));

const mockFetch = vi.fn();

beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

import type { Dictionary } from '@/get-dictionary';

import CommentItem from './comment-item';

const mockDictionary = {
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this comment?',
    confirmDeleteTitle: 'Delete comment',
    confirmDeleteAction: 'Yes, delete',
    commentUpdated: 'Comment updated!',
    commentDeleted: 'Comment deleted.',
    success: 'Success!',
    error: 'Error!',
    somethingWentWrong: 'Something went wrong!',
    commentPlaceholder: 'Share your thoughts...',
    charactersRemaining: 'characters remaining',
    edited: '(edited)',
    closeNotification: 'Close notification',
    closeDialog: 'Close',
    writeComment: 'Write a comment',
} as Dictionary['comments'];

const baseComment = {
    _id: '507f1f77bcf86cd799439011',
    postSlug: 'test',
    authorEmail: 'author@test.com',
    authorName: 'John',
    content: 'Great post!',
    status: 'approved' as const,
    createdAt: new Date('2026-01-15').toISOString(),
};

describe('CommentItem', () => {
    it('renders comment content and author name', () => {
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail={null}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('Great post!')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('does not show edit/delete buttons for non-author', () => {
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="other@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(
            screen.queryByRole('button', { name: 'Edit' }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Delete' }),
        ).not.toBeInTheDocument();
    });

    it('shows edit/delete buttons for the author', () => {
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(
            screen.getByRole('button', { name: 'Edit' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Delete' }),
        ).toBeInTheDocument();
    });

    it('enters edit mode when Edit is clicked', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        expect(screen.getByDisplayValue('Great post!')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Save' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Cancel' }),
        ).toBeInTheDocument();
    });

    it('opens confirmation modal when Delete is clicked', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByText('Delete comment')).toBeInTheDocument();
        expect(
            screen.getByText('Are you sure you want to delete this comment?'),
        ).toBeInTheDocument();
        expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    });

    it('calls DELETE API when confirmed in modal', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Deleted' }),
        });

        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await user.click(screen.getByText('Yes, delete'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `/api/comments/${baseComment._id}`,
                expect.objectContaining({ method: 'DELETE' }),
            );
        });
    });

    it('closes modal without deleting when Cancel is clicked', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByText('Delete comment')).toBeInTheDocument();

        await user.click(screen.getByText('Cancel'));
        expect(screen.queryByText('Delete comment')).not.toBeInTheDocument();
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('shows localized edited label from dictionary when comment has updatedAt', () => {
        render(
            <CommentItem
                comment={{
                    ...baseComment,
                    updatedAt: new Date('2026-01-16').toISOString(),
                }}
                currentUserEmail={null}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('(edited)')).toBeInTheDocument();
    });

    it('exits edit mode when Cancel is clicked', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        expect(screen.getByDisplayValue('Great post!')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.getByText('Great post!')).toBeInTheDocument();
        expect(
            screen.queryByDisplayValue('Great post!'),
        ).not.toBeInTheDocument();
    });

    it('renders <time> with datetime attribute', () => {
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail={null}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const timeEl = screen.getByText((_, el) => {
            return el?.tagName === 'TIME' && el.getAttribute('dateTime') === baseComment.createdAt;
        });
        expect(timeEl).toBeInTheDocument();
    });

    it('renders edited <time> with datetime and title tooltip', () => {
        const updatedAt = new Date('2026-01-16T14:30:00Z').toISOString();
        render(
            <CommentItem
                comment={{ ...baseComment, updatedAt }}
                currentUserEmail={null}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const editedTime = screen.getByText('(edited)');
        expect(editedTime.tagName).toBe('TIME');
        expect(editedTime).toHaveAttribute('dateTime', updatedAt);
        expect(editedTime).toHaveAttribute('title');
    });

    it('closes modal on Escape key', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('focuses Cancel button when modal opens', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await waitFor(() => {
            const cancelBtn = screen.getByText('Cancel');
            expect(cancelBtn).toHaveFocus();
        });
    });

    it('renders modal with role="dialog" and aria-modal', async () => {
        const user = userEvent.setup();
        render(
            <CommentItem
                comment={baseComment}
                currentUserEmail="author@test.com"
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Delete' }));
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute(
            'aria-labelledby',
            `delete-dialog-title-${baseComment._id}`,
        );
    });
});
