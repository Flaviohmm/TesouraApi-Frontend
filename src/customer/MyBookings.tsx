import { useEffect, useState } from 'react';
import { customerApi } from './customerApi';
import type { Appointment } from '../types/api';
import { AppointmentRow } from '../components/ui/AppointmentRow';
import { CausticLoader } from '../components/ui/CausticLoader';
import { Empty } from '../components/ui/Empty';

export function MyBookings() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        customerApi<Appointment[]>('/api/public/customers/me/appointments')
            .then(setAppointments)
            .catch((reason: Error) => setError(reason.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="panel page-panel caustic-view-panel">
            <div className="panel-title caustic-anim-reveal-1">
                <div>
                    <div className="tag">
                        <i />
                        <span className="mono">SUAS RESERVAS</span>
                    </div>
                    <h2>Minhas reservas</h2>
                </div>
            </div>

            {loading ? (
                <CausticLoader label="CARREGANDO RESERVAS" variant="panel" />
            ) : error ? (
                <Empty text={error} />
            ) : appointments.length ? (
                <div className="caustic-rows-list caustic-anim-reveal-2">
                    {appointments.map((item) => (
                        <AppointmentRow appointment={item} key={item.id} />
                    ))}
                </div>
            ) : (
                <Empty text="Você ainda não tem nenhuma reserva." />
            )}
        </section>
    );
}
