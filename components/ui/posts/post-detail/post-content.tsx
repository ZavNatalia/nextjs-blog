import PostHeader from '@/components/ui/posts/post-detail/post-header';
import { IPost } from '@/components/ui/posts/post-card';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function PostContent({post}: { post: IPost }) {
    const {title, date, slug, image, content} = post;
    const imagePath = `/images/posts/${slug}/${image}`;

    const customRenderers = {
        // img(image) {
        //     return (
        //         <Image
        //             src={`/images/posts/${slug}/${image.src}`}
        //             alt={image.alt}
        //             width={300}
        //             height={300}
        //         />
        //     )
        // },
        p(paragraph) {
            const {node} = paragraph;
            const img = node.children[0];
            if (node.children[0].tagName === 'img') {
                return (
                    <div className='w-full max-w-[600px] mx-auto'>
                        <Image
                            className='rounded-3xl'
                            src={`/images/posts/${slug}/${img.properties.src}`}
                            alt={img.properties.alt}
                            width={500}
                            height={500}
                        />
                    </div>
                )
            }
            return (
                <p>{paragraph.children}</p>
            )
        },
        code(code) {
            const { className, children } = code;
            const language = className?.split('-')[1];
            return (
                <SyntaxHighlighter style={darcula} language={language}>
                    {children}
                </SyntaxHighlighter>
            )
        }
    };

    return (
        <article>
            <PostHeader title={title} date={date} imagePath={imagePath} slug={slug}/>
            <ReactMarkdown
                components={customRenderers}
                className="prose lg:prose-xl dark:prose-invert">
                {content as string}
            </ReactMarkdown>
        </article>
    )
}