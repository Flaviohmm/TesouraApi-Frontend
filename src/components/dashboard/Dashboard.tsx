import { ChevronRight, Plus } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Appointment } from '../../types/api';
import type { View } from '../../types/view';
import { formatTime, money } from '../../utils/format';
import { AppointmentRow } from '../ui/AppointmentRow';
import { Empty } from '../ui/Empty';
import { Metric } from '../ui/Metric';
import { MotionGallery } from '../ui/MotionGallery';

export function Dashboard({ setView }: {
    setView: (view: View) => void;
}) {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    const { data: appointments, error } = useData<Appointment>(`/api/appointments?from=${from.toISOString()}&to=${to.toISOString()}`);
    const total = appointments.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const occupancy = Math.min(appointments.length * 17, 100);

    return (
        <div className="dashboard-content">
            {/* Caustic Hero Banner */}
            <section className="caustic-hero">
                <div className="caustic-hero-bg" aria-hidden="true">
                    <div className="hero-radial hero-radial-amber" />
                    <div className="hero-radial hero-radial-cool" />
                </div>
                <div className="caustic-hero-content">
                    <div className="tag">
                        <i />
                        <span className="mono">01 · SALON WORKBENCH</span>
                    </div>
                    <h1>
                        Precisão como <em>essência.</em>
                    </h1>
                    <p className="caustic-hero-lead">
                        Calibre cada detalhe no ritmo exato. Você tem <strong>{appointments.length}</strong> atendimentos
                        agendados hoje para transformar em experiências memoráveis.
                    </p>
                    <div className="caustic-hero-cta">
                        <button className="btn primary" onClick={() => setView('agenda')}>
                            <Plus size={16} /> Novo agendamento
                        </button>
                        <button className="btn secondary" onClick={() => setView('services')}>
                            Explorar catálogo
                        </button>
                    </div>
                </div>
                <div className="caustic-hero-spec mono">
                    <div>CALIBRAÇÃO · ESTÁVEL</div>
                    <div>STATUS · EM OPERAÇÃO</div>
                </div>
            </section>

            {/* Metrics Telemetry Grid */}
            <section className="metrics">
                <Metric
                    label="ATENDIMENTOS HOJE"
                    value={String(appointments.length).padStart(2, '0')}
                    note="Agenda do dia em execução"
                />
                <Metric
                    label="PREVISÃO DE RECEITA"
                    value={money.format(total)}
                    note="Calculado com base nos serviços"
                />
                <Metric
                    label="PRÓXIMO HORÁRIO"
                    value={appointments[0] ? formatTime(appointments[0].startsAt) : '—'}
                    note={appointments[0]?.clientName ?? 'Sem atendimentos na fila'}
                />
            </section>

            {/* Ledger & Telemetry Split */}
            <section className="content-grid">
                <div className="panel schedule-panel">
                    <div className="panel-title">
                        <div>
                            <div className="tag">
                                <i />
                                <span className="mono">CRONOGRAMA</span>
                            </div>
                            <h2>Próximos atendimentos</h2>
                        </div>
                        <button className="text-button mono" onClick={() => setView('agenda')}>
                            VER AGENDA <ChevronRight size={14} />
                        </button>
                    </div>

                    {error ? (
                        <Empty text={error} />
                    ) : appointments.length ? (
                        <div className="caustic-rows-list">
                            {appointments.slice(0, 4).map((item) => (
                                <AppointmentRow appointment={item} key={item.id} />
                            ))}
                        </div>
                    ) : (
                        <Empty text="Seu cronograma está livre no momento." />
                    )}
                </div>

                <div className="panel pulse-panel">
                    <div className="tag">
                        <i />
                        <span className="mono">TELEMETRIA</span>
                    </div>
                    <h2>Pulso do salão</h2>

                    <div className="telemetry-box">
                        <div className="progress-label">
                            <span className="mono">TAXA DE OCUPAÇÃO</span>
                            <b className="mono">{occupancy}%</b>
                        </div>
                        <div className="caustic-rail">
                            <i style={{ width: `${occupancy}%` }} />
                        </div>
                    </div>

                    <p className="small-copy">
                        Acompanhe a cadência de agendamentos e mantenha seu fluxo em alta performance.
                    </p>

                    <button className="btn secondary wide" onClick={() => setView('clients')}>
                        Gerenciar clientes <ChevronRight size={14} />
                    </button>
                </div>
            </section>

            {/* Design System Specimens */}
            <MotionGallery />
        </div>
    );
}
