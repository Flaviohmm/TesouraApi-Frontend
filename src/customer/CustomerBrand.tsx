import { AppLogo } from '../components/ui/AppLogo';

export function CustomerBrand() {
    return (
        <section className="login-brand">
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
                    <span className="mono">ENCONTRE SEU SALÃO</span>
                </div>
                <h1>
                    Seu próximo horário, <em>a um clique.</em>
                </h1>
                <p className="brand-lead">
                    Descubra salões parceiros, escolha o profissional e agende na hora — sem
                    ligação, sem espera.
                </p>
            </div>

            <div className="brand-foot mono">
                <span>DESCOBRIR · AGENDAR · RELAXAR</span>
                <span>TESOURA DESCOBRIR</span>
            </div>
        </section>
    );
}
