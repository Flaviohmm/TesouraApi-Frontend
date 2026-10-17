import { useState } from 'react';
import { CalendarCheck, LogOut, Store } from 'lucide-react';
import { AppLogo } from '../components/ui/AppLogo';
import type { CustomerLoginResponse } from '../types/customer';
import { CustomerAuthScreen } from './CustomerAuthScreen';
import { MyBookings } from './MyBookings';
import { SalonDetail } from './SalonDetail';
import { SalonDirectory } from './SalonDirectory';
import { useCustomerRoute } from './useCustomerRoute';

export function CustomerApp() {
    const [token, setToken] = useState(() => localStorage.getItem('tesoura_customer_token'));
    const [name, setName] = useState(() => localStorage.getItem('tesoura_customer_name'));
    const { screen, slug, returnTo, navigate, appointmentId, stripeReturn } = useCustomerRoute();

    const onAuth = (data: CustomerLoginResponse) => {
        localStorage.setItem('tesoura_customer_token', data.accessToken);
        localStorage.setItem('tesoura_customer_name', data.name);
        setToken(data.accessToken);
        setName(data.name);
        navigate(returnTo);
    };

    const onLogout = () => {
        localStorage.removeItem('tesoura_customer_token');
        localStorage.removeItem('tesoura_customer_name');
        setToken(null);
        setName(null);
        navigate('/descobrir');
    };

    if (screen === 'login' || screen === 'register') {
        return (
            <CustomerAuthScreen
                mode={screen}
                onAuth={onAuth}
                onSwitch={(mode) => {
                    const base = mode === 'register' ? '/descobrir/registrar' : '/descobrir/login';
                    navigate(returnTo === '/descobrir' ? base : `${base}?returnTo=${encodeURIComponent(returnTo)}`);
                }}
            />
        );
    }

    return (
        <div className="app-shell">
            <div id="grain" aria-hidden="true" />
            <main className="workspace" style={{ margin: '0 auto' }}>
                <header className="workspace-header">
                    <button type="button" className="app-logo-button" onClick={() => navigate('/descobrir')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <AppLogo size="sm" />
                    </button>
                    <div className="header-actions">
                        {token ? (
                            <>
                                <button className="btn secondary" onClick={() => navigate('/descobrir/minhas-reservas')}>
                                    <CalendarCheck size={15} /> Minhas reservas
                                </button>
                                <span className="optional mono">{name}</span>
                                <button className="icon-button" aria-label="Sair" onClick={onLogout}>
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <button className="btn primary" onClick={() => navigate('/descobrir/login')}>
                                Entrar
                            </button>
                        )}
                    </div>
                </header>

                <div className="workspace-body">
                    {screen === 'my-bookings' && (
                        token ? <MyBookings /> : <LoginPrompt onLogin={() => navigate('/descobrir/login?returnTo=/descobrir/minhas-reservas')} />
                    )}
                    {screen === 'salon' && slug && (
                        <SalonDetail
                            slug={slug}
                            loggedIn={!!token}
                            onNeedLogin={() => navigate(`/descobrir/login?returnTo=/descobrir/salao/${slug}`)}
                            onBack={() => navigate('/descobrir')}
                            onViewBookings={() => navigate('/descobrir/minhas-reservas')}
                            appointmentId={appointmentId}
                            stripeReturn={stripeReturn}
                        />
                    )}
                    {screen === 'directory' && (
                        <SalonDirectory onOpen={(salonSlug) => navigate(`/descobrir/salao/${salonSlug}`)} />
                    )}
                </div>
            </main>
        </div>
    );
}

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
    return (
        <section className="panel page-panel caustic-view-panel">
            <div className="empty" style={{ padding: '48px 0' }}>
                <div className="empty-mark"><Store size={18} /></div>
                <p className="empty-text">Entre para ver suas reservas.</p>
                <button className="btn primary" onClick={onLogin} style={{ marginTop: 12 }}>Entrar</button>
            </div>
        </section>
    );
}
