import { ScissorsIcon } from './ScissorsIcon';

const iconSize = { sm: 21, md: 24, lg: 28 } as const;

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
                <ScissorsIcon size={iconSize[size]} strokeWidth={size === 'lg' ? 1.6 : 1.8} />
            </span>
            {showName && <span className="app-logo-name">Tesoura</span>}
        </span>
    );
}
