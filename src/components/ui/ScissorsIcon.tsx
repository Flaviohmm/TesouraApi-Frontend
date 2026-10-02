import type { SVGProps } from 'react';

type ScissorsIconProps = SVGProps<SVGSVGElement> & {
    size?: number;
    strokeWidth?: number;
    pivotFill?: string;
};

export function ScissorsIcon({
    size = 24,
    strokeWidth = 1.75,
    className,
    pivotFill = 'var(--amb)',
    ...props
}: ScissorsIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <circle cx="7.1" cy="18.15" r="2.15" />
            <circle cx="16.9" cy="18.15" r="2.15" />
            <path d="M8.35 16.4 17.35 3.82" />
            <path d="M15.65 16.4 6.65 3.82" />
            <circle cx="12" cy="11.3" r="1.3" fill={pivotFill} stroke="none" />
        </svg>
    );
}
