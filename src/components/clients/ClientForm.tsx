import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import type { ClientRequest } from '../../types/api';
import { formatPhone } from '../../utils/format';

export function ClientForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<ClientRequest>({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (field: keyof ClientRequest, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          email: form.email || undefined,
          birthday: form.birthday || undefined,
          notes: form.notes || undefined
        })
      });
      onCreated();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível cadastrar o cliente.');
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="client-modal" role="dialog" aria-modal="true" aria-labelledby="client-form-title">
        <div className="modal-header">
          <div>
            <div className="tag">
              <i />
              <span className="mono">NOVO CADASTRO</span>
            </div>
            <h2 id="client-form-title">Adicionar Cliente</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="client-form">
          <label>
            <span className="form-label mono">NOME COMPLETO</span>
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={120}
              placeholder="ex: Helena Albuquerque"
              required
            />
          </label>

          <div className="form-grid">
            <label>
              <span className="form-label mono">TELEFONE</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => update('phone', formatPhone(event.target.value))}
                maxLength={15}
                placeholder="(85) 99999-9999"
                required
              />
            </label>
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="form-label mono">E-MAIL</span>
                <span className="optional mono">OPCIONAL</span>
              </div>
              <input
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                maxLength={160}
                placeholder="cliente@email.com"
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="form-label mono">DATA DE NASCIMENTO</span>
                <span className="optional mono">OPCIONAL</span>
              </div>
              <input
                type="date"
                value={form.birthday}
                onChange={(event) => update('birthday', event.target.value)}
              />
            </label>
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="form-label mono">OBSERVAÇÕES</span>
                <span className="optional mono">OPCIONAL</span>
              </div>
              <input
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
                placeholder="Preferências, produtos, cuidados..."
              />
            </label>
          </div>

          {error && <p className="form-error mono">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
