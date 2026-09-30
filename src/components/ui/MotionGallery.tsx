import { useState } from 'react';
import { ArrowUpRight, Clock3, RotateCcw, Sparkles } from 'lucide-react';
import { ScissorsIcon } from './ScissorsIcon';

export function MotionGallery() {
    const [replayKey, setReplayKey] = useState(0);

    return (
        <section className="motion-gallery panel glass-enter" key={replayKey}>
            <div className="panel-title">
                <div>
                    <p className="eyebrow">MOTION GALLERY</p>
                    <h2>Movimentos do glass theme</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        type="button"
                        className="text-button"
                        onClick={() => setReplayKey((k) => k + 1)}
                        title="Reiniciar animações de entrada"
                        style={{ fontSize: '0.76rem', gap: '6px' }}
                    >
                        <RotateCcw size={14} /> Reiniciar animações
                    </button>
                    <Sparkles size={19} className="motion-gallery-icon" />
                </div>
            </div>
            <div className="motion-gallery-grid">
                <article className="motion-demo glass-surface glass-enter-demo">
                    <span className="motion-label">glass-enter</span>
                    <h3>Entrada suave</h3>
                    <p>Fade, blur e deslocamento vertical suave ao renderizar componentes.</p>
                    <div className="motion-preview-tag">650ms · cubic-bezier(.2, .8, .2, 1)</div>
                </article>

                <article className="motion-demo glass-surface glass-hover">
                    <span className="motion-label">glass-hover</span>
                    <h3>Elevação e brilho</h3>
                    <p>Passe o cursor para elevar o card e revelar o glow âmbar acetinado.</p>
                    <div className="motion-preview-tag">translateY(-6px) + glass-glow</div>
                </article>

                <article className="motion-demo glass-surface">
                    <span className="motion-label">glass-button</span>
                    <h3>Transição de ação</h3>
                    <p>Botões combinam lift tátil, sombra projetada e realce no clique.</p>
                    <button className="button primary glass-button" style={{ marginTop: 'auto' }}>
                        <ArrowUpRight size={16} /> Testar botão
                    </button>
                </article>

                <article className="motion-demo glass-surface">
                    <span className="motion-label">ambient-float (login-brand)</span>
                    <h3>Orbes atmosféricos</h3>
                    <p>Deriva orgânica contínua com oscilação de escala, opacidade e rotação.</p>
                    <div className="ambient-preview">
                        <div className="ambient-preview-orb" />
                    </div>
                </article>

                <article className="motion-demo glass-surface">
                    <span className="motion-label">motion-list (agenda & clientes)</span>
                    <h3>Cascata em lista & hover</h3>
                    <p>Entrada ritmada com atraso sequencial e destaque tátil em cada linha.</p>
                    <div className="mini-stagger-preview">
                        <div className="mini-stagger-row">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Clock3 size={12} /> 09:30
                            </span>
                            <b>Corte Clássico</b>
                        </div>
                        <div className="mini-stagger-row">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Clock3 size={12} /> 10:15
                            </span>
                            <b>Barba Terapia</b>
                        </div>
                    </div>
                </article>

                <article className="motion-demo glass-surface">
                    <span className="motion-label">card-lift (serviços)</span>
                    <h3>Card dinâmico & ícone</h3>
                    <p>Elevação de -6px no card acompanhada de rotação e cor no ícone.</p>
                    <div className="mini-card-preview">
                        <div className="service-icon" style={{ marginBottom: 0, width: '32px', height: '32px' }}>
                            <ScissorsIcon size={16} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>Corte Tesoura</h4>
                            <span style={{ fontSize: '0.72rem', color: '#9c7465' }}>R$ 75,00</span>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}
