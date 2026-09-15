import { useState, type FormEvent } from 'react';
import { Scissors } from 'lucide-react';
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
            )
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Erro ao entrar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page">
            <Brand />
            <section className="login-form-wrap">
                <form className="login-card font-medium" onSubmit={submit}>
                    <div className="mobile-logo">
                        <Scissors size={22} /> Tesoura
                    </div>
                    <p className="eyebrow">BEM-VINDO DE VOLTA</p>
                    <h2>Entre na sua conta</h2>
                    <label>
                        E-mail
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="voce@seusalao.com"
                            required
                        />
                    </label>
                    <label>
                        Senha
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Sua senha"
                            required
                        />
                    </label>
                    {error && <p className="form-error">{error}</p>}
                    <button className="button primary wide font-medium" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar no Tesoura'}
                    </button>
                    <p className="hint">Ainda não tem uma conta?
                        <button type="button" className="inline-button font-medium ml-0.5" onClick={onRegister}>
                            Crie seu salão
                        </button>
                    </p>
                </form>
            </section>
        </main>
    );
}
