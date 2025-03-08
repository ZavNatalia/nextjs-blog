import React from 'react';

export const Loader = ({
    size = 40,
    primaryColor = '#ee7e32',
    secondaryColor = 'transparent',
}: {
    size?: number;
    primaryColor?: string;
    secondaryColor?: string;
}) => {
    return (
        <div className="flex items-center justify-center">
            <div
                style={{
                    width: size,
                    height: size,
                    borderWidth: size / 10,
                    borderColor: `${primaryColor} ${secondaryColor} ${primaryColor} ${secondaryColor}`,
                }}
                className="animate-spin rounded-full border-4"
            ></div>
        </div>
    );
};
