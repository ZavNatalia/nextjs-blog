'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import Notification, {
    NotificationDetails,
    NotificationStatus,
} from '@/components/ui/Notification';
import { getDictionary } from '@/get-dictionary';

type CommentsDictionary = Awaited<ReturnType<typeof getDictionary>>['comments'];

const MAX_LENGTH = 1000;

export default function CommentForm({
    postSlug,
    dictionary,
}: {
    postSlug: string;
    dictionary: CommentsDictionary;
}) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [requestStatus, setRequestStatus] =
        useState<NotificationStatus | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (requestStatus === 'success' || requestStatus === 'error') {
            const timer = setTimeout(() => {
                setRequestStatus(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [requestStatus]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestStatus('pending');

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                body: JSON.stringify({ postSlug, content }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setRequestStatus('error');
                setStatusMessage(data?.error || dictionary.somethingWentWrong);
                return;
            }

            setContent('');
            setRequestStatus('success');
            setStatusMessage(
                data?.comment?.status === 'pending'
                    ? dictionary.awaitingModeration
                    : dictionary.commentPosted,
            );
            router.refresh();
        } catch {
            setRequestStatus('error');
            setStatusMessage(dictionary.somethingWentWrong);
        }
    };

    const notificationData: NotificationDetails | null =
        requestStatus === 'success'
            ? {
                  status: 'success',
                  title: dictionary.success,
                  message: statusMessage,
              }
            : requestStatus === 'error'
              ? {
                    status: 'error',
                    title: dictionary.error,
                    message: statusMessage,
                }
              : null;

    return (
        <div className="rounded-xl bg-background-secondary p-4 shadow-sm md:p-5">
            <h3 className="mb-4 text-lg font-semibold">
                {dictionary.writeComment}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="comment-content" className="sr-only">
                        {dictionary.writeComment}
                    </label>
                    <textarea
                        id="comment-content"
                        className="input"
                        placeholder={dictionary.commentPlaceholder}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        maxLength={MAX_LENGTH}
                        rows={4}
                    />
                    <div className="mt-1 flex items-center justify-between">
                        <p className="text-sm text-secondary">
                            {MAX_LENGTH - content.length}{' '}
                            {dictionary.charactersRemaining}
                        </p>
                        <button
                            type="submit"
                            disabled={
                                requestStatus === 'pending' ||
                                content.trim().length === 0
                            }
                            className="button button-solid button-md"
                            aria-label={dictionary.submit}
                        >
                            {requestStatus === 'pending'
                                ? dictionary.submitting
                                : dictionary.submit}
                        </button>
                    </div>
                </div>
            </form>
            {notificationData ? <Notification {...notificationData} /> : null}
        </div>
    );
}
