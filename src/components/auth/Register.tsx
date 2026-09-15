import { useState, type FormEvent } from 'react';
import { api } from '../../services/api';
import type { LoginResponse } from '../../types/api';
import { slugify } from '../../utils/format';
import { Brand } from './Brand';
import { Scissors } from 'lucide-react';

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
        if (password !== confirmation)
            return setError('As senhas não coincidem.');
        try {
            onLogin(
                await api<LoginResponse>(
                    '/api/auth/register',
                    {
                        method: 'POST',
                        body: JSON.stringify({ salonName, slug, ownerName, email, password, phone: phone || undefined })
                    }
                )
            )
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
                <form className="login-card register-card font-medium" onSubmit={submit}>
                    <div className='mobile-logo'>
                        <Scissors size={22} /> Tesoura
                    </div>
                    <button type="button" className="back-button font-medium" onClick={onBack}>
                        ← Voltar para entrar
                    </button>
                    <p className="eyebrow">COMECE AGORA</p>
                    <h2>Crie seu salão</h2>
                    <div className="form-grid">
                        <label>
                            Nome do salão
                            <input
                                value={salonName}
                                onChange={(event) => updateSalonName(event.target.value)}
                                placeholder='Studio Aurora'
                                maxLength={120}
                                required
                            />
                        </label>
                        <label>
                            Seu nome
                            <input
                                value={ownerName}
                                onChange={(event) => setOwnerName(event.target.value)}
                                placeholder='Como quer ser chamado?'
                                maxLength={120}
                                required
                            />
                        </label>
                    </div>
                    <label>
                        Endereço do salão
                        <input
                            value={slug}
                            onChange={(event) => setSlug(slugify(event.target.value))}
                            placeholder='studio-aurora'
                            maxLength={80}
                            pattern='[a-z0-9]+(?:-[a-z0-9]+)*'
                            required
                        />
                        <small>tesoura.app/{slug || 'seu-salao'}</small>
                    </label>
                    <div className='form-grid'>
                        <label>
                            E-mail
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder='voce@seusalao.com'
                                required
                            />
                        </label>
                        <label>
                            Telefone
                            <span className='optional'>opcional</span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder='(85) 99999-9999'
                                maxLength={20}
                            />
                        </label>
                    </div>
                    <div className="form-grid">
                        <label>Senha
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder='Minimo de 8 caracteres'
                                minLength={8}
                                maxLength={80}
                                required
                            />
                        </label>
                        <label>Confirmar senha
                            <input
                                type="password"
                                value={confirmation}
                                onChange={(event) => setConfirmation(event.target.value)}
                                placeholder='Repita sua senha'
                                minLength={8}
                                maxLength={80}
                                required
                            />
                        </label>
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button className="button primary wide font-medium" disabled={loading}>
                        {loading ? 'Criando seu salão...' : 'Criar meu salão'}
                    </button>
                    <p className='hint'>Já tem uma conta?
                        <button type='button' className='inline-button font-medium ml-0.5' onClick={onBack}>
                            Entrar
                        </button>
                    </p>
                </form>
            </section>
        </main>
    );
}
