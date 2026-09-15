import { ChevronRight, Plus, Sparkles } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Appointment } from '../../types/api';
import type { View } from '../../types/view';
import { formatTime, money } from '../../utils/format';
import { AppointmentRow } from '../ui/AppointmentRow';
import { Empty } from '../ui/Empty';
import { Metric } from '../ui/Metric';

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

    return <>
        <section className="hero">
            <div>
                <span className="hero-chip">
                    <Sparkles size={15} /> EM FOCO
                </span>
                <h2>Faça o dia de hoje<br />ser <em>memorável.</em></h2>
                <p>Você tem {appointments.length} atendimentos para transformar.</p>
            </div>
            <button className="button light" onClick={() => setView('agenda')}>
                <Plus size={18} />Novo agendamento
            </button>
        </section>
        <section className="metrics">
            <Metric label="Atendimentos hoje" value={String(appointments.length).padStart(2, '0')} note="Agenda do dia" />
            <Metric label="Previsão de receita" value={money.format(total)} note="Com base nos horários" />
            <Metric label="Próximo horário" value={appointments[0] ? formatTime(appointments[0].startsAt) : '—'} note={appointments[0]?.clientName ?? 'Sem agendamentos'} />
        </section>
        <section className="content-grid">
            <div className="panel schedule">
                <div className="panel-title">
                    <div>
                        <p className="eyebrow">AGENDA</p>
                        <h2>Próximos atendimentos</h2>
                    </div>
                    <button className="text-button" onClick={() => setView('agenda')}>Ver agenda</button>
                </div>
                {error ?
                    <Empty text={error} /> :
                    appointments.length ?
                        appointments.slice(0, 4).map((item) => <AppointmentRow appointment={item} key={item.id} />) :
                        <Empty text="Seu dia está livre. Que tal abrir um horário?" />
                }
            </div>
            <div className="panel pulse">
                <p className="eyebrow">RESUMO</p>
                <h2>O pulso do salão</h2>
                <div className="progress-label">
                    <span>Taxa de ocupação</span>
                    <b>{occupancy}%</b>
                </div>
                <div className="progress">
                    <i style={{ width: `${occupancy}%` }} />
                </div>
                <p className="small-copy">Acompanhe a agenda e mantenha seu ritmo.</p>
                <button className="text-button" onClick={() => setView('clients')}>
                    Ver clientes <ChevronRight size={16} />
                </button>
            </div>
        </section>
    </>
}
