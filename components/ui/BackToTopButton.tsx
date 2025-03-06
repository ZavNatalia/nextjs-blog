'use client';

import React, { useState, useEffect } from 'react';
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
  fixed
  bottom-8
  right-8
  rounded-full
  shadow-md
  bg-primary-contrast/80
  text-foreground-muted
  hover:bg-accent
  hover:text-foreground-contrast
  dark:bg-dark-soft
  dark:text-muted-light
  dark:hover:bg-accent-dark
  dark:hover:text-foreground-onDark
`;

    return (
        <button onClick={scrollToTop} className={buttonStyles}>
            {dictionary.backToTop}
        </button>
    );
}
