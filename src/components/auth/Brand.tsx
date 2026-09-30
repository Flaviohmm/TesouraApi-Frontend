import { AppLogo } from '../ui/AppLogo';

export function Brand() {
    return (
        <section className="login-brand">
            <AppLogo showName={false} size="lg" />
            <p className="eyebrow font-bold">GESTÃO INTELIGENTE</p>
            <h1>Seu salão no ritmo <em>certo.</em></h1>
            <p>Organize cada detalhe, encante em cada atendimento.</p>
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />
        </section>
    );
}
