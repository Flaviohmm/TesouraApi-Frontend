import { CalendarDays, LayoutDashboard, LogOut, Menu, Search, Settings, UserCog, Users } from 'lucide-react';
import type { View } from '../../types/view';
import { initial } from '../../utils/format';
import { Agenda } from '../agenda/Agenda';
import { Clients } from '../clients/Clients';
import { Dashboard } from '../dashboard/Dashboard';
import { Professionals } from '../professionals/Professionals';
import { Services } from '../services/Services';
import { AppLogo } from '../ui/AppLogo';
import { ScissorsIcon } from '../ui/ScissorsIcon';

const nav = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'services', label: 'Serviços', icon: ScissorsIcon },
    { id: 'professionals', label: 'Profissionais', icon: UserCog }
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
        agenda: 'Agenda de Atendimentos',
        clients: 'Diretório de Clientes',
        services: 'Catálogo de Serviços',
        professionals: 'Equipe de Profissionais'
    };

    const formattedDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    return (
        <div className="app-shell">
            {/* Ambient Background Noise & Refraction */}
            <div id="grain" aria-hidden="true" />

            {/* Sidebar */}
            <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="sidebar-top">
                    <AppLogo size="sm" className="logo" />
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group-label mono">MÓDULOS</div>
                    {nav.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`nav-item ${view === id ? 'active' : ''}`}
                            onClick={() => { setView(id); setMenuOpen(false) }}
                        >
                            <span className="nav-ind" aria-hidden="true" />
                            <Icon size={18} className="nav-icon" />
                            <span className="nav-label">{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button className="nav-item action-item">
                        <Settings size={18} className="nav-icon" />
                        <span className="nav-label">Configurações</span>
                    </button>
                    <button className="nav-item action-item" onClick={onLogout}>
                        <LogOut size={18} className="nav-icon" />
                        <span className="nav-label">Sair</span>
                    </button>
                    <div className="account">
                        <div className="avatar-chip">{initial(name)}</div>
                        <div className="account-info">
                            <b className="account-name">{name}</b>
                            <small className="account-role mono">ADMINISTRADOR</small>
                        </div>
                    </div>
                </div>
            </aside>

            {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

            {/* Main Content Area */}
            <main className="workspace">
                <header className="workspace-header">
                    <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
                        <Menu size={20} />
                    </button>
                    <div className="workspace-title-block">
                        <div className="tag">
                            <i />
                            <span className="mono">{formattedDate}</span>
                        </div>
                        <h1>{titles[view]}</h1>
                    </div>
                    <div className="header-actions">
                        <div className="system-pill mono">
                            <i className="status-live-dot" />
                            <span>WORKBENCH ATIVO</span>
                        </div>
                        <button className="icon-button" aria-label="Buscar">
                            <Search size={18} />
                        </button>
                    </div>
                </header>

                <div className="workspace-body">
                    {view === 'dashboard' && <Dashboard setView={setView} />}
                    {view === 'agenda' && <Agenda />}
                    {view === 'clients' && <Clients />}
                    {view === 'services' && <Services />}
                    {view === 'professionals' && <Professionals />}
                </div>
            </main>
        </div>
    );
}
