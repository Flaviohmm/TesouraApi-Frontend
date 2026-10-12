import { Check, CheckCheck, Clock3, UserX, X } from 'lucide-react';
import { useState } from 'react';
import type { Appointment } from '../../types/api';
import { formatTime, initial } from '../../utils/format';

const NEXT_ACTIONS: Record<string, { status: string; label: string; icon: typeof Check; className: string }[]> = {
    scheduled: [
        { status: 'confirmed', label: 'Confirmar', icon: Check, className: 'action-confirm' },
        { status: 'completed', label: 'Concluir', icon: CheckCheck, className: 'action-complete' },
        { status: 'cancelled', label: 'Cancelar', icon: X, className: 'action-cancel' }
    ],
    confirmed: [
        { status: 'completed', label: 'Concluir', icon: CheckCheck, className: 'action-complete' },
        { status: 'no_show', label: 'Não compareceu', icon: UserX, className: 'action-cancel' },
        { status: 'cancelled', label: 'Cancelar', icon: X, className: 'action-cancel' }
    ]
};

export function AppointmentRow({ appointment, onStatusChange }: {
    appointment: Appointment;
    onStatusChange?: (id: string, status: string) => Promise<void>;
}) {
    const [updating, setUpdating] = useState(false);
    const actions = onStatusChange ? (NEXT_ACTIONS[appointment.status] ?? []) : [];

    const handle = async (status: string) => {
        if (!onStatusChange || updating) return;
        setUpdating(true);
        try {
            await onStatusChange(appointment.id, status);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={`appointment-row ${onStatusChange ? 'actionable' : ''}`}>
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
            {onStatusChange && (
                <div className="appointment-row-actions">
                    {actions.map(({ status, label, icon: Icon, className }) => (
                        <button
                            type="button"
                            key={status}
                            className={`icon-pill ${className}`}
                            aria-label={label}
                            title={label}
                            disabled={updating}
                            onClick={() => handle(status)}
                        >
                            <Icon size={14} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
