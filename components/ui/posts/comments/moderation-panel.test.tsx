import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: vi.fn() }),
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

const mockFetch = vi.fn();

beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

import type { Dictionary } from '@/get-dictionary';

import ModerationPanel from './moderation-panel';

const mockDictionary = {
    title: 'Comment Moderation',
    noComments: 'No comments to show',
    all: 'All',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    approve: 'Approve',
    reject: 'Reject',
    delete: 'Delete',
    author: 'Author',
    post: 'Post',
    date: 'Date',
    status: 'Status',
    confirmDeleteTitle: 'Delete comment',
    confirmDelete: 'Are you sure you want to delete this comment?',
    confirmDeleteAction: 'Yes, delete',
    cancel: 'Cancel',
    actionSuccess: 'Action completed successfully',
    actionError: 'Something went wrong',
} as Dictionary['moderation'];

const mockComments = [
    {
        _id: '1',
        postSlug: 'test-post',
        authorEmail: 'user@test.com',
        authorName: 'Test User',
        content: 'Pending comment',
        status: 'pending',
        createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
        _id: '2',
        postSlug: 'test-post',
        authorEmail: 'user2@test.com',
        authorName: 'User Two',
        content: 'Approved comment',
        status: 'approved',
        createdAt: '2025-01-02T00:00:00.000Z',
    },
    {
        _id: '3',
        postSlug: 'another-post',
        authorEmail: 'user3@test.com',
        authorName: 'User Three',
        content: 'Rejected comment',
        status: 'rejected',
        createdAt: '2025-01-03T00:00:00.000Z',
    },
];

describe('ModerationPanel', () => {
    it('renders title and all comments by default', () => {
        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('Comment Moderation')).toBeInTheDocument();
        expect(screen.getByText('Pending comment')).toBeInTheDocument();
        expect(screen.getByText('Approved comment')).toBeInTheDocument();
        expect(screen.getByText('Rejected comment')).toBeInTheDocument();
    });

    it('shows counts on filter tabs', () => {
        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('All (3)')).toBeInTheDocument();
        expect(screen.getByText('Pending (1)')).toBeInTheDocument();
        expect(screen.getByText('Approved (1)')).toBeInTheDocument();
    });

    it('filters comments by status when tab is clicked', async () => {
        const user = userEvent.setup();
        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByText('Pending (1)'));
        expect(screen.getByText('Pending comment')).toBeInTheDocument();
        expect(screen.queryByText('Approved comment')).not.toBeInTheDocument();
        expect(screen.queryByText('Rejected comment')).not.toBeInTheDocument();
    });

    it('shows empty state when no comments match filter', () => {
        render(
            <ModerationPanel
                comments={[]}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('No comments to show')).toBeInTheDocument();
    });

    it('renders post link for each comment', () => {
        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const links = screen.getAllByRole('link');
        const hrefs = links.map((link) => link.getAttribute('href'));
        expect(hrefs).toContain('/en/posts/test-post');
        expect(hrefs).toContain('/en/posts/another-post');
    });

    it('shows approve button only for non-approved comments', () => {
        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const approveButtons = screen.getAllByRole('button', {
            name: 'Approve',
        });
        // pending and rejected comments should have Approve, but not the approved one
        expect(approveButtons).toHaveLength(2);
    });

    it('calls moderate API when Approve is clicked', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Updated' }),
        });

        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const approveButtons = screen.getAllByRole('button', {
            name: 'Approve',
        });
        await user.click(approveButtons[0]);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/comments/1/moderate',
                expect.objectContaining({
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'approved' }),
                }),
            );
        });
    });

    it('opens delete modal and calls DELETE API on confirm', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Deleted' }),
        });

        render(
            <ModerationPanel
                comments={mockComments}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const deleteButtons = screen.getAllByRole('button', {
            name: 'Delete',
        });
        await user.click(deleteButtons[0]);

        expect(screen.getByText('Delete comment')).toBeInTheDocument();
        expect(
            screen.getByText('Are you sure you want to delete this comment?'),
        ).toBeInTheDocument();

        await user.click(screen.getByText('Yes, delete'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/comments/1',
                expect.objectContaining({ method: 'DELETE' }),
            );
        });
    });
});
