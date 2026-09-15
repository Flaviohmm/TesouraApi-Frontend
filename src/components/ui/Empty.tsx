import { Sparkles } from 'lucide-react';

export function Empty({ text }: { text: string }) {
    return (
        <div className="empty">
            <Sparkles size={21} />
            <p>{text}</p>
        </div>
    );
}
