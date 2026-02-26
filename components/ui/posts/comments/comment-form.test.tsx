import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: vi.fn() }),
}));

const mockFetch = vi.fn();

beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    const notificationsRoot = document.createElement('div');
    notificationsRoot.id = 'notifications';
    document.body.appendChild(notificationsRoot);
});

afterEach(() => {
    vi.unstubAllGlobals();
    document.getElementById('notifications')?.remove();
});

import type { Dictionary } from '@/get-dictionary';

import CommentForm from './comment-form';

const mockDictionary = {
    writeComment: 'Write a comment',
    commentPlaceholder: 'Share your thoughts...',
    submit: 'Post comment',
    submitting: 'Posting...',
    commentPosted: 'Comment posted!',
    awaitingModeration: 'Your comment is awaiting moderation.',
    success: 'Success!',
    error: 'Error!',
    somethingWentWrong: 'Something went wrong!',
    charactersRemaining: 'characters remaining',
} as Dictionary['comments'];

describe('CommentForm', () => {
    it('renders textarea and submit button', () => {
        render(<CommentForm postSlug="test" dictionary={mockDictionary} />);
        expect(
            screen.getByPlaceholderText('Share your thoughts...'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Post comment' }),
        ).toBeInTheDocument();
    });

    it('shows character count', async () => {
        const user = userEvent.setup();
        render(<CommentForm postSlug="test" dictionary={mockDictionary} />);
        const textarea = screen.getByPlaceholderText('Share your thoughts...');
        await user.type(textarea, 'Hello');
        expect(
            screen.getByText('995 characters remaining'),
        ).toBeInTheDocument();
    });

    it('disables submit button while submitting', async () => {
        const user = userEvent.setup();
        mockFetch.mockReturnValue(new Promise(() => {}));

        render(<CommentForm postSlug="test" dictionary={mockDictionary} />);

        await user.type(
            screen.getByPlaceholderText('Share your thoughts...'),
            'Great post!',
        );
        await user.click(screen.getByRole('button', { name: 'Post comment' }));

        expect(
            screen.getByRole('button', { name: 'Post comment' }),
        ).toBeDisabled();
        expect(screen.getByText('Posting...')).toBeInTheDocument();
    });

    it('submits form data to API', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                message: 'Success',
                comment: { status: 'approved' },
            }),
        });

        render(
            <CommentForm postSlug="test-post" dictionary={mockDictionary} />,
        );

        await user.type(
            screen.getByPlaceholderText('Share your thoughts...'),
            'Great post!',
        );
        await user.click(screen.getByRole('button', { name: 'Post comment' }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/comments',
                expect.objectContaining({ method: 'POST' }),
            );
            const body = JSON.parse(mockFetch.mock.calls[0][1].body);
            expect(body).toMatchObject({
                postSlug: 'test-post',
                content: 'Great post!',
            });
        });
    });

    it('clears textarea after successful submission', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                message: 'Success',
                comment: { status: 'approved' },
            }),
        });

        render(<CommentForm postSlug="test" dictionary={mockDictionary} />);

        const textarea = screen.getByPlaceholderText('Share your thoughts...');
        await user.type(textarea, 'Great post!');
        await user.click(screen.getByRole('button', { name: 'Post comment' }));

        await waitFor(() => {
            expect(textarea).toHaveValue('');
        });
    });

    it('shows success notification on submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                message: 'Success',
                comment: { status: 'approved' },
            }),
        });

        render(<CommentForm postSlug="test" dictionary={mockDictionary} />);

        await user.type(
            screen.getByPlaceholderText('Share your thoughts...'),
            'Great post!',
        );
        await user.click(screen.getByRole('button', { name: 'Post comment' }));

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(screen.getByText('Comment posted!')).toBeInTheDocument();
        });
    });

    it('shows error notification on failed submit', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Not authenticated!' }),
        });

        render(<CommentForm postSlug="test" dictionary={mockDictionary} />);

        await user.type(
            screen.getByPlaceholderText('Share your thoughts...'),
            'Great post!',
        );
        await user.click(screen.getByRole('button', { name: 'Post comment' }));

        await waitFor(() => {
            expect(screen.getByText('Error!')).toBeInTheDocument();
            expect(screen.getByText('Not authenticated!')).toBeInTheDocument();
        });
    });
});
