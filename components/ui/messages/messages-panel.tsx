'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';

import { getDictionary } from '@/get-dictionary';

type MessagesDictionary = Awaited<
    ReturnType<typeof getDictionary>
>['messages'];

type FilterStatus = 'all' | 'unread' | 'read';

interface SerializedMessage {
    _id: string;
    email: string;
    name: string;
    message: string;
    status: string;
    createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
    unread: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    read: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export default function MessagesPanel({
    messages,
    dictionary,
    lang,
}: {
    messages: SerializedMessage[];
    dictionary: MessagesDictionary;
    lang: string;
}) {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [deleteByEmail, setDeleteByEmail] = useState<string | null>(null);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [searchEmailError, setSearchEmailError] = useState('');

    const statusFiltered =
        filter === 'all'
            ? messages
            : messages.filter((m) => m.status === filter);

    const filteredMessages = searchEmail
        ? statusFiltered.filter((m) =>
              m.email.toLowerCase().includes(searchEmail.toLowerCase()),
          )
        : statusFiltered;

    const counts = {
        all: messages.length,
        unread: messages.filter((m) => m.status === 'unread').length,
        read: messages.filter((m) => m.status === 'read').length,
    };

    const tabs: { key: FilterStatus; label: string }[] = [
        { key: 'all', label: dictionary.all },
        { key: 'unread', label: dictionary.unread },
        { key: 'read', label: dictionary.read },
    ];

    const handleMarkAsRead = async (id: string) => {
        setLoadingId(id);
        setError('');
        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setError(data?.error || dictionary.actionError);
                return;
            }

            mutate('/api/messages/unread-count');
            router.refresh();
        } catch {
            setError(dictionary.actionError);
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setLoadingId(deleteTarget);
        setError('');
        try {
            const response = await fetch(`/api/messages/${deleteTarget}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setError(data?.error || dictionary.actionError);
                return;
            }

            setDeleteTarget(null);
            mutate('/api/messages/unread-count');
            router.refresh();
        } catch {
            setError(dictionary.actionError);
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        if (!deleteTarget && !deleteByEmail) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDeleteTarget(null);
                setDeleteByEmail(null);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [deleteTarget, deleteByEmail]);

    const handleDeleteByEmail = async () => {
        if (!deleteByEmail) return;
        setBulkDeleting(true);
        setError('');
        try {
            const response = await fetch('/api/messages/by-email', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: deleteByEmail }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setError(data?.error || dictionary.actionError);
                return;
            }

            setDeleteByEmail(null);
            setSearchEmail('');
            mutate('/api/messages/unread-count');
            router.refresh();
        } catch {
            setError(dictionary.actionError);
        } finally {
            setBulkDeleting(false);
        }
    };

    return (
        <div className="w-full max-w-5xl">
            <h1 className="mb-6 text-2xl font-bold">{dictionary.title}</h1>

            {error && (
                <p role="alert" className="mb-4 text-sm text-error-500">
                    {error}
                </p>
            )}

            <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        value={searchEmail}
                        onChange={(e) => {
                            setSearchEmail(e.target.value);
                            setSearchEmailError('');
                        }}
                        placeholder={dictionary.searchByEmail}
                        aria-label={dictionary.searchByEmail}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {searchEmail && filteredMessages.length > 0 && (
                        <button
                            className="button button-sm button-danger"
                            onClick={() => {
                                const trimmed = searchEmail.trim();
                                if (
                                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
                                ) {
                                    setSearchEmailError(
                                        dictionary.invalidEmailError,
                                    );
                                    return;
                                }
                                setSearchEmailError('');
                                setDeleteByEmail(trimmed);
                            }}
                        >
                            {dictionary.deleteAllByEmail} (
                            {filteredMessages.length})
                        </button>
                    )}
                </div>
                {searchEmailError && (
                    <p role="alert" className="mt-1 text-sm text-error-500">
                        {searchEmailError}
                    </p>
                )}
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`button button-sm ${
                            filter === tab.key ? 'button-solid' : 'button-ghost'
                        }`}
                    >
                        {tab.label} ({counts[tab.key]})
                    </button>
                ))}
            </div>

            {filteredMessages.length === 0 ? (
                <p className="text-secondary">{dictionary.noMessages}</p>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((msg) => {
                        const formattedDate = new Date(
                            msg.createdAt,
                        ).toLocaleDateString(lang, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <div
                                key={msg._id}
                                className="rounded-xl bg-background-secondary p-4 shadow-sm"
                            >
                                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold">
                                            {msg.name}
                                        </p>
                                        <p className="text-base text-secondary">
                                            {msg.email}
                                        </p>
                                        <p className="text-base text-secondary">
                                            <time dateTime={msg.createdAt}>
                                                {formattedDate}
                                            </time>
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[msg.status] || ''}`}
                                    >
                                        {dictionary[msg.status as FilterStatus] ?? msg.status}
                                    </span>
                                </div>

                                <p className="mb-3 whitespace-pre-wrap text-foreground">
                                    {msg.message}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() =>
                                                handleMarkAsRead(msg._id)
                                            }
                                            disabled={loadingId === msg._id}
                                            className={`button button-sm ${loadingId === msg._id ? 'button-disabled' : 'button-solid'}`}
                                        >
                                            {dictionary.markAsRead}
                                        </button>
                                    )}
                                    <a
                                        href={`mailto:${msg.email}?subject=Re: Message from ${msg.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="button button-sm button-ghost"
                                    >
                                        {dictionary.reply}
                                    </a>
                                    <button
                                        onClick={() =>
                                            setDeleteTarget(msg._id)
                                        }
                                        disabled={loadingId === msg._id}
                                        className={`button button-sm ${loadingId === msg._id ? 'button-disabled' : 'button-ghost'} text-error-500`}
                                    >
                                        {dictionary.delete}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background-tertiary/80 p-4"
                    onClick={() => setDeleteTarget(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                        className="max-w-sm rounded-3xl bg-background-secondary p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="delete-dialog-title"
                            className="text-lg font-semibold text-error"
                        >
                            {dictionary.confirmDeleteTitle}
                        </h3>
                        <p className="mt-2 text-base text-foreground">
                            {dictionary.confirmDelete}
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="button button-ghost button-md"
                                onClick={() => setDeleteTarget(null)}
                            >
                                {dictionary.cancel}
                            </button>
                            <button
                                className={`button button-md ${loadingId === deleteTarget ? 'button-disabled' : 'button-danger'}`}
                                disabled={loadingId === deleteTarget}
                                onClick={handleDelete}
                            >
                                {dictionary.confirmDeleteAction}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteByEmail && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background-tertiary/80 p-4"
                    onClick={() => setDeleteByEmail(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="bulk-delete-dialog-title"
                        className="max-w-sm rounded-3xl bg-background-secondary p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="bulk-delete-dialog-title"
                            className="text-lg font-semibold text-error"
                        >
                            {dictionary.confirmDeleteByEmailTitle}
                        </h3>
                        <p className="mt-2 text-base text-foreground">
                            {dictionary.confirmDeleteByEmail}{' '}
                            <strong>{deleteByEmail}</strong>?
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="button button-ghost button-md"
                                onClick={() => setDeleteByEmail(null)}
                            >
                                {dictionary.cancel}
                            </button>
                            <button
                                className={`button button-md ${bulkDeleting ? 'button-disabled' : 'button-danger'}`}
                                disabled={bulkDeleting}
                                onClick={handleDeleteByEmail}
                            >
                                {bulkDeleting
                                    ? dictionary.deletingMessages
                                    : dictionary.confirmDeleteAction}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
