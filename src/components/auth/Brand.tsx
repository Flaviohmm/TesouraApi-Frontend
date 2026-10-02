import { AppLogo } from '../ui/AppLogo';

export function Brand() {
    return (
        <section className="login-brand">
            {/* Ambient Animated Optical Caustic Orbs */}
            <div className="brand-caustic-bg" aria-hidden="true">
                <div className="caustic-orb caustic-orb-amber" />
                <div className="caustic-orb caustic-orb-cool" />
                <div className="caustic-orb caustic-orb-core" />
                <div className="caustic-lens-ring caustic-lens-ring-1" />
                <div className="caustic-lens-ring caustic-lens-ring-2" />
                <div className="caustic-focal-line" />
            </div>

            <div className="brand-content">
                <AppLogo showName={false} size="lg" className="brand-mark" />
                <div className="tag">
                    <i />
                    <span className="mono">OPTICAL MANAGEMENT SYSTEM</span>
                </div>
                <h1>
                    Seu salão no ritmo <em>exato.</em>
                </h1>
                <p className="brand-lead">
                    Calibre horários, clientes e serviços com a precisão de um instrumento óptico.
                    Fluidez máxima para o seu negócio de estética e beleza.
                </p>
            </div>

            <div className="brand-foot mono">
                <span>PRECISÃO · CONTROLE · LUXO</span>
                <span>TESOURA WORKBENCH</span>
            </div>
        </section>
    );
}
