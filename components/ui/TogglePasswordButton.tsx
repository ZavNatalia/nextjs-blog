'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useDictionary } from '@/hooks/useDictionary';

interface TogglePasswordButtonProps {
    visible?: boolean;
    onToggle: () => void;
    isPasswordVisible: boolean;
    className?: string;
}

export default function TogglePasswordButton({
    visible = true,
    onToggle,
    isPasswordVisible,
    className = '',
}: TogglePasswordButtonProps) {
    const dictionary = useDictionary()?.['common'];
    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`button icon-button absolute right-3 p-0 ${className}`}
            aria-label={
                isPasswordVisible
                    ? dictionary.hidePassword
                    : dictionary.showPassword
            }
            title={
                isPasswordVisible
                    ? dictionary.hidePassword
                    : dictionary.showPassword
            }
        >
            {isPasswordVisible ? (
                <EyeSlashIcon className="h-5 w-5" />
            ) : (
                <EyeIcon className="h-5 w-5" />
            )}
        </button>
    );
}
