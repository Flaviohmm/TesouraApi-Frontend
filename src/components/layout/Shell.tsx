import { CalendarDays, LayoutDashboard, LogOut, Menu, Scissors, Search, Settings, Users } from 'lucide-react';
import type { View } from '../../types/view';
import { initial } from '../../utils/format';
import { Agenda } from '../agenda/Agenda';
import { Clients } from '../clients/Clients';
import { Dashboard } from '../dashboard/Dashboard';
import { Services } from '../services/Services';

const nav = [
    { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'services', label: 'Serviços', icon: Scissors }
] as const;

export function Shell({ view, setView, menuOpen, setMenuOpen, onLogout }: {
    view: View;
    setView: (view: View) => void;
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    onLogout: () => void;
}) {
    const name = localStorage.getItem('tesoura_name') || 'Meu salão';
    const titles: Record<View, string> = {
        dashboard: `Olá, ${name.split(' ')[0]}`,
        agenda: 'Sua agenda',
        clients: 'Seus clientes',
        services: 'Catálogo de serviços'
    };

    return (
        <div className="app-shell">
            <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="logo">
                    <span>
                        <Scissors size={21} />
                    </span>tesoura</div>
                <nav>
                    {nav.map(({ id, label, icon: Icon }) =>
                        <button
                            key={id}
                            className={view === id ? 'active' : ''}
                            onClick={() => { setView(id); setMenuOpen(false) }}
                        >
                            <Icon size={19} />
                            {label}
                        </button>
                    )}
                </nav>
                <div className="sidebar-bottom">
                    <button>
                        <Settings size={19} />Configurações
                    </button>
                    <button onClick={onLogout}>
                        <LogOut size={19} />Sair
                    </button>
                    <div className="account">
                        <div>{initial(name)}</div>
                        <span>
                            <b>{name}</b>
                            <small>Administrador</small>
                        </span>
                    </div>
                </div>
            </aside>
            {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
            <main className="workspace">
                <header>
                    <button className="mobile-menu" onClick={() => setMenuOpen(true)}>
                        <Menu />
                    </button>
                    <div>
                        <p className="eyebrow">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <h1>{titles[view]}</h1>
                    </div>
                    <button className="icon-button">
                        <Search size={21} />
                    </button>
                </header>
                {view === 'dashboard' && <Dashboard setView={setView} />}
                {view === 'agenda' && <Agenda />}
                {view === 'clients' && <Clients />}
                {view === 'services' && <Services />}
            </main>
        </div>
    );
}
