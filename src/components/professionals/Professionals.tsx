import { useState } from 'react';
import { Percent, Plus } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Professional, Schedule } from '../../types/api';
import { initial } from '../../utils/format';
import { CausticLoader } from '../ui/CausticLoader';
import { Empty } from '../ui/Empty';
import { ProfessionalForm } from './ProfessionalForm';

const DAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

function orderedSchedules(schedules: Schedule[] | undefined): Schedule[] {
    if (!schedules?.length) return [];
    return WEEK_ORDER
        .map((weekday) => schedules.find((schedule) => schedule.weekday === weekday))
        .filter((schedule): schedule is Schedule => Boolean(schedule));
}

export function Professionals() {
    const [showForm, setShowForm] = useState(false);
    const { data, error, loading, reload } = useData<Professional>('/api/professionals');

    return (
        <section className="panel page-panel caustic-view-panel">
            <div className="panel-title caustic-anim-reveal-1">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">05 · EQUIPE & DISPONIBILIDADE</span>
                    </div>
                    <h2>Profissionais</h2>
                </div>
                <button className="btn primary" onClick={() => setShowForm(true)}>
                    <Plus size={16} /> Novo profissional
                </button>
            </div>

            {loading ? (
                <CausticLoader label="CALIBRANDO EQUIPE" variant="panel" />
            ) : error ? (
                <Empty text={error} />
            ) : data.length ? (
                <div className="professional-grid caustic-anim-reveal-2">
                    {data.map((professional) => (
                        <article className="professional-card" key={professional.id}>
                            <div className="professional-card-top">
                                <div className="avatar professional-avatar">{initial(professional.name)}</div>
                                <div className="professional-identity">
                                    <b className="professional-name">{professional.name}</b>
                                    <span className={`status ${professional.isActive ? 'status-confirmed' : 'status-pending'}`}>
                                        <i className="status-dot" />
                                        {professional.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>

                            {professional.bio && <p className="professional-bio">{professional.bio}</p>}

                            {Number(professional.commissionRate) > 0 && (
                                <span className="duration-tag mono">
                                    <Percent size={13} /> {Number(professional.commissionRate)}% DE COMISSÃO
                                </span>
                            )}

                            <div className="schedule-pill-row">
                                {orderedSchedules(professional.schedules).length ? (
                                    orderedSchedules(professional.schedules).map((schedule) => (
                                        <span className="schedule-pill mono" key={schedule.weekday}>
                                            {DAY_LABELS[schedule.weekday]} {schedule.startTime.slice(0, 5)}–{schedule.endTime.slice(0, 5)}
                                        </span>
                                    ))
                                ) : (
                                    <span className="schedule-pill schedule-pill-empty mono">SEM HORÁRIOS CONFIGURADOS</span>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <Empty text="Nenhum profissional cadastrado ainda." />
            )}

            {showForm && <ProfessionalForm onClose={() => setShowForm(false)} onCreated={reload} />}
        </section>
    );
}
