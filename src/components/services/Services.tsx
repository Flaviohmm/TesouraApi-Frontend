import { Clock3, Plus, Scissors } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { HairService, Professional } from '../../types/api';
import { money } from '../../utils/format';
import { Empty } from '../ui/Empty';

export function Services() {
    const { data, error } = useData<HairService>('/api/services');
    const { data: professionals } = useData<Professional>('/api/professionals');

    return (
        <section className="panel page-panel">
            <div className="panel-title">
                <div>
                    <p className="eyebrow">CARDÁPIO</p>
                    <h2>Serviços e valores</h2>
                </div>
                <button className="button primary">
                    <Plus size={18} />Novo serviço
                </button>
            </div>
            {error ?
                <Empty text={error} /> :
                <div className="service-grid">
                    {data.length ?
                        data.map((service) =>
                            <article className="service-card" key={service.id}>
                                <div className="service-icon">
                                    <Scissors size={20} />
                                </div>
                                <span>{service.category || 'Beleza'}</span>
                                <h3>{service.name}</h3>
                                <p><Clock3 size={14} /> {service.durationMinutes} min</p>
                                <b>{money.format(Number(service.price))}</b>
                            </article>
                        ) :
                        <Empty text="Nenhum serviço cadastrado." />
                    }
                </div>
            }
            <p className="team-note">
                {professionals.filter((professional) => professional.isActive).length} profissionais ativos no salão
            </p>
        </section>
    );
}
