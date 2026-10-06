import { useEffect, useState } from 'react';
import { ScissorsIcon } from './ScissorsIcon';

export function CausticLoader({
    label = 'CALIBRANDO WORKBENCH',
    variant = 'panel'
}: {
    label?: string;
    variant?: 'panel' | 'inline' | 'full';
}) {
    const [progress, setProgress] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return 98;
                const step = Math.floor(Math.random() * 18) + 8;
                return Math.min(prev + step, 98);
            });
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`caustic-loader caustic-loader-${variant}`} role="status" aria-live="polite">
            <div className="b-in">
                <div className="loader-icon-frame">
                    <ScissorsIcon size={18} pivotFill="var(--amb)" strokeWidth={1.8} />
                </div>
                <div className="loader-content">
                    <div className="loader-meta">
                        <span className="loader-label mono">
                            <i className="status-live-dot" />
                            {label}
                        </span>
                        <span className="b-num mono">{String(progress).padStart(3, '0')}%</span>
                    </div>
                    <span className="b-rail">
                        <i style={{ width: `${progress}%` }} />
                    </span>
                </div>
            </div>
        </div>
    );
}
