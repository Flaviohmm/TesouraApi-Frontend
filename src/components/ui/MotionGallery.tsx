import { ArrowUpRight, Sparkles } from 'lucide-react';

export function MotionGallery() {
    return <section className="motion-gallery panel glass-enter">
        <div className="panel-title">
            <div>
                <p className="eyebrow">MOTION GALLERY</p>
                <h2>Movimentos do glass theme</h2>
            </div>
            <Sparkles size={19} className="motion-gallery-icon" />
        </div>
        <div className="motion-gallery-grid">
            <article className="motion-demo glass-surface glass-enter-demo">
                <span className="motion-label">glass-enter</span>
                <h3>Entrada suave</h3>
                <p>Fade, blur e deslocamento vertical ao aparecer.</p>
            </article>
            <article className="motion-demo glass-surface glass-hover">
                <span className="motion-label">glass-hover</span>
                <h3>Elevação e brilho</h3>
                <p>Passe o cursor para elevar o card e revelar o glow.</p>
            </article>
            <article className="motion-demo glass-surface">
                <span className="motion-label">glass-button</span>
                <h3>Transição de ação</h3>
                <p>Botões combinam lift, sombra e mudança de fundo.</p>
                <button className="button primary glass-button"><ArrowUpRight size={16} /> Testar botão</button>
            </article>
        </div>
    </section>
}
