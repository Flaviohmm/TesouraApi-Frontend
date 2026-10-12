import { useEffect, useState, type FormEvent } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import type { Me, Salon, SalonRequest } from '../../types/api';
import { formatPhone, initial } from '../../utils/format';
import { CausticLoader } from '../ui/CausticLoader';
import { Empty } from '../ui/Empty';

const PLAN_LABELS: Record<string, string> = {
    trial: 'Teste grátis',
    solo: 'Plano Solo',
    salon: 'Plano Salão'
};

const ROLE_LABELS: Record<string, string> = {
    owner: 'Proprietário',
    staff: 'Equipe'
};

export function Settings() {
    const [salon, setSalon] = useState<Salon | null>(null);
    const [me, setMe] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [form, setForm] = useState<SalonRequest>({ name: '', phone: '', address: '', timezone: '', logoUrl: '' });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saved, setSaved] = useState(false);

    const update = (field: keyof SalonRequest, value: string) => {
        setSaved(false);
        setForm((current) => ({ ...current, [field]: value }));
    };

    useEffect(() => {
        setLoading(true);
        setLoadError('');
        Promise.all([api<Salon>('/api/salons/me'), api<Me>('/api/auth/me')])
            .then(([salonResult, meResult]) => {
                setSalon(salonResult);
                setMe(meResult);
                setForm({
                    name: salonResult.name,
                    phone: salonResult.phone ?? '',
                    address: salonResult.address ?? '',
                    timezone: salonResult.timezone ?? '',
                    logoUrl: salonResult.logoUrl ?? ''
                });
            })
            .catch((reason: Error) => setLoadError(reason.message))
            .finally(() => setLoading(false));
    }, []);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setSaving(true);
        setSaveError('');
        setSaved(false);
        try {
            const payload: SalonRequest = {
                name: form.name,
                phone: form.phone || undefined,
                address: form.address || undefined,
                timezone: form.timezone || undefined,
                logoUrl: form.logoUrl || undefined
            };
            const updated = await api<Salon>('/api/salons/me', { method: 'PUT', body: JSON.stringify(payload) });
            setSalon(updated);
            setSaved(true);
        } catch (reason) {
            setSaveError(reason instanceof Error ? reason.message : 'Não foi possível salvar as configurações.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <section className="panel page-panel caustic-view-panel">
                <CausticLoader label="CARREGANDO CONFIGURAÇÕES" variant="panel" />
            </section>
        );
    }

    if (loadError || !salon || !me) {
        return (
            <section className="panel page-panel caustic-view-panel">
                <Empty text={loadError || 'Não foi possível carregar as configurações.'} />
            </section>
        );
    }

    const isActivePlan = salon.subscriptionStatus === 'active';
    const planLabel = salon.subscriptionPlan ? (PLAN_LABELS[salon.subscriptionPlan] ?? salon.subscriptionPlan) : '—';
    const roleLabel = ROLE_LABELS[me.role] ?? me.role;

    return (
        <section className="content-grid caustic-anim-reveal-1">
            <div className="panel schedule-panel">
                <div className="panel-title">
                    <div>
                        <div className="tag">
                            <i />
                            <span className="mono">06 · IDENTIDADE DO SALÃO</span>
                        </div>
                        <h2>Dados do salão</h2>
                    </div>
                </div>

                <form onSubmit={submit} className="client-form">
                    <label>
                        <span className="form-label mono">NOME DO SALÃO</span>
                        <input
                            value={form.name}
                            onChange={(event) => update('name', event.target.value)}
                            maxLength={120}
                            placeholder="ex: Studio Caustic"
                            required
                        />
                    </label>

                    <div className="form-grid">
                        <label>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="form-label mono">TELEFONE</span>
                                <span className="optional mono">OPCIONAL</span>
                            </div>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(event) => update('phone', formatPhone(event.target.value))}
                                maxLength={15}
                                placeholder="(85) 99999-9999"
                            />
                        </label>
                        <label>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="form-label mono">FUSO HORÁRIO</span>
                                <span className="optional mono">OPCIONAL</span>
                            </div>
                            <input
                                value={form.timezone}
                                onChange={(event) => update('timezone', event.target.value)}
                                maxLength={50}
                                placeholder="America/Recife"
                            />
                        </label>
                    </div>

                    <label>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="form-label mono">ENDEREÇO</span>
                            <span className="optional mono">OPCIONAL</span>
                        </div>
                        <input
                            value={form.address}
                            onChange={(event) => update('address', event.target.value)}
                            placeholder="Rua, número, bairro, cidade"
                        />
                    </label>

                    <label>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="form-label mono">URL DO LOGO</span>
                            <span className="optional mono">OPCIONAL</span>
                        </div>
                        <input
                            value={form.logoUrl}
                            onChange={(event) => update('logoUrl', event.target.value)}
                            placeholder="https://..."
                        />
                    </label>

                    {saveError && <p className="form-error mono">{saveError}</p>}

                    <div className="modal-actions">
                        {saved && <span className="optional mono modal-hint">Configurações salvas.</span>}
                        <button className="btn primary" disabled={saving || !form.name}>
                            {saving ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="panel pulse-panel">
                <div className="tag">
                    <i />
                    <span className="mono">CONTA & PLANO</span>
                </div>
                <h2>Minha conta</h2>

                <div className="telemetry-box">
                    <div className="professional-card-top" style={{ marginBottom: 14 }}>
                        <div className="avatar professional-avatar">{initial(me.name)}</div>
                        <div className="professional-identity">
                            <b className="professional-name">{me.name}</b>
                            <span className="status status-confirmed">
                                <i className="status-dot" />
                                {roleLabel}
                            </span>
                        </div>
                    </div>
                    <p className="small-copy" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={13} /> {me.email}
                    </p>
                </div>

                <div className="progress-label">
                    <span className="mono">PLANO ATUAL</span>
                    <b className="mono">{planLabel}</b>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    <span className={`status ${isActivePlan ? 'status-confirmed' : 'status-pending'}`}>
                        <i className="status-dot" />
                        {isActivePlan ? 'Ativo' : salon.subscriptionStatus ?? 'Status indisponível'}
                    </span>
                    {salon.trialEndsAt && (
                        <span className="status status-pending">
                            <ShieldCheck size={12} />
                            Teste até {new Date(salon.trialEndsAt).toLocaleDateString('pt-BR')}
                        </span>
                    )}
                </div>

                <p className="small-copy">
                    Identificador público: <span className="mono">@{salon.slug}</span>
                </p>
            </div>
        </section>
    );
}
