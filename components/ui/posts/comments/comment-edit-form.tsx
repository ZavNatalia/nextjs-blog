'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 pl-12">
            {error && <p className="text-sm text-error-500">{error}</p>}
            <textarea
                className="input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={MAX_LENGTH}
                rows={3}
            />
            <div className="flex items-center justify-between">
                <p className="text-sm text-secondary">
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
