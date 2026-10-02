import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import type { LoginResponse } from '../../types/api';
import { formatPhone, slugify } from '../../utils/format';
import { Brand } from './Brand';
import { AppLogo } from '../ui/AppLogo';

export function Register({ onLogin, onBack }: {
    onLogin: (data: LoginResponse) => void;
    onBack: () => void;
}) {
    const [salonName, setSalonName] = useState('');
    const [slug, setSlug] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function updateSalonName(value: string) {
        setSalonName(value);
        setSlug((current) => current ? current : slugify(value));
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (password !== confirmation) {
            return setError('As senhas não coincidem.');
        }
        setLoading(true);
        setError('');
        try {
            onLogin(
                await api<LoginResponse>(
                    '/api/auth/register',
                    {
                        method: 'POST',
                        body: JSON.stringify({ salonName, slug, ownerName, email, password, phone: phone || undefined })
                    }
                )
            );
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Não foi possível criar seu salão.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <Brand />
            <section className="login-form-wrap register-wrap">
                <form className="login-card register-card" onSubmit={submit}>
                    <AppLogo size="sm" className="mobile-logo" />
                    <button type="button" className="back-link mono" onClick={onBack}>
                        <ArrowLeft size={13} /> VOLTAR PARA LOGIN
                    </button>

                    <div className="tag">
                        <i />
                        <span className="mono">NOVA INSTÂNCIA</span>
                    </div>
                    <h2>Configure seu Salão</h2>
                    <p className="login-card-subtitle">
                        Preencha as informações para inicializar seu ambiente de trabalho.
                    </p>

                    <div className="form-grid">
                        <label className="input-group">
                            <span className="form-label mono">NOME DO SALÃO</span>
                            <input
                                value={salonName}
                                onChange={(event) => updateSalonName(event.target.value)}
                                placeholder="ex: Studio Aurora"
                                maxLength={120}
                                required
                            />
                        </label>
                        <label className="input-group">
                            <span className="form-label mono">SEU NOME</span>
                            <input
                                value={ownerName}
                                onChange={(event) => setOwnerName(event.target.value)}
                                placeholder="Nome do proprietário"
                                maxLength={120}
                                required
                            />
                        </label>
                    </div>

                    <label className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="form-label mono">ENDEREÇO DO SALÃO</span>
                            <span className="optional mono">IDENTIFICADOR ÚNICO</span>
                        </div>
                        <input
                            value={slug}
                            onChange={(event) => setSlug(slugify(event.target.value))}
                            placeholder="studio-aurora"
                            maxLength={80}
                            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                            required
                        />
                        <span className="slug-preview mono">
                            URL: tesoura.app/<strong>{slug || 'seu-salao'}</strong>
                        </span>
                    </label>

                    <div className="form-grid">
                        <label className="input-group">
                            <span className="form-label mono">E-MAIL COMERCIAL</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="contato@seusalao.com"
                                required
                            />
                        </label>
                        <label className="input-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="form-label mono">TELEFONE</span>
                                <span className="optional mono">OPCIONAL</span>
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(formatPhone(event.target.value))}
                                placeholder="(85) 99999-9999"
                                maxLength={15}
                            />
                        </label>
                    </div>

                    <div className="form-grid">
                        <label className="input-group">
                            <span className="form-label mono">SENHA DE ACESSO</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                minLength={8}
                                maxLength={80}
                                required
                            />
                        </label>
                        <label className="input-group">
                            <span className="form-label mono">CONFIRMAR SENHA</span>
                            <input
                                type="password"
                                value={confirmation}
                                onChange={(event) => setConfirmation(event.target.value)}
                                placeholder="Repita a senha"
                                minLength={8}
                                maxLength={80}
                                required
                            />
                        </label>
                    </div>

                    {error && <p className="form-error mono">{error}</p>}

                    <button className="btn primary wide" disabled={loading}>
                        {loading ? 'Inicializando salão...' : 'Criar meu salão'}
                        {!loading && <ArrowRight size={15} />}
                    </button>

                    <div className="auth-footer mono">
                        <span>Já possui um salão registrado?</span>
                        <button type="button" className="auth-link" onClick={onBack}>
                            Acessar conta →
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
