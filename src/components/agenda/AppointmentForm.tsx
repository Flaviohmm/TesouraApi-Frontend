import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import { useData } from '../../hooks/use-data';
import type { AppointmentRequest, AvailableSlot, Client, HairService, Professional } from '../../types/api';
import { formatTime, money } from '../../utils/format';
import { CausticLoader } from '../ui/CausticLoader';

const todayIso = () => new Date().toISOString().slice(0, 10);

export function AppointmentForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { data: clients } = useData<Client>('/api/clients');
  const { data: professionals } = useData<Professional>('/api/professionals');
  const { data: services } = useData<HairService>('/api/services');
  const activeProfessionals = professionals.filter((professional) => professional.isActive);
  const activeServices = services.filter((service) => service.isActive);

  const [clientId, setClientId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [date, setDate] = useState(todayIso());
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleService = (id: string) => {
    setServiceIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setSelectedSlot(null);
  };

  const selected = activeServices.filter((service) => serviceIds.includes(service.id));
  const totalDuration = selected.reduce((sum, service) => sum + service.durationMinutes, 0);
  const totalPrice = selected.reduce((sum, service) => sum + Number(service.price), 0);

  useEffect(() => {
    setSelectedSlot(null);
    if (!professionalId || !date) {
      setSlots([]);
      return;
    }
    const params = new URLSearchParams({ professionalId, date });
    serviceIds.forEach((id) => params.append('serviceIds', id));

    let cancelled = false;
    setSlotsLoading(true);
    api<AvailableSlot[]>(`/api/appointments/availability?${params.toString()}`)
      .then((result) => { if (!cancelled) setSlots(result); })
      .catch(() => { if (!cancelled) setSlots([]); })
      .finally(() => { if (!cancelled) setSlotsLoading(false); });

    return () => { cancelled = true; };
  }, [professionalId, date, serviceIds]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selectedSlot) return;
    setLoading(true);
    setError('');
    try {
      const payload: AppointmentRequest = {
        clientId,
        professionalId,
        startsAt: selectedSlot.startsAt,
        serviceIds,
        notes: notes || undefined,
        createdVia: 'web'
      };
      await api('/api/appointments', { method: 'POST', body: JSON.stringify(payload) });
      onCreated();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível criar o agendamento.');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = clientId && professionalId && serviceIds.length > 0 && selectedSlot && !loading;
  const missingStep = !clientId
    ? 'Selecione um cliente.'
    : !professionalId
      ? 'Selecione um profissional.'
      : serviceIds.length === 0
        ? 'Selecione ao menos um serviço.'
        : !selectedSlot
          ? 'Selecione um horário disponível.'
          : '';

  return (
    <div className="modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="client-modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title">
        <div className="modal-header">
          <div>
            <div className="tag">
              <i />
              <span className="mono">NOVA SESSÃO</span>
            </div>
            <h2 id="appointment-form-title">Agendar Atendimento</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="client-form">
          <div className="form-grid">
            <label>
              <span className="form-label mono">CLIENTE</span>
              <select value={clientId} onChange={(event) => setClientId(event.target.value)} required>
                <option value="" disabled>Selecione um cliente</option>
                {clients.map((client) => (
                  <option value={client.id} key={client.id}>{client.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="form-label mono">PROFISSIONAL</span>
              <select value={professionalId} onChange={(event) => setProfessionalId(event.target.value)} required>
                <option value="" disabled>Selecione um profissional</option>
                {activeProfessionals.map((professional) => (
                  <option value={professional.id} key={professional.id}>{professional.name}</option>
                ))}
              </select>
            </label>
          </div>

          {!clients.length && (
            <p className="form-error mono">Cadastre um cliente antes de criar um agendamento.</p>
          )}
          {!activeProfessionals.length && (
            <p className="form-error mono">Nenhum profissional ativo disponível para agendamento.</p>
          )}

          <label>
            <span className="form-label mono">DATA</span>
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>

          <div>
            <span className="form-label mono">SERVIÇOS</span>
            {activeServices.length ? (
              <div className="service-pick-grid">
                {activeServices.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    className={`service-pick-chip ${serviceIds.includes(service.id) ? 'active' : ''}`}
                    onClick={() => toggleService(service.id)}
                  >
                    <span className="service-pick-name">{service.name}</span>
                    <span className="service-pick-meta mono">
                      {service.durationMinutes} MIN · {money.format(Number(service.price))}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="small-copy">Nenhum serviço cadastrado no catálogo.</p>
            )}
            {selected.length > 0 && (
              <div className="booking-summary mono">
                <span>{selected.length} SERVIÇO{selected.length > 1 ? 'S' : ''} · {totalDuration} MIN</span>
                <b>{money.format(totalPrice)}</b>
              </div>
            )}
          </div>

          {professionalId && date && (
            <div>
              <span className="form-label mono">HORÁRIOS DISPONÍVEIS</span>
              {slotsLoading ? (
                <CausticLoader label="CALIBRANDO HORÁRIOS" variant="inline" />
              ) : slots.length ? (
                <div className="slot-grid">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.startsAt}
                      className={`slot-pill mono ${selectedSlot?.startsAt === slot.startsAt ? 'active' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {formatTime(slot.startsAt)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="small-copy">Nenhum horário disponível para esta data.</p>
              )}
            </div>
          )}

          <label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="form-label mono">OBSERVAÇÕES</span>
              <span className="optional mono">OPCIONAL</span>
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Preferências, restrições, pedidos especiais..."
              rows={2}
            />
          </label>

          {error && <p className="form-error mono">{error}</p>}

          <div className="modal-actions">
            {!canSubmit && missingStep && (
              <span className="optional mono modal-hint">{missingStep}</span>
            )}
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn primary" disabled={!canSubmit}>
              {loading ? 'Agendando...' : 'Confirmar agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
