import { useEffect, useState } from 'react';
import { MapPin, Phone, Search } from 'lucide-react';
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
        <section className="panel page-panel caustic-view-panel">
            <div className="panel-title caustic-anim-reveal-1">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">SALÕES PARCEIROS</span>
                    </div>
                    <h2>Descubra um salão</h2>
                </div>
            </div>

            <div className="client-form caustic-anim-reveal-2" style={{ marginBottom: 20 }}>
                <label>
                    <span className="form-label mono">
                        <Search size={12} /> BUSCAR
                    </span>
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Nome do salão..."
                    />
                </label>
            </div>

            {loading ? (
                <CausticLoader label="CARREGANDO SALÕES" variant="panel" />
            ) : error ? (
                <Empty text={error} />
            ) : filtered.length ? (
                <div className="professional-grid caustic-anim-reveal-3">
                    {filtered.map((salon) => (
                        <button
                            type="button"
                            className="professional-card salon-card"
                            key={salon.id}
                            onClick={() => onOpen(salon.slug)}
                        >
                            <div className="professional-card-top">
                                <div className="avatar professional-avatar">{initial(salon.name)}</div>
                                <div className="professional-identity">
                                    <b className="professional-name">{salon.name}</b>
                                </div>
                            </div>
                            {salon.address && (
                                <p className="professional-bio">
                                    <MapPin size={12} className="meta-icon" /> {salon.address}
                                </p>
                            )}
                            {salon.phone && (
                                <span className="client-contact mono">
                                    <Phone size={12} className="meta-icon" /> {salon.phone}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            ) : (
                <Empty text="Nenhum salão encontrado." />
            )}
        </section>
    );
}
