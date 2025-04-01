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
import {
    DocumentDuplicateIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import remarkGfm from 'remark-gfm';

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
        a({ href, children }) {
            const isExternal = href?.startsWith('http');

            return (
                <a
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-accent underline hover:opacity-80"
                >
                    {children}
                </a>
            );
        },
        code({ className, children }) {
            const language = className
                ? className.replace('language-', '')
                : '';

            const isCopied = copiedCode === children;

            return (
                <div className="relative text-sm md:text-lg">
                    <button
                        className="absolute right-2 top-2 text-foreground-contrast hover:text-accent dark:text-foreground-onDarkMuted dark:hover:text-accent-dark"
                        onClick={() => copyCodeToClipboard(children as string)}
                    >
                        {isCopied ? (
                            <ClipboardDocumentCheckIcon className="h-6 w-6 cursor-default text-green-500 dark:text-green-600" />
                        ) : (
                            <DocumentDuplicateIcon className="h-6 w-6" />
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
        table({ node, ...props }) {
            return (
                <table
                    className="w-full border-collapse border border-border dark:border-dark"
                    {...props}
                />
            );
        },
        thead({ node, ...props }) {
            return (
                <thead
                    className="bg-primary-light dark:bg-dark-soft"
                    {...props}
                />
            );
        },
        th({ node, ...props }) {
            return (
                <th
                    className="border border-border px-4 py-2 text-left font-semibold dark:border-dark"
                    {...props}
                />
            );
        },
        td({ node, ...props }) {
            return (
                <td
                    className="border border-border bg-primary px-4 py-2 dark:border-dark dark:bg-dark-soft/30"
                    {...props}
                />
            );
        },
    };

    return (
        <article className="mx-auto w-full rounded-3xl bg-primary-contrast/40 p-3 dark:bg-dark-soft/50 md:p-4 lg:max-w-5xl lg:p-10">
            <PostHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={customRenderers}
                className="markdown-content prose-sm dark:prose-invert lg:prose-lg"
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
