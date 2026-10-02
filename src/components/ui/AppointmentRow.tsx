import { Clock3 } from 'lucide-react';
import type { Appointment } from '../../types/api';
import { formatTime, initial } from '../../utils/format';

export function AppointmentRow({ appointment }: { appointment: Appointment }) {
    return (
        <div className="appointment-row">
            <span className="ind" aria-hidden="true" />
            <div className="time mono">
                <Clock3 size={13} className="time-icon" />
                <span>{formatTime(appointment.startsAt)}</span>
            </div>
            <div className="avatar">
                {initial(appointment.clientName)}
            </div>
            <div className="appointment-info">
                <b className="client-name">{appointment.clientName}</b>
                <span className="service-details">
                    {appointment.services?.map((service) => service.name).join(', ') || 'Atendimento'}
                    <span className="divider">·</span>
                    {appointment.professionalName}
                </span>
            </div>
            <span className={`status status-${appointment.status || 'scheduled'}`}>
                <i className="status-dot" />
                {appointment.status}
            </span>
        </div>
    );
}
