import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Appointment } from '../../types/api';
import { AppointmentRow } from '../ui/AppointmentRow';
import { Empty } from '../ui/Empty';

export function Agenda() {
    const { data, error } = useData<Appointment>('/api/appointments');
    return (
        <section className="panel page-panel">
            <div className="panel-title">
                <div>
                    <p className="eyebrow">CRONOLOGIA</p>
                    <h2>Todos os horários</h2>
                </div>
                <button className="button primary">
                    <Plus size={18} />Agendar
                </button>
            </div>
            <div className="day-nav">
                <ChevronLeft /><b>Agenda de atendimentos</b><ChevronRight />
            </div>
            {error ?
                <Empty text={error} /> :
                data.length ?
                    data.sort((a, b) =>
                        a.startsAt.localeCompare(b.startsAt)).map((item) =>
                            <AppointmentRow appointment={item} key={item.id} />) :
                    <Empty text="Nenhum agendamento encontrado." />
            }
        </section>
    );
}
