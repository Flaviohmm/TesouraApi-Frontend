import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { customerApi } from './customerApi';
import type { Appointment, AvailableSlot } from '../types/api';
import type { PaymentCheckout, PaymentStatusResponse, PublicAppointmentRequest, PublicSalonDetail } from '../types/customer';
import { formatTime, money } from '../utils/format';
import { CausticLoader } from '../components/ui/CausticLoader';
import { Empty } from '../components/ui/Empty';

const todayIso = () => new Date().toISOString().slice(0, 10);

export function SalonDetail({ slug, loggedIn, onNeedLogin, onBack, onViewBookings, appointmentId, stripeReturn }: {
    slug: string;
    loggedIn: boolean;
    onNeedLogin: () => void;
    onBack: () => void;
    onViewBookings: () => void;
    appointmentId?: string;
    stripeReturn?: boolean;
}) {
    const [salon, setSalon] = useState<PublicSalonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [serviceIds, setServiceIds] = useState<string[]>([]);
    const [professionalId, setProfessionalId] = useState('');
    const [date, setDate] = useState(todayIso());
    const [notes, setNotes] = useState('');

    const [slots, setSlots] = useState<AvailableSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

    const [paymentChoice, setPaymentChoice] = useState<'salon' | 'online'>('salon');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const [returnStatus, setReturnStatus] = useState<PaymentStatusResponse['status'] | null>(stripeReturn ? 'pending' : null);

    useEffect(() => {
        setLoading(true);
        setLoadError('');
        customerApi<PublicSalonDetail>(`/api/public/salons/${slug}`)
            .then(setSalon)
            .catch((reason: Error) => setLoadError(reason.message))
            .finally(() => setLoading(false));
    }, [slug]);

    const toggleService = (id: string) => {
        setServiceIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
        setSelectedSlot(null);
    };

    const selected = (salon?.services ?? []).filter((service) => serviceIds.includes(service.id));
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
        customerApi<AvailableSlot[]>(`/api/public/salons/${slug}/availability?${params.toString()}`)
            .then((result) => { if (!cancelled) setSlots(result); })
            .catch(() => { if (!cancelled) setSlots([]); })
            .finally(() => { if (!cancelled) setSlotsLoading(false); });

        return () => { cancelled = true; };
    }, [slug, professionalId, date, serviceIds]);

    // Retorno do Checkout da Stripe: polling curto, já que a Stripe só redireciona de volta
    // depois que o pagamento (inclusive PIX/boleto assíncronos) chega a um estado final.
    useEffect(() => {
        if (!stripeReturn || !appointmentId || returnStatus !== 'pending') return;
        let cancelled = false;
        let attempts = 0;
        const interval = window.setInterval(async () => {
            attempts += 1;
            try {
                const result = await customerApi<PaymentStatusResponse>(
                    `/api/public/salons/${slug}/appointments/${appointmentId}/payments/status`
                );
                if (cancelled) return;
                if (result.status !== 'pending' || attempts >= 10) {
                    setReturnStatus(result.status);
                    window.clearInterval(interval);
                }
            } catch {
                // ignora erros transitórios, continua tentando
            }
        }, 2000);
        return () => { cancelled = true; window.clearInterval(interval); };
    }, [stripeReturn, appointmentId, returnStatus, slug]);

    async function submit() {
        if (!selectedSlot) return;
        if (!loggedIn) {
            onNeedLogin();
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const payload: PublicAppointmentRequest = {
                professionalId,
                startsAt: selectedSlot.startsAt,
                serviceIds,
                notes: notes || undefined
            };
            const created = await customerApi<Appointment>(`/api/public/salons/${slug}/appointments`, { method: 'POST', body: JSON.stringify(payload) });
            if (paymentChoice === 'salon') {
                setConfirmed(true);
                return;
            }
            const checkout = await customerApi<PaymentCheckout>(
                `/api/public/salons/${slug}/appointments/${created.id}/payments`,
                { method: 'POST' }
            );
            window.location.href = checkout.checkoutUrl;
        } catch (reason) {
            setSubmitError(reason instanceof Error ? reason.message : 'Não foi possível concluir o agendamento.');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <section className="panel page-panel caustic-view-panel">
                <CausticLoader label="CARREGANDO SALÃO" variant="panel" />
            </section>
        );
    }

    if (loadError || !salon) {
        return (
            <section className="panel page-panel caustic-view-panel">
                <Empty text={loadError || 'Salão não encontrado.'} />
            </section>
        );
    }

    if (stripeReturn && returnStatus === 'pending') {
        return (
            <section className="panel page-panel caustic-view-panel">
                <CausticLoader label="VERIFICANDO PAGAMENTO" variant="panel" />
            </section>
        );
    }

    if (confirmed || returnStatus === 'approved') {
        return (
            <section className="panel page-panel caustic-view-panel">
                <div className="empty" style={{ padding: '48px 0' }}>
                    <div className="empty-mark"><CheckCircle2 size={18} /></div>
                    <p className="empty-text">
                        {returnStatus === 'approved'
                            ? `Pagamento aprovado! Agendamento confirmado em ${salon.name}.`
                            : `Agendamento confirmado em ${salon.name}!`}
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                        <button className="btn secondary" onClick={onBack}>Voltar ao diretório</button>
                        <button className="btn primary" onClick={onViewBookings}>Ver minhas reservas</button>
                    </div>
                </div>
            </section>
        );
    }

    if (returnStatus && returnStatus !== 'pending') {
        return (
            <section className="panel page-panel caustic-view-panel">
                <div className="empty" style={{ padding: '48px 0' }}>
                    <p className="empty-text">Pagamento não aprovado.</p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                        <button className="btn primary" onClick={() => setConfirmed(true)}>Confirmar e pagar no salão</button>
                        <button className="btn secondary" onClick={onBack}>Voltar ao diretório</button>
                    </div>
                </div>
            </section>
        );
    }

    const canSubmit = professionalId && serviceIds.length > 0 && selectedSlot && !submitting;
    const missingStep = !professionalId
        ? 'Selecione um profissional.'
        : serviceIds.length === 0
            ? 'Selecione ao menos um serviço.'
            : !selectedSlot
                ? 'Selecione um horário disponível.'
                : '';

    return (
        <section className="panel page-panel caustic-view-panel">
            <div className="panel-title caustic-anim-reveal-1">
                <div>
                    <button type="button" className="text-button mono" onClick={onBack} style={{ marginBottom: 10 }}>
                        <ArrowLeft size={14} /> VOLTAR
                    </button>
                    <div className="tag">
                        <i />
                        <span className="mono">SALÃO PARCEIRO</span>
                    </div>
                    <h2>{salon.name}</h2>
                    <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                        {salon.address && (
                            <span className="client-contact mono"><MapPin size={12} className="meta-icon" /> {salon.address}</span>
                        )}
                        {salon.phone && (
                            <span className="client-contact mono"><Phone size={12} className="meta-icon" /> {salon.phone}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="client-form caustic-anim-reveal-2">
                <div>
                    <span className="form-label mono">SERVIÇOS</span>
                    {salon.services.length ? (
                        <div className="service-pick-grid">
                            {salon.services.map((service) => (
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
                        <p className="small-copy">Nenhum serviço disponível no momento.</p>
                    )}
                    {selected.length > 0 && (
                        <div className="booking-summary mono">
                            <span>{selected.length} SERVIÇO{selected.length > 1 ? 'S' : ''} · {totalDuration} MIN</span>
                            <b>{money.format(totalPrice)}</b>
                        </div>
                    )}
                </div>

                <label>
                    <span className="form-label mono">PROFISSIONAL</span>
                    <select value={professionalId} onChange={(event) => setProfessionalId(event.target.value)}>
                        <option value="" disabled>Selecione um profissional</option>
                        {salon.professionals.map((professional) => (
                            <option value={professional.id} key={professional.id}>{professional.name}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span className="form-label mono">DATA</span>
                    <input type="date" value={date} min={todayIso()} onChange={(event) => setDate(event.target.value)} />
                </label>

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
                        placeholder="Preferências, pedidos especiais..."
                        rows={2}
                    />
                </label>

                {canSubmit && (
                    <div>
                        <span className="form-label mono">PAGAMENTO</span>
                        <div className="service-pick-grid">
                            <button type="button" className={`service-pick-chip ${paymentChoice === 'salon' ? 'active' : ''}`} onClick={() => setPaymentChoice('salon')}>
                                <span className="service-pick-name">Pagar no salão</span>
                                <span className="service-pick-meta mono">Dinheiro/cartão na hora</span>
                            </button>
                            <button type="button" className={`service-pick-chip ${paymentChoice === 'online' ? 'active' : ''}`} onClick={() => setPaymentChoice('online')}>
                                <span className="service-pick-name">Pagar agora online</span>
                                <span className="service-pick-meta mono">PIX, cartão ou boleto</span>
                            </button>
                        </div>
                    </div>
                )}

                {submitError && <p className="form-error mono">{submitError}</p>}

                <div className="modal-actions">
                    {!canSubmit && missingStep && <span className="optional mono modal-hint">{missingStep}</span>}
                    <button type="button" className="btn primary" disabled={!canSubmit} onClick={submit}>
                        {submitting
                            ? (paymentChoice === 'online' ? 'Redirecionando...' : 'Agendando...')
                            : loggedIn ? 'Confirmar agendamento' : 'Entrar e agendar'}
                    </button>
                </div>
            </div>
        </section>
    );
}
