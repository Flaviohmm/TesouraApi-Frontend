import { useState } from 'react';
import { ArrowUpRight, Clock3, RotateCcw, Sparkles } from 'lucide-react';
import { ScissorsIcon } from './ScissorsIcon';

export function MotionGallery() {
    const [replayKey, setReplayKey] = useState(0);
    const [liquidHot, setLiquidHot] = useState(false);
    const [liquidPress, setLiquidPress] = useState(false);

    return (
        <section className="motion-gallery panel" key={replayKey}>
            <div className="panel-title">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">CAUSTIC OPTICS DESIGN SYSTEM</span>
                    </div>
                    <h2>Workbench & Interações de Precisão</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={() => setReplayKey((k) => k + 1)}
                        title="Reiniciar transições"
                        style={{ padding: '8px 18px', fontSize: '12px' }}
                    >
                        <RotateCcw size={13} /> Reiniciar
                    </button>
                    <Sparkles size={18} style={{ color: 'var(--amb)' }} />
                </div>
            </div>

            <div className="motion-gallery-grid">
                {/* Specimen 01 */}
                <article className="motion-demo caustic-surface">
                    <span className="motion-label mono">01 · REFRACTION</span>
                    <h3>Atmosfera Cáustica</h3>
                    <p>95% grafite profundo e titânio. O âmbar funciona como pontuação cirúrgica, nunca excesso.</p>
                    <div className="caustic-ambient-specimen">
                        <div className="caustic-beam caustic-beam-amber" />
                        <div className="caustic-beam caustic-beam-cool" />
                        <span className="mono beam-label">SPECTRAL RADIANCE</span>
                    </div>
                </article>

                {/* Specimen 02 */}
                <article className="motion-demo caustic-surface">
                    <span className="motion-label mono">02 · HAIRLINE ROWS</span>
                    <h3>Indicador Vetorial (Ind)</h3>
                    <p>Ao interagir com uma linha, um indicador âmbar de 14px emerge suavemente da borda.</p>
                    <div className="mini-caustic-rows">
                        <div className="mini-caustic-row">
                            <span className="ind" />
                            <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                                <Clock3 size={12} /> 09:30
                            </span>
                            <b>Corte Navalhado</b>
                            <span className="status status-confirmed">Confirmado</span>
                        </div>
                        <div className="mini-caustic-row">
                            <span className="ind" />
                            <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                                <Clock3 size={12} /> 11:00
                            </span>
                            <b>Design de Barba</b>
                            <span className="status status-scheduled">Pendente</span>
                        </div>
                    </div>
                </article>

                {/* Specimen 03 */}
                <article className="motion-demo caustic-surface">
                    <span className="motion-label mono">03 · TACTILE PILLS</span>
                    <h3>Mecânica de Botões</h3>
                    <p>Botões pílula táteis com elevação suave, realce de borda e efeito dark metal.</p>
                    <div className="pill-actions-demo">
                        <button type="button" className="btn primary" style={{ padding: '9px 18px', fontSize: '12px' }}>
                            Primary Bone White
                        </button>
                        <button type="button" className="btn secondary" style={{ padding: '9px 18px', fontSize: '12px' }}>
                            Secondary Outline
                        </button>
                        <button
                            type="button"
                            className={`btn liquid-metal ${liquidHot ? 'hot' : ''} ${liquidPress ? 'press' : ''}`}
                            onMouseEnter={() => setLiquidHot(true)}
                            onMouseLeave={() => { setLiquidHot(false); setLiquidPress(false); }}
                            onMouseDown={() => setLiquidPress(true)}
                            onMouseUp={() => setLiquidPress(false)}
                            style={{ padding: '9px 18px', fontSize: '12px' }}
                        >
                            <ArrowUpRight size={13} /> Liquid Metal
                        </button>
                    </div>
                </article>

                {/* Specimen 04 */}
                <article className="motion-demo caustic-surface">
                    <span className="motion-label mono">04 · DATA TELEMETRY</span>
                    <h3>Tipografia & Tabular Nums</h3>
                    <p>Métricas com algarismos tabulares para legibilidade técnica e estabilidade visual.</p>
                    <div className="data-telemetry-demo">
                        <div className="telemetry-item">
                            <span className="mono telemetry-label">RECEITA / DIA</span>
                            <div className="data telemetry-val">R$ 1.480,00</div>
                        </div>
                        <div className="telemetry-bar">
                            <i style={{ width: '74%' }} />
                        </div>
                        <div className="telemetry-footer">
                            <span className="mono">TAXA EFETIVA</span>
                            <b className="mono">74.0%</b>
                        </div>
                    </div>
                </article>

                {/* Specimen 05 */}
                <article className="motion-demo caustic-surface">
                    <span className="motion-label mono">05 · OBSIDIAN PLATES</span>
                    <h3>Superfície de Vidro</h3>
                    <p>Painéis escuros em blur de alta densidade com hairline de 1px e specular interno.</p>
                    <div className="obsidian-plate-preview">
                        <div className="tag" style={{ margin: 0 }}>
                            <i />
                            <span className="mono">PLATE SPECULAR: INSET 0 1PX</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--ink)' }}>Painel de Precisão</span>
                            <span className="mono" style={{ color: 'var(--amb)', fontSize: '10px' }}>95% GRAPHITE</span>
                        </div>
                    </div>
                </article>

                {/* Specimen 06 */}
                <article className="motion-demo caustic-surface">
                    <span className="motion-label mono">06 · OPTIC CARDS</span>
                    <h3>Catálogo Óptico</h3>
                    <p>Elevação suave no hover com rotação e realce no glifo técnico de tesoura.</p>
                    <div className="mini-optic-card">
                        <div className="service-icon">
                            <ScissorsIcon size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>Corte Estilizado</h4>
                            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--amb)' }}>R$ 85,00 · 45 MIN</span>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}
