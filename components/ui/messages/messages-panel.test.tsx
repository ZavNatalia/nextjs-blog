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

import MessagesPanel from './messages-panel';

const mockDictionary = {
    title: 'Messages',
    noMessages: 'No messages to show',
    all: 'All',
    unread: 'Unread',
    read: 'Read',
    markAsRead: 'Mark as read',
    reply: 'Reply',
    delete: 'Delete',
    from: 'From',
    date: 'Date',
    confirmDeleteTitle: 'Delete message',
    confirmDelete: 'Are you sure you want to delete this message?',
    confirmDeleteAction: 'Yes, delete',
    cancel: 'Cancel',
    actionSuccess: 'Action completed successfully',
    actionError: 'Something went wrong',
    searchByEmail: 'Search by email...',
    deleteAllByEmail: 'Delete all',
    confirmDeleteByEmailTitle: 'Delete all messages',
    confirmDeleteByEmail:
        'Are you sure you want to delete all messages from',
    deletingMessages: 'Deleting...',
    invalidEmailError: 'Enter a valid email to delete all messages',
} as Dictionary['messages'];

const mockMessages = [
    {
        _id: '1',
        email: 'user@test.com',
        name: 'Test User',
        message: 'Hello there',
        status: 'unread',
        createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
        _id: '2',
        email: 'user2@test.com',
        name: 'User Two',
        message: 'Read message',
        status: 'read',
        createdAt: '2025-01-02T00:00:00.000Z',
    },
    {
        _id: '3',
        email: 'user3@test.com',
        name: 'User Three',
        message: 'Another unread',
        status: 'unread',
        createdAt: '2025-01-03T00:00:00.000Z',
    },
];

describe('MessagesPanel', () => {
    it('renders title and all messages by default', () => {
        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('Messages')).toBeInTheDocument();
        expect(screen.getByText('Hello there')).toBeInTheDocument();
        expect(screen.getByText('Read message')).toBeInTheDocument();
        expect(screen.getByText('Another unread')).toBeInTheDocument();
    });

    it('shows counts on filter tabs', () => {
        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('All (3)')).toBeInTheDocument();
        expect(screen.getByText('Unread (2)')).toBeInTheDocument();
        expect(screen.getByText('Read (1)')).toBeInTheDocument();
    });

    it('filters messages by status when tab is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        await user.click(screen.getByText('Unread (2)'));
        expect(screen.getByText('Hello there')).toBeInTheDocument();
        expect(screen.getByText('Another unread')).toBeInTheDocument();
        expect(screen.queryByText('Read message')).not.toBeInTheDocument();
    });

    it('shows empty state when no messages', () => {
        render(
            <MessagesPanel
                messages={[]}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('No messages to show')).toBeInTheDocument();
    });

    it('filters messages by email search input', async () => {
        const user = userEvent.setup();
        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const searchInput = screen.getByPlaceholderText('Search by email...');
        await user.type(searchInput, 'user2');

        expect(screen.getByText('Read message')).toBeInTheDocument();
        expect(screen.queryByText('Hello there')).not.toBeInTheDocument();
        expect(screen.queryByText('Another unread')).not.toBeInTheDocument();
    });

    it('calls PATCH API when Mark as read is clicked', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Updated' }),
        });

        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const markButtons = screen.getAllByRole('button', {
            name: 'Mark as read',
        });
        await user.click(markButtons[0]);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/messages/1',
                expect.objectContaining({ method: 'PATCH' }),
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
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const deleteButtons = screen.getAllByRole('button', {
            name: 'Delete',
        });
        await user.click(deleteButtons[0]);

        expect(screen.getByText('Delete message')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Are you sure you want to delete this message?',
            ),
        ).toBeInTheDocument();

        await user.click(screen.getByText('Yes, delete'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/messages/1',
                expect.objectContaining({ method: 'DELETE' }),
            );
        });
    });

    it('renders correct mailto link for reply', () => {
        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const replyLinks = screen.getAllByRole('link', { name: 'Reply' });
        expect(replyLinks[0]).toHaveAttribute(
            'href',
            'mailto:user@test.com?subject=Re: Message from Test User',
        );
    });

    it('shows Mark as read button only for unread messages', () => {
        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const markButtons = screen.getAllByRole('button', {
            name: 'Mark as read',
        });
        // Only 2 unread messages should have Mark as read button
        expect(markButtons).toHaveLength(2);
    });

    it('opens bulk delete modal and calls by-email API on confirm', async () => {
        const user = userEvent.setup();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ deletedCount: 1 }),
        });

        render(
            <MessagesPanel
                messages={mockMessages}
                dictionary={mockDictionary}
                lang="en"
            />,
        );

        const searchInput = screen.getByPlaceholderText('Search by email...');
        await user.type(searchInput, 'user@test.com');
        await user.click(screen.getByText('Delete all (1)'));

        expect(screen.getByText('Delete all messages')).toBeInTheDocument();
        expect(
            screen.getByText(
                /Are you sure you want to delete all messages from/,
            ),
        ).toBeInTheDocument();

        await user.click(screen.getByText('Yes, delete'));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/messages/by-email',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'user@test.com' }),
                }),
            );
        });
    });
});
