'use client';

import darcula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import ReactMarkdown, { Components } from 'react-markdown';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PostHeader from '@/components/ui/posts/post-detail/post-header';
import { IPost } from '@/components/ui/posts/post-card/post-card';
import Notification, {
    NotificationDetails,
    NotificationStatus,
} from '@/components/ui/notification';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);

const notificationMap: {
    [key in Exclude<NotificationStatus, 'pending' | null>]: NotificationDetails;
} = {
    success: {
        status: 'success',
        title: 'Success!',
        message: 'Code copied successfully.',
    },
    error: {
        status: 'error',
        title: 'Error!',
        message: 'The code was not copied. Please try again.',
    },
};

export const getNotificationData = (
    status: NotificationStatus,
): NotificationDetails | null => {
    if (status) {
        return notificationMap[
            status as Exclude<NotificationStatus, 'pending' | null>
        ];
    }
    return null;
};

export default function PostContent({ post }: { post: IPost }) {
    const { title, date, slug, image, content } = post;
    const [copyStatus, setCopyStatus] = useState<NotificationStatus | null>(
        null,
    );
    const imagePath = `/images/posts/${slug}/${image}`;

    useEffect(() => {
        if (copyStatus === 'success' || copyStatus === 'error') {
            const timer = setTimeout(() => {
                setCopyStatus(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copyStatus]);

    const notificationData =
        copyStatus !== null ? getNotificationData(copyStatus) : null;

    const copyCodeToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyStatus('success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyStatus('error');
        }
    };

    const customRenderers: Components = {
        img({ src, alt }: { src?: string; alt?: string }) {
            if (!src) return null;

            return (
                <Image
                    src={`/images/posts/${slug}/${src}`}
                    alt={alt || 'News Image'}
                    width={500}
                    height={500}
                    sizes="(max-width: 869px) 100vw, 500px"
                    className="mx-auto rounded-xl object-contain"
                />
            );
        },
        code({ className, children }) {
            const language = className
                ? className.replace('language-', '')
                : '';
            return (
                <div className="flex flex-col overflow-x-auto rounded-2xl bg-primary-dark/70 p-3 text-sm sm:p-4 md:text-lg lg:p-6">
                    <div className="flex items-center justify-between">
                        <span className="md:text-md text-xs lg:text-lg">
                            Terminal
                        </span>
                        <button
                            className={`${
                                copyStatus
                                    ? 'hover:text-primary'
                                    : 'hover:currentColor'
                            } icon-button`}
                            onClick={() =>
                                copyCodeToClipboard(children as string)
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                />
                            </svg>
                        </button>
                    </div>

                    <SyntaxHighlighter
                        style={darcula}
                        language={language}
                        PreTag="div"
                    >
                        {children as string}
                    </SyntaxHighlighter>
                </div>
            );
        },
    };

    return (
        <article className="mx-auto w-full rounded-3xl bg-primary-light/50 p-3 md:p-4 lg:max-w-5xl lg:p-10">
            <PostHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown
                components={{
                    img: customRenderers.img,
                    code: customRenderers.code,
                }}
                className="prose-sm lg:prose-lg dark:prose-invert"
            >
                {content}
            </ReactMarkdown>
            {notificationData && <Notification {...notificationData} />}
        </article>
    );
}
