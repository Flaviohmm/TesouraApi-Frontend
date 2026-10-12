import { useState, type FormEvent } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { AppLogo } from '../components/ui/AppLogo';
import { formatPhone } from '../utils/format';
import type { CustomerLoginResponse } from '../types/customer';
import { customerApi } from './customerApi';
import { CustomerBrand } from './CustomerBrand';

export function CustomerAuthScreen({ mode, onAuth, onSwitch }: {
    mode: 'login' | 'register';
    onAuth: (data: CustomerLoginResponse) => void;
    onSwitch: (mode: 'login' | 'register') => void;
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = mode === 'login'
                ? await customerApi<CustomerLoginResponse>('/api/customer-auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                })
                : await customerApi<CustomerLoginResponse>('/api/customer-auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password, phone })
                });
            onAuth(data);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Não foi possível autenticar.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <CustomerBrand />
            <section className="login-form-wrap">
                <form className="login-card" onSubmit={submit}>
                    <AppLogo size="sm" className="mobile-logo" />
                    <div className="tag">
                        <i />
                        <span className="mono">{mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}</span>
                    </div>
                    <h2>{mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}</h2>
                    <p className="login-card-subtitle">
                        {mode === 'login'
                            ? 'Entre para agendar e acompanhar suas reservas em qualquer salão parceiro.'
                            : 'Uma conta só, válida em todos os salões parceiros.'}
                    </p>

                    {mode === 'register' && (
                        <div className="form-grid">
                            <label className="input-group">
                                <span className="form-label mono">NOME COMPLETO</span>
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Seu nome"
                                    maxLength={120}
                                    required
                                />
                            </label>
                            <label className="input-group">
                                <span className="form-label mono">TELEFONE</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                                    placeholder="(85) 99999-9999"
                                    maxLength={15}
                                    required
                                />
                            </label>
                        </div>
                    )}

                    <label className="input-group">
                        <span className="form-label mono">
                            <Mail size={12} /> E-MAIL
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="voce@email.com"
                            required
                        />
                    </label>

                    <label className="input-group">
                        <span className="form-label mono">
                            <Lock size={12} /> SENHA
                        </span>
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

                    {error && <p className="form-error mono">{error}</p>}

                    <button className="btn primary wide" disabled={loading}>
                        {loading ? 'Validando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
                        {!loading && <ArrowRight size={15} />}
                    </button>

                    <div className="auth-footer mono">
                        <span>{mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}</span>
                        <button type="button" className="auth-link" onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')}>
                            {mode === 'login' ? 'Criar conta →' : 'Entrar →'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
