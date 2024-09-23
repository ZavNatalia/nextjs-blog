'use client';

import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Updated import path
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import PostHeader from '@/components/ui/posts/post-detail/post-header';
import { IPost } from '@/components/ui/posts/post-card/post-card';
import Notification, {
    NotificationDetails,
} from '@/components/ui/notification';

export default function PostContent({ post }: { post: IPost }) {
    const { title, date, slug, image, content } = post;
    const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
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

    let notificationData: NotificationDetails;
    if (copyStatus === 'success') {
        notificationData = {
            status: 'success',
            title: 'Success!',
            message: 'Code copied successfully.',
        };
    }
    if (copyStatus === 'error') {
        notificationData = {
            status: 'error',
            title: 'Error!',
            message: 'The code was not copied. Please try again.',
        };
    }

    const copyCodeToClipboard = async (code: string) => {
        console.log('code', code);
        try {
            await navigator.clipboard.writeText(code);
            setCopyStatus('success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyStatus('error');
        }
    };

    const customRenderers = {
        p(paragraph) {
            const { node } = paragraph;
            if (node.children[0]?.tagName === 'img') {
                const img = node.children[0];
                return (
                    <div className="flex justify-center">
                        <Image
                            className="rounded-3xl object-contain"
                            src={`/images/posts/${slug}/${img.properties.src}`}
                            alt={img.properties.alt}
                            width={600}
                            height={600}
                            sizes="(max-width: 600px) 100vw, 600px"
                        />
                    </div>
                );
            }
            return <p>{paragraph.children}</p>;
        },
        code(code) {
            const { className, children } = code;
            const language = className?.split('-')[1];
            return (
                <div className="relative">
                    <SyntaxHighlighter
                        style={darcula}
                        language={language}
                        PreTag="div"
                    >
                        {children}
                    </SyntaxHighlighter>
                    <button
                        className={`${
                            copyStatus
                                ? 'hover:text-primary'
                                : 'hover:currentColor'
                        } icon-button absolute right-1 top-1 lg:right-3 lg:top-3`}
                        onClick={() => copyCodeToClipboard(children[0])} // Pass children[0] directly
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
            );
        },
    };

    return (
        <article>
            <PostHeader
                title={title}
                date={date}
                imagePath={imagePath}
                slug={slug}
            />
            <ReactMarkdown
                components={customRenderers}
                className="prose lg:prose-xl dark:prose-invert"
            >
                {content as string}
            </ReactMarkdown>
            {copyStatus && <Notification {...notificationData} />}
        </article>
    );
}
