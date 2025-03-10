import React from 'react';

export const Loader = ({
    size = 40,
    primaryColor = 'rgba(255,255,255,0.7)',
    secondaryColor = 'rgba(119,124,133,0.7)',
    borderWidth = size / 10,
    paddings
}: {
    size?: number;
    primaryColor?: string;
    secondaryColor?: string;
    borderWidth?: number;
    paddings?: string;
}) => {
    return (
        <div className={`flex items-center justify-center ${paddings}`}>
            <div
                style={{
                    width: size,
                    height: size,
                    borderWidth: borderWidth,
                    borderColor: `${primaryColor} ${secondaryColor} ${primaryColor} ${secondaryColor}`,
                }}
                className="animate-spin rounded-full"
            ></div>
        </div>
    );
};
