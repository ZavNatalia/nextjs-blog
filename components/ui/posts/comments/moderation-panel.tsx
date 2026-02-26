'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getDictionary } from '@/get-dictionary';

type ModerationDictionary = Awaited<
    ReturnType<typeof getDictionary>
>['moderation'];

type FilterStatus = 'all' | 'pending' | 'approved';

interface SerializedComment {
    _id: string;
    postSlug: string;
    authorEmail: string;
    authorName: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
}

const STATUS_STYLES: Record<string, string> = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function ModerationPanel({
    comments,
    dictionary,
    lang,
}: {
    comments: SerializedComment[];
    dictionary: ModerationDictionary;
    lang: string;
}) {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [error, setError] = useState('');

    const filteredComments =
        filter === 'all'
            ? comments
            : comments.filter((c) => c.status === filter);

    const counts = {
        all: comments.length,
        pending: comments.filter((c) => c.status === 'pending').length,
        approved: comments.filter((c) => c.status === 'approved').length,
    };

    const tabs: { key: FilterStatus; label: string }[] = [
        { key: 'all', label: dictionary.all },
        { key: 'pending', label: dictionary.pending },
        { key: 'approved', label: dictionary.approved },
    ];

    const handleModerate = async (id: string, status: string) => {
        setLoadingId(id);
        setError('');
        try {
            const response = await fetch(`/api/comments/${id}/moderate`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setError(data?.error || dictionary.actionError);
                return;
            }

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
            const response = await fetch(`/api/comments/${deleteTarget}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setError(data?.error || dictionary.actionError);
                return;
            }

            setDeleteTarget(null);
            router.refresh();
        } catch {
            setError(dictionary.actionError);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">{dictionary.title}</h1>

            {error && <p className="mb-4 text-sm text-error-500">{error}</p>}

            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`button button-xs ${
                            filter === tab.key ? 'button-solid' : 'button-ghost'
                        }`}
                    >
                        {tab.label} ({counts[tab.key]})
                    </button>
                ))}
            </div>

            {filteredComments.length === 0 ? (
                <p className="text-secondary">{dictionary.noComments}</p>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => {
                        const formattedDate = new Date(
                            comment.createdAt,
                        ).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        });

                        return (
                            <div
                                key={comment._id}
                                className="rounded-xl bg-background-secondary p-4 shadow-sm"
                            >
                                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold">
                                            {comment.authorName}
                                        </p>
                                        <p className="text-sm text-secondary">
                                            {comment.authorEmail}
                                        </p>
                                        <p className="text-sm text-secondary">
                                            <Link
                                                href={`/${lang}/posts/${comment.postSlug}`}
                                                className="text-accent underline"
                                            >
                                                {comment.postSlug}
                                            </Link>
                                            {' · '}
                                            <time>{formattedDate}</time>
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[comment.status] || ''}`}
                                    >
                                        {comment.status}
                                    </span>
                                </div>

                                <p className="mb-3 whitespace-pre-wrap text-foreground">
                                    {comment.content}
                                </p>

                                <div className="flex gap-2">
                                    {comment.status !== 'approved' && (
                                        <button
                                            onClick={() =>
                                                handleModerate(
                                                    comment._id,
                                                    'approved',
                                                )
                                            }
                                            disabled={loadingId === comment._id}
                                            className={`button button-xs ${loadingId === comment._id ? 'button-disabled' : 'button-solid'}`}
                                        >
                                            {dictionary.approve}
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            setDeleteTarget(comment._id)
                                        }
                                        disabled={loadingId === comment._id}
                                        className={`button button-xs ${loadingId === comment._id ? 'button-disabled' : 'button-ghost'} text-error-500`}
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
                        className="max-w-sm rounded-3xl bg-background-secondary p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-error">
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
        </div>
    );
}
