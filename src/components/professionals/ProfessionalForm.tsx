import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import type { ProfessionalRequest, Schedule } from '../../types/api';

const DAYS = [
  { weekday: 1, label: 'Segunda' },
  { weekday: 2, label: 'Terça' },
  { weekday: 3, label: 'Quarta' },
  { weekday: 4, label: 'Quinta' },
  { weekday: 5, label: 'Sexta' },
  { weekday: 6, label: 'Sábado' },
  { weekday: 0, label: 'Domingo' }
];

type DayRow = { enabled: boolean; startTime: string; endTime: string };

const defaultDays = (): Record<number, DayRow> => Object.fromEntries(
  DAYS.map(({ weekday }) => [weekday, { enabled: weekday >= 1 && weekday <= 5, startTime: '09:00', endTime: '19:00' }])
);

export function ProfessionalForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [days, setDays] = useState<Record<number, DayRow>>(defaultDays);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateDay = (weekday: number, patch: Partial<DayRow>) =>
    setDays((current) => ({ ...current, [weekday]: { ...current[weekday], ...patch } }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const enabledDays = DAYS.filter(({ weekday }) => days[weekday].enabled);
    const invalidDay = enabledDays.find(({ weekday }) => days[weekday].endTime <= days[weekday].startTime);
    if (invalidDay) {
      setError(`${invalidDay.label}: o horário final deve ser depois do inicial.`);
      return;
    }

    setLoading(true);
    try {
      const schedules: Schedule[] = enabledDays.map(({ weekday }) => ({
        weekday,
        startTime: days[weekday].startTime,
        endTime: days[weekday].endTime
      }));

      const payload: ProfessionalRequest = {
        name,
        bio: bio || undefined,
        commissionRate: commissionRate ? Number(commissionRate) : undefined,
        schedules
      };
      await api('/api/professionals', { method: 'POST', body: JSON.stringify(payload) });
      onCreated();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível cadastrar o profissional.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="client-modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="professional-form-title">
        <div className="modal-header">
          <div>
            <div className="tag">
              <i />
              <span className="mono">NOVO MEMBRO</span>
            </div>
            <h2 id="professional-form-title">Adicionar Profissional</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="client-form">
          <div className="form-grid">
            <label>
              <span className="form-label mono">NOME COMPLETO</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={120}
                placeholder="ex: João Ricardo"
                required
              />
            </label>
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="form-label mono">COMISSÃO (%)</span>
                <span className="optional mono">OPCIONAL</span>
              </div>
              <input
                type="number"
                value={commissionRate}
                onChange={(event) => setCommissionRate(event.target.value)}
                min={0}
                max={100}
                step={0.5}
                placeholder="30"
              />
            </label>
          </div>

          <label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="form-label mono">BIO</span>
              <span className="optional mono">OPCIONAL</span>
            </div>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Especialidades, experiência, técnicas..."
              rows={2}
            />
          </label>

          <div>
            <span className="form-label mono">HORÁRIO SEMANAL</span>
            <div className="schedule-editor">
              {DAYS.map(({ weekday, label }) => {
                const row = days[weekday];
                return (
                  <div className={`schedule-row ${row.enabled ? '' : 'off'}`} key={weekday}>
                    <label className="schedule-day-toggle">
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={(event) => updateDay(weekday, { enabled: event.target.checked })}
                      />
                      <span>{label}</span>
                    </label>
                    {row.enabled ? (
                      <div className="schedule-time-inputs">
                        <input
                          type="time"
                          value={row.startTime}
                          onChange={(event) => updateDay(weekday, { startTime: event.target.value })}
                          required
                        />
                        <span className="schedule-time-sep mono">ATÉ</span>
                        <input
                          type="time"
                          value={row.endTime}
                          onChange={(event) => updateDay(weekday, { endTime: event.target.value })}
                          required
                        />
                      </div>
                    ) : (
                      <span className="schedule-off-label mono">FOLGA</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="form-error mono">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn primary" disabled={loading || !name}>
              {loading ? 'Salvando...' : 'Adicionar profissional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
