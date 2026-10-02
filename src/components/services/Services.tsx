import { Clock3, Plus, UserCheck } from 'lucide-react';
import { ScissorsIcon } from '../ui/ScissorsIcon';
import { useData } from '../../hooks/use-data';
import type { HairService, Professional } from '../../types/api';
import { money } from '../../utils/format';
import { Empty } from '../ui/Empty';

export function Services() {
    const { data, error } = useData<HairService>('/api/services');
    const { data: professionals } = useData<Professional>('/api/professionals');
    const activeStaff = professionals.filter((professional) => professional.isActive).length;

    return (
        <section className="panel page-panel">
            <div className="panel-title">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">04 · CATÁLOGO & PROCEDIMENTOS</span>
                    </div>
                    <h2>Menu de Serviços</h2>
                </div>
                <button className="btn primary">
                    <Plus size={16} /> Novo serviço
                </button>
            </div>

            {error ? (
                <Empty text={error} />
            ) : (
                <div className="service-grid">
                    {data.length ? (
                        data.map((service) => (
                            <article className="service-card" key={service.id}>
                                <div className="service-card-top">
                                    <div className="service-icon">
                                        <ScissorsIcon size={19} pivotFill="var(--amb)" />
                                    </div>
                                    <span className="category-pill mono">{service.category || 'PROCEDIMENTO'}</span>
                                </div>
                                <h3 className="service-name">{service.name}</h3>
                                <div className="service-card-bottom">
                                    <span className="duration-tag mono">
                                        <Clock3 size={13} /> {service.durationMinutes} MIN
                                    </span>
                                    <b className="service-price mono">{money.format(Number(service.price))}</b>
                                </div>
                            </article>
                        ))
                    ) : (
                        <Empty text="Nenhum serviço cadastrado no catálogo." />
                    )}
                </div>
            )}

            <div className="team-telemetry mono">
                <UserCheck size={14} style={{ color: 'var(--cool)' }} />
                <span>{activeStaff} PROFISSIONAIS ATIVOS NA OPERAÇÃO</span>
            </div>
        </section>
    );
}
