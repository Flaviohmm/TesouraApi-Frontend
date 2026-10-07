import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import type { HairServiceRequest } from '../../types/api';

export function ServiceForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    durationMinutes: '30',
    price: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: HairServiceRequest = {
        name: form.name,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        category: form.category || undefined,
        description: form.description || undefined
      };
      await api('/api/services', { method: 'POST', body: JSON.stringify(payload) });
      onCreated();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível cadastrar o serviço.');
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="client-modal" role="dialog" aria-modal="true" aria-labelledby="service-form-title">
        <div className="modal-header">
          <div>
            <div className="tag">
              <i />
              <span className="mono">NOVO PROCEDIMENTO</span>
            </div>
            <h2 id="service-form-title">Adicionar Serviço</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="client-form">
          <label>
            <span className="form-label mono">NOME DO SERVIÇO</span>
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={120}
              placeholder="ex: Corte Navalhado"
              required
            />
          </label>

          <label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="form-label mono">CATEGORIA</span>
              <span className="optional mono">OPCIONAL</span>
            </div>
            <input
              value={form.category}
              onChange={(event) => update('category', event.target.value)}
              maxLength={60}
              placeholder="ex: Corte, Barba, Coloração"
            />
          </label>

          <div className="form-grid">
            <label>
              <span className="form-label mono">DURAÇÃO (MIN)</span>
              <input
                type="number"
                value={form.durationMinutes}
                onChange={(event) => update('durationMinutes', event.target.value)}
                min={5}
                step={5}
                placeholder="45"
                required
              />
            </label>
            <label>
              <span className="form-label mono">PREÇO (R$)</span>
              <input
                type="number"
                value={form.price}
                onChange={(event) => update('price', event.target.value)}
                min={0.01}
                step={0.01}
                placeholder="85,00"
                required
              />
            </label>
          </div>

          <label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="form-label mono">DESCRIÇÃO</span>
              <span className="optional mono">OPCIONAL</span>
            </div>
            <textarea
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Detalhes do procedimento, técnicas e produtos utilizados..."
              rows={3}
            />
          </label>

          {error && <p className="form-error mono">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
