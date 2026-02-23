'use client';

import React, { useEffect,useState } from 'react';

import { useDictionary } from '@/hooks/useDictionary';

interface BackToTopButtonProps {
    threshold?: number;
}

export default function BackToTopButton({
    threshold = 600,
}: BackToTopButtonProps) {
    const dictionary = useDictionary()?.['common'];
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > threshold) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!showButton) return null;

    const buttonStyles = `
  button
  button-md
  fixed
  bottom-8
  right-8
  rounded-full
  shadow-md
  bg-tertiary
  text-secondary
  hover:bg-accent
  hover:text-foreground-contrast
  dark:hover:text-foreground
`;

    return (
        <button
            title={dictionary.backToTop}
            className={buttonStyles}
            onClick={scrollToTop}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 18.75 7.5-7.5 7.5 7.5"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 7.5-7.5 7.5 7.5"
                />
            </svg>
        </button>
    );
}
