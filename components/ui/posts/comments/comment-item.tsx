'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CommentEditForm from '@/components/ui/posts/comments/comment-edit-form';
import { getDictionary } from '@/get-dictionary';
import { CommentStatus } from '@/lib/types/mongodb';

type CommentsDictionary = Awaited<ReturnType<typeof getDictionary>>['comments'];

interface CommentData {
    _id: string;
    postSlug: string;
    authorEmail: string;
    authorName: string;
    content: string;
    status: CommentStatus;
    createdAt: string;
    updatedAt?: string;
}

export default function CommentItem({
    comment,
    currentUserEmail,
    dictionary,
}: {
    comment: CommentData;
    currentUserEmail: string | null;
    dictionary: CommentsDictionary;
}) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const isAuthor = currentUserEmail === comment.authorEmail;

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError('');
        try {
            const response = await fetch(`/api/comments/${comment._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setDeleteError(data?.error || dictionary.somethingWentWrong);
                return;
            }

            setIsConfirmOpen(false);
            router.refresh();
        } catch {
            setDeleteError(dictionary.somethingWentWrong);
        } finally {
            setIsDeleting(false);
        }
    };

    const formattedDate = new Date(comment.createdAt).toLocaleDateString(
        undefined,
        { year: 'numeric', month: 'short', day: 'numeric' },
    );

    const avatarLetter = comment.authorName.charAt(0).toUpperCase();

    return (
        <div className="rounded-xl bg-background-secondary p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-contrast dark:text-foreground">
                        {avatarLetter}
                    </div>
                    <div>
                        <span className="font-semibold">
                            {comment.authorName}
                        </span>
                        <div className="flex items-center gap-1">
                            <time className="text-sm text-secondary">
                                {formattedDate}
                            </time>
                            {comment.updatedAt && (
                                <span className="text-sm text-secondary italic">
                                    (edited)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {isAuthor && !isEditing && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="button button-ghost button-xs"
                            aria-label={dictionary.edit}
                        >
                            {dictionary.edit}
                        </button>
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            className="button button-ghost button-xs text-error-500"
                            aria-label={dictionary.delete}
                        >
                            {dictionary.delete}
                        </button>
                    </div>
                )}
            </div>
            {comment.status === 'pending' && (
                <p className="mb-2 ml-12 text-sm text-yellow-600 dark:text-yellow-400">
                    {dictionary.awaitingModeration}
                </p>
            )}
            {isEditing ? (
                <CommentEditForm
                    commentId={comment._id}
                    initialContent={comment.content}
                    dictionary={dictionary}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <p className="pl-12 whitespace-pre-wrap text-foreground">
                    {comment.content}
                </p>
            )}

            {isConfirmOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background-tertiary/80 p-4"
                    onClick={() => setIsConfirmOpen(false)}
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
                        {deleteError && (
                            <p className="mt-2 text-sm text-error-500">
                                {deleteError}
                            </p>
                        )}
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                className="button button-ghost button-md"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                {dictionary.cancel}
                            </button>
                            <button
                                className={`button button-md ${isDeleting ? 'button-disabled' : 'button-danger'}`}
                                disabled={isDeleting}
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
