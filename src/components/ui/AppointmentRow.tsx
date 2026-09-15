import { Clock3 } from 'lucide-react';
import type { Appointment } from '../../types/api';
import { formatTime, initial } from '../../utils/format';

export function AppointmentRow({ appointment }: { appointment: Appointment }) {
    return (
        <div className="appointment-row">
            <div className="time">
                <Clock3 size={15} />
                {formatTime(appointment.startsAt)}
            </div>
            <div className="avatar">
                {initial(appointment.clientName)}
            </div>
            <div className="appointment-info">
                <b>{appointment.clientName}</b>
                <span>{appointment.services?.map((service) => service.name).join(', ') || 'Atendimento'} · {appointment.professionalName}</span>
            </div>
            <span className={`status ${appointment.status}`}>{appointment.status}</span>
        </div>
    );
}
