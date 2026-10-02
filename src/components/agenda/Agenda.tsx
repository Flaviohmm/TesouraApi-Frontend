import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { useData } from '../../hooks/use-data';
import type { Appointment } from '../../types/api';
import { AppointmentRow } from '../ui/AppointmentRow';
import { Empty } from '../ui/Empty';

export function Agenda() {
    const { data, error } = useData<Appointment>('/api/appointments');
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'scheduled'>('all');

    const filteredData = data.filter((item) => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    const sortedData = [...filteredData].sort((a, b) => a.startsAt.localeCompare(b.startsAt));

    return (
        <section className="panel page-panel">
            <div className="panel-title">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">02 · CRONOGRAMA & SESSÕES</span>
                    </div>
                    <h2>Grade de Atendimentos</h2>
                </div>
                <button className="btn primary">
                    <Plus size={16} /> Agendar atendimento
                </button>
            </div>

            {/* Day Nav & Filter Rail */}
            <div className="agenda-toolbar">
                <div className="day-nav">
                    <button className="icon-pill" aria-label="Dia anterior">
                        <ChevronLeft size={16} />
                    </button>
                    <span className="mono day-indicator">
                        <i className="status-live-dot" />
                        HOJE · 01 OUTUBRO 2026
                    </span>
                    <button className="icon-pill" aria-label="Próximo dia">
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="filter-group">
                    <span className="filter-label mono">
                        <Filter size={12} /> FILTRAR:
                    </span>
                    <button
                        className={`filter-pill mono ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        TODOS ({data.length})
                    </button>
                    <button
                        className={`filter-pill mono ${filter === 'confirmed' ? 'active' : ''}`}
                        onClick={() => setFilter('confirmed')}
                    >
                        CONFIRMADOS
                    </button>
                    <button
                        className={`filter-pill mono ${filter === 'scheduled' ? 'active' : ''}`}
                        onClick={() => setFilter('scheduled')}
                    >
                        PENDENTES
                    </button>
                </div>
            </div>

            {/* Appointments Ledger */}
            {error ? (
                <Empty text={error} />
            ) : sortedData.length ? (
                <div className="caustic-rows-list">
                    {sortedData.map((item) => (
                        <AppointmentRow appointment={item} key={item.id} />
                    ))}
                </div>
            ) : (
                <Empty text="Nenhum agendamento encontrado para este filtro." />
            )}
        </section>
    );
}
