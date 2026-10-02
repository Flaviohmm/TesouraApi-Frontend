import { ScissorsIcon } from './ScissorsIcon';

const iconSize = { sm: 18, md: 22, lg: 28 } as const;

export function AppLogo({
    showName = true,
    size = 'md',
    className = '',
}: {
    showName?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    return (
        <span
            className={`app-logo app-logo-${size} ${className}`.trim()}
            role={showName ? undefined : 'img'}
            aria-label={showName ? undefined : 'Tesoura'}
        >
            <span className="app-logo-mark">
                <ScissorsIcon size={iconSize[size]} strokeWidth={size === 'lg' ? 1.6 : 1.75} pivotFill="var(--amb)" />
            </span>
            {showName && (
                <span className="app-logo-content">
                    <b className="app-logo-name">TESOURA</b>
                    <span className="app-logo-subtitle">OPTICS WORKBENCH</span>
                </span>
            )}
        </span>
    );
}
