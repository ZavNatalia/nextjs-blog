'use client';
import React from 'react';
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
import { getDictionary } from '@/get-dictionary';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);

export default function PostContent({
    post,
    dictionary,
}: {
    post: IPost;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['posts-page'];
}) {
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
        img({ src, alt }: { src?: string | Blob; alt?: string }) {
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
            const ariaLabel = React.Children.toArray(children)
                .filter((child) => typeof child === 'string')
                .join(' ')
                .trim();
            return (
                <a
                    aria-label={ariaLabel || undefined}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
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
            const copyButtonStyles = `absolute button button-ghost button-xs right-3 top-3 `;
            return (
                <div className="relative text-sm md:text-lg">
                    <button
                        aria-label={dictionary.copyCode}
                        className={copyButtonStyles}
                        onClick={() => copyCodeToClipboard(children as string)}
                    >
                        {isCopied ? (
                            <ClipboardDocumentCheckIcon className="h-6 w-6 cursor-default text-success-500" />
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
        table(props) {
            return (
                <table
                    className="w-full border-collapse border border-border-500"
                    {...props}
                />
            );
        },
        thead(props) {
            return <thead className="bg-background-tertiary/40" {...props} />;
        },
        th(props) {
            return (
                <th
                    className="border border-border-500 px-4 py-2 text-left font-semibold"
                    {...props}
                />
            );
        },
        td(props) {
            return (
                <td
                    className="bg-primary border border-border-500 px-4 py-2"
                    {...props}
                />
            );
        },
    };

    return (
        <article className="mx-auto w-full rounded-3xl p-3 md:p-4 lg:max-w-5xl lg:p-10">
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
