'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, KeyboardEvent, useRef, useState } from 'react';

import { getDictionary } from '@/get-dictionary';

type CommentsDictionary = Awaited<ReturnType<typeof getDictionary>>['comments'];

const MAX_LENGTH = 1000;

export default function CommentEditForm({
    commentId,
    initialContent,
    dictionary,
    onCancel,
}: {
    commentId: string;
    initialContent: string;
    dictionary: CommentsDictionary;
    onCancel: () => void;
}) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ content }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setError(data?.error || dictionary.somethingWentWrong);
                return;
            }

            onCancel();
            router.refresh();
        } catch {
            setError(dictionary.somethingWentWrong);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 pl-12"
        >
            {error && (
                <p className="text-sm text-error-500" role="alert">
                    {error}
                </p>
            )}
            <textarea
                className="input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        formRef.current?.requestSubmit();
                    }
                }}
                required
                maxLength={MAX_LENGTH}
                rows={3}
                aria-label={dictionary.writeComment}
            />
            <div className="flex items-center justify-between">
                <p className="text-sm text-secondary" aria-live="polite">
                    {MAX_LENGTH - content.length}{' '}
                    {dictionary.charactersRemaining}
                </p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="button button-ghost button-sm"
                        aria-label={dictionary.cancel}
                    >
                        {dictionary.cancel}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || content.trim().length === 0}
                        className="button button-solid button-sm"
                        aria-label={dictionary.save}
                    >
                        {dictionary.save}
                    </button>
                </div>
            </div>
        </form>
    );
}
