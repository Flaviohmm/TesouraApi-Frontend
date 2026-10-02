import { Sparkles } from 'lucide-react';

export function Empty({ text }: { text: string }) {
    return (
        <div className="empty">
            <div className="empty-mark">
                <Sparkles size={18} />
            </div>
            <p className="empty-text">{text}</p>
        </div>
    );
}
