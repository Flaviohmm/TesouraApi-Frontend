import { useState, type FormEvent } from 'react';
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
    }
    catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível cadastrar o cliente.');
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="client-modal" role="dialog" aria-modal="true" aria-labelledby="client-form-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">RELACIONAMENTO</p>
            <h2 id="client-form-title">Novo cliente</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={submit} className="client-form">
          <label>
            Nome completo
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={120}
              placeholder="Nome do cliente"
              required
            />
          </label>
          <div className="form-grid">
            <label>Telefone
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => update('phone', formatPhone(event.target.value))}
                maxLength={15}
                placeholder="(85) 99999-9999"
                required
              />
            </label>
            <label>E-mail
              <span className="optional">opcional</span>
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
            <label>Data de nascimento
              <span className="optional">opcional</span>
              <input
                type="date"
                value={form.birthday}
                onChange={(event) => update('birthday', event.target.value)}
              />
            </label>
            <label>Observações
              <span className="optional">opcional</span>
              <input
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
                placeholder="Preferências, cuidados..."
              />
            </label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="button primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
