import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Phone, Search, Sparkles, Store } from 'lucide-react';
import { customerApi } from './customerApi';
import type { PublicSalon } from '../types/customer';
import { initial } from '../utils/format';
import { CausticLoader } from '../components/ui/CausticLoader';
import { Empty } from '../components/ui/Empty';

export function SalonDirectory({ onOpen }: { onOpen: (slug: string) => void }) {
    const [salons, setSalons] = useState<PublicSalon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        customerApi<PublicSalon[]>('/api/public/salons')
            .then(setSalons)
            .catch((reason: Error) => setError(reason.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = salons.filter((salon) => salon.name.toLowerCase().includes(query.trim().toLowerCase()));

    return (
        <div className="discover-content caustic-stagger-container">
            <section className="caustic-hero caustic-anim-reveal-1">
                <div className="caustic-hero-bg" aria-hidden="true">
                    <div className="hero-radial hero-radial-amber" />
                    <div className="hero-radial hero-radial-cool" />
                </div>
                <div className="caustic-hero-content">
                    <div className="tag">
                        <i />
                        <span className="mono">SALÕES PARCEIROS</span>
                    </div>
                    <h1>
                        Seu próximo horário, <em>a um clique.</em>
                    </h1>
                    <p className="caustic-hero-lead">
                        Explore <strong>{loading ? '...' : salons.length}</strong> salões parceiros, escolha o
                        profissional e agende na hora — sem ligação, sem espera.
                    </p>
                    <label className="discover-search">
                        <Search size={16} />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar salão por nome..."
                        />
                    </label>
                    <a className="brand-client-link auth-link mono" href="/">
                        <Store size={14} /> É dono de um salão? Entrar como empresa →
                    </a>
                </div>
                <div className="caustic-hero-spec mono">
                    <div>DESCOBRIR · AGENDAR</div>
                    <div>RELAXAR</div>
                </div>
            </section>

            {loading ? (
                <CausticLoader label="CARREGANDO SALÕES" variant="panel" />
            ) : error ? (
                <Empty text={error} />
            ) : filtered.length ? (
                <div className="salon-grid caustic-anim-reveal-2">
                    {filtered.map((salon) => (
                        <article className="salon-card-tile" key={salon.id}>
                            <div className="salon-card-top">
                                <div className="avatar professional-avatar salon-card-avatar">{initial(salon.name)}</div>
                                <div className="professional-identity">
                                    <b className="professional-name">{salon.name}</b>
                                    <span className="salon-card-badge mono">
                                        <Sparkles size={11} /> PARCEIRO
                                    </span>
                                </div>
                            </div>

                            <div className="salon-card-meta">
                                {salon.address && (
                                    <span className="client-contact mono">
                                        <MapPin size={12} className="meta-icon" /> {salon.address}
                                    </span>
                                )}
                                {salon.phone && (
                                    <span className="client-contact mono">
                                        <Phone size={12} className="meta-icon" /> {salon.phone}
                                    </span>
                                )}
                            </div>

                            <button type="button" className="btn primary wide salon-card-cta" onClick={() => onOpen(salon.slug)}>
                                Ver salão e agendar <ArrowRight size={15} />
                            </button>
                        </article>
                    ))}
                </div>
            ) : (
                <Empty text="Nenhum salão encontrado." />
            )}
        </div>
    );
}
