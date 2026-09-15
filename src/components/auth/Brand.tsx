import { Scissors } from 'lucide-react';

export function Brand() {
    return (
        <section className="login-brand">
            <div className="brand-mark">
                <Scissors size={28} />
            </div>
            <p className="eyebrow font-bold">GESTÃO INTELIGENTE</p>
            <h1>Seu salão no ritmo <em>certo.</em></h1>
            <p>Organize cada detalhe, encante em cada atendimento.</p>
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />
        </section>
    );
}
