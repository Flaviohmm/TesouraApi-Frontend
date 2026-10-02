import { useState, type FormEvent } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { AppLogo } from '../ui/AppLogo';
import { api } from '../../services/api';
import type { LoginResponse } from '../../types/api';
import { Brand } from './Brand';

export function Login({ onLogin, onRegister }: {
    onLogin: (data: LoginResponse) => void;
    onRegister: () => void;
}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            onLogin(
                await api<LoginResponse>(
                    '/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                })
            );
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Erro ao autenticar no sistema.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <Brand />
            <section className="login-form-wrap">
                <form className="login-card" onSubmit={submit}>
                    <AppLogo size="sm" className="mobile-logo" />
                    <div className="tag">
                        <i />
                        <span className="mono">AUTENTICAÇÃO SEGURA</span>
                    </div>
                    <h2>Acesso ao Workbench</h2>
                    <p className="login-card-subtitle">
                        Insira suas credenciais para acessar os módulos do seu salão.
                    </p>

                    <label className="input-group">
                        <span className="form-label mono">
                            <Mail size={12} /> E-MAIL
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="voce@seusalao.com"
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
                            placeholder="••••••••••••"
                            required
                        />
                    </label>

                    {error && <p className="form-error mono">{error}</p>}

                    <button className="btn primary wide" disabled={loading}>
                        {loading ? 'Validando acesso...' : 'Entrar no Tesoura'}
                        {!loading && <ArrowRight size={15} />}
                    </button>

                    <div className="auth-footer mono">
                        <span>Ainda não possui conta?</span>
                        <button type="button" className="auth-link" onClick={onRegister}>
                            Criar novo salão →
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
