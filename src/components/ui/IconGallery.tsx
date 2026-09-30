import { CalendarDays, Sparkles, Users } from 'lucide-react';
import { ScissorsIcon } from './ScissorsIcon';

export function IconGallery() {
    return <section className="icon-gallery panel glass-enter">
        <div className="panel-title">
            <div>
                <p className="eyebrow">ICON SYSTEM</p>
                <h2>Ícones da interface</h2>
            </div>
            <ScissorsIcon size={20} />
        </div>
        <div className="icon-gallery-grid">
            <div className="icon-demo">
                <span className="motion-label">16px</span>
                <CalendarDays size={16} />
                <span>compacto</span>
            </div>
            <div className="icon-demo">
                <span className="motion-label">24px</span>
                <Users size={24} />
                <span>padrão</span>
            </div>
            <div className="icon-demo icon-demo-accent">
                <span className="motion-label">32px · herda cor</span>
                <Sparkles size={32} />
                <span>accent</span>
            </div>
        </div>
    </section>
}
