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
import { DocumentDuplicateIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);

export default function PostContent({ post }: { post: IPost }) {
    const { title, date, slug, image, content } = post;
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const imagePath = `/images/posts/${slug}/${image}`;

    useEffect(() => {
        if (copiedCode) {
            const timer = setTimeout(() => {
                setCopiedCode(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [copiedCode]);

    const copyCodeToClipboard = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const customRenderers: Components = {
        img({ src, alt }: { src?: string; alt?: string }) {
            if (!src) return null;

            return (
                <Image
                    src={`/images/posts/${slug}/${src}`}
                    alt={alt || 'Post Image'}
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

            const isCopied = copiedCode === children;

            return (
                <div className="flex flex-col overflow-x-auto rounded-xl bg-primary-contrast dark:bg-dark/50 py-2 text-sm md:text-lg lg:py-3 lg:px-5">
                    <button
                        className="self-end text-foreground hover:text-accent-dark dark:text-foreground-onDarkMuted dark:hover:text-accent"
                        onClick={() => copyCodeToClipboard(children as string)}
                    >
                        {isCopied ? (
                            <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-600 dark:text-green-500 cursor-default"/>
                        ) : (
                            <DocumentDuplicateIcon className="w-6 h-6" />
                        )}
                    </button>
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
        <article className="mx-auto w-full rounded-3xl bg-primary-contrast/40 dark:bg-dark-soft/50 p-3 md:p-4 lg:max-w-5xl lg:p-10">
            <PostHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown
                components={{
                    img: customRenderers.img,
                    code: customRenderers.code,
                }}
                className="markdown-content prose-sm lg:prose-lg dark:prose-invert"
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
