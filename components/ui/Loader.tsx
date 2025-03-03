import React from 'react';

interface LoaderProps {
    size?: number;
    color?: string;
}

export default function Loader({ size = 40, color = '#ee7e32' }: LoaderProps) {
    return (
        <div className="flex items-center justify-center">
            <div
                style={{
                    width: size,
                    height: size,
                    borderWidth: size / 10,
                    borderColor: `${color} transparent ${color} transparent`,
                }}
                className="animate-spin rounded-full border-4"
            ></div>
        </div>
    );
}
