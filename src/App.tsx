import { useState, type FormEvent } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, LayoutDashboard, LogOut, Menu, Plus, Scissors, Search, Settings, Sparkles, Users } from 'lucide-react'
import { api } from './services/api'
import { useData } from './hooks/use-data'
import type { Appointment, Client, HairService, LoginResponse, Professional } from './types/api'
import { formatTime, initial, money, slugify } from './utils/format'

type View = 'dashboard' | 'agenda' | 'clients' | 'services'
const nav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'services', label: 'Serviços', icon: Scissors },
]

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('tesoura_token'))
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login')
  const [view, setView] = useState<View>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const onAuth = (data: LoginResponse) => {
    localStorage.setItem('tesoura_token', data.accessToken);
    localStorage.setItem('tesoura_name', data.name);
    setToken(data.accessToken);
  }
  if (!token)
    return authScreen === 'login' ?
      <Login onLogin={onAuth} onRegister={() => setAuthScreen('register')} /> :
      <Register onLogin={onAuth} onBack={() => setAuthScreen('login')} />

  return <Shell
    view={view}
    setView={setView}
    menuOpen={menuOpen}
    setMenuOpen={setMenuOpen}
    onLogout={() => {
      localStorage.removeItem('tesoura_token'); setToken(null)
    }}
  />
}

function Login({ onLogin, onRegister }: { onLogin: (data: LoginResponse) => void; onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }
  return <main className="login-page">
    <Brand />
    <section className="login-form-wrap">
      <form className="login-card font-medium" onSubmit={submit}>
        <div className="mobile-logo"><Scissors size={22} />
          Tesoura
        </div>
        <p className="eyebrow">BEM-VINDO DE VOLTA</p>
        <h2>Entre na sua conta</h2>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@seusalao.com" required />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary wide font-medium" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar no Tesoura'}
        </button>
        <p className="hint">Ainda não tem uma conta?
          <button type="button" className="inline-button font-medium ml-0.5" onClick={onRegister}>Crie seu salão</button>
        </p>
      </form>
    </section>
  </main>
}

function Brand() {
  return (
    <section className="login-brand">
      <div className="brand-mark">
        <Scissors size={28} />
      </div>
      <p className="eyebrow font-bold">GESTÃO INTELIGENTE</p>
      <h1>Seu salão no ritmo <em>certo.</em></h1>
      <p>Organize cada detalhe, encante em cada atendimento.</p>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
    </section>
  );
}


function Register({ onLogin, onBack }: { onLogin: (data: LoginResponse) => void; onBack: () => void }) {
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
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmation) {
      setError('As senhas não coincidem.');
      return
    };
    setLoading(true);
    setError('');
    try {
      onLogin(
        await api<LoginResponse>(
          '/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ salonName, slug, ownerName, email, password, phone: phone || undefined })
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar seu salão.')
    } finally {
      setLoading(false)
    }
  }
  return <main className="login-page">
    <Brand />
    <section className="login-form-wrap register-wrap">
      <form className="login-card register-card font-medium" onSubmit={submit}>
        <div className="mobile-logo">
          <Scissors size={22} /> Tesoura
        </div>
        <button type="button" className="back-button font-medium" onClick={onBack}>
          ← Voltar para entrar
        </button>
        <p className="eyebrow">COMECE AGORA</p>
        <h2>Crie seu salão</h2>
        <p className="form-intro">
          Seu teste grátis começa assim que sua conta for criada.
        </p>
        <div className="form-grid">
          <label>
            Nome do salão
            <input
              value={salonName}
              onChange={(e) => updateSalonName(e.target.value)}
              placeholder="Studio Aurora"
              maxLength={120}
              required
            />
          </label>
          <label>
            Seu nome
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Como quer ser chamado?"
              maxLength={120}
              required
            />
          </label>
        </div>
        <label>
          Endereço do salão
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="studio-aurora"
            maxLength={80}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
          <small>tesoura.app/{slug || 'seu-salao'}</small>
        </label>
        <div className="form-grid">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@seusalao.com"
              required
            />
          </label>
          <label>
            Telefone
            <span className="optional">opcional</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(85) 99999-9999"
              maxLength={20}
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              minLength={8}
              maxLength={80}
              required
            />
          </label>
          <label>
            Confirmar senha
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Repita sua senha"
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
        <p className="hint">Já tem uma conta?
          <button type="button" className="inline-button font-medium" onClick={onBack}>
            Entrar
          </button>
        </p>
      </form>
    </section>
  </main>
}

function Shell({
  view,
  setView,
  menuOpen,
  setMenuOpen,
  onLogout
}: {
  view: View;
  setView: (view: View) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onLogout: () => void
}) {
  const name = localStorage.getItem('tesoura_name') || 'Meu salão'
  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="logo">
        <span>
          <Scissors size={21} />
        </span>tesoura
      </div>
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
          <LogOut size={19} />
          Sair
        </button>
        <div className="account">
          <div>
            {initial(name)}
          </div>
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
          <h1>
            {({
              dashboard: 'Olá, ' + name.split(' ')[0],
              agenda: 'Sua agenda',
              clients: 'Seus clientes',
              services: 'Catálogo de serviços'
            } as Record<View, string>)[view]}
          </h1>
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
}


function Empty({ text }: { text: string }) {
  return <div className="empty">
    <Sparkles size={21} />
    <p>{text}</p>
  </div>
}

function Dashboard({ setView }: { setView: (view: View) => void }) {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 1);
  const { data: appointments, error } = useData<Appointment>(`/api/appointments?from=${from.toISOString()}&to=${to.toISOString()}`);
  const total = appointments.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  return <>
    <section className="hero">
      <div>
        <span className="hero-chip">
          <Sparkles size={15} /> EM FOCO
        </span>
        <h2>Faça o dia de hoje<br />ser <em>memorável.</em></h2>
        <p>Você tem {appointments.length} atendimentos para transformar.</p>
      </div>
      <button className="button light" onClick={() => setView('agenda')}>
        <Plus size={18} />Novo agendamento
      </button>
    </section>
    <section className="metrics">
      <Metric label="Atendimentos hoje" value={String(appointments.length).padStart(2, '0')} note="Agenda do dia" />
      <Metric label="Previsão de receita" value={money.format(total)} note="Com base nos horários" />
      <Metric label="Próximo horário" value={appointments[0] ? formatTime(appointments[0].startsAt) : '—'} note={appointments[0]?.clientName ?? 'Sem agendamentos'} />
    </section>
    <section className="content-grid">
      <div className="panel schedule">
        <div className="panel-title">
          <div>
            <p className="eyebrow">AGENDA</p>
            <h2>Próximos atendimentos</h2>
          </div>
          <button className="text-button" onClick={() => setView('agenda')}>
            Ver agenda
          </button>
        </div>
        {error ?
          <Empty text={error} /> :
          appointments.length ?
            appointments.slice(0, 4).map((a) => <AppointmentRow appointment={a} key={a.id} />) :
            <Empty text="Seu dia está livre. Que tal abrir um horário?" />
        }
      </div>

      <div className="panel pulse">
        <p className="eyebrow">RESUMO</p>
        <h2>O pulso do salão</h2>
        <div className="progress-label">
          <span>Taxa de ocupação</span>
          <b>{Math.min(appointments.length * 17, 100)}%</b>
        </div>
        <div className="progress">
          <i style={{ width: `${Math.min(appointments.length * 17, 100)}%` }} />
        </div>
        <p className="small-copy">Acompanhe a agenda e mantenha seu ritmo.</p>
        <button className="text-button" onClick={() => setView('clients')}>
          Ver clientes
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  </>
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="metric">
    <p>{label}</p>
    <h2>{value}</h2>
    <small>{note}</small>
  </article>
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return <div className="appointment-row">
    <div className="time">
      <Clock3 size={15} />
      {formatTime(appointment.startsAt)}
    </div>
    <div className="avatar">
      {initial(appointment.clientName)}
    </div>
    <div className="appointment-info">
      <b>{appointment.clientName}</b>
      <span>{appointment.services?.map((s) => s.name).join(', ') || 'Atendimento'} · {appointment.professionalName}</span>
    </div>
    <span className={`status ${appointment.status}`}>
      {appointment.status}
    </span>
  </div>
}


function Agenda() {
  const { data, error } = useData<Appointment>('/api/appointments');
  return <section className="panel page-panel">
    <div className="panel-title">
      <div>
        <p className="eyebrow">CRONOLOGIA</p>
        <h2>Todos os horários</h2>
      </div>
      <button className="button primary">
        <Plus size={18} />Agendar
      </button>
    </div>
    <div className="day-nav">
      <ChevronLeft />
      <b>Agenda de atendimentos</b>
      <ChevronRight />
    </div>
    {error ?
      <Empty text={error} /> :
      data.length ?
        data.sort((a, b) => a.startsAt.localeCompare(b.startsAt)).map((a) => <AppointmentRow appointment={a} key={a.id} />) :
        <Empty text="Nenhum agendamento encontrado." />
    }
  </section>
}

function Clients() {
  const { data, error } = useData<Client>('/api/clients');
  return <section className="panel page-panel">
    <div className="panel-title">
      <div>
        <p className="eyebrow">RELACIONAMENTO</p>
        <h2>Base de clientes</h2>
      </div>
      <button className="button primary">
        <Plus size={18} />
        Novo cliente
      </button>
    </div>
    {error ?
      <Empty text={error} /> :
      <div className="table">
        {data.length ?
          data.map((c) =>
            <div className="client-row" key={c.id}>
              <div className="avatar">
                {initial(c.name)}
              </div>
              <b>{c.name}</b>
              <span>{c.phone}</span>
              <span>{c.email || 'Sem e-mail'}</span>
              <span>{c.loyaltyPoints} pontos</span>
            </div>
          ) :
          <Empty text="Nenhum cliente cadastrado." />
        }
      </div>
    }
  </section>
}

function Services() {
  const { data, error } = useData<HairService>('/api/services');
  const { data: pros } = useData<Professional>('/api/professionals');
  return <section className="panel page-panel">
    <div className="panel-title">
      <div>
        <p className="eyebrow">CARDÁPIO</p>
        <h2>Serviços e valores</h2>
      </div>
      <button className="button primary">
        <Plus size={18} />Novo serviço
      </button>
    </div>
    {error ? <Empty text={error} /> :
      <div className="service-grid">
        {data.length ?
          data.map((s) =>
            <article className="service-card" key={s.id}>
              <div className="service-icon">
                <Scissors size={20} />
              </div>
              <span>{s.category || 'Beleza'}</span>
              <h3>{s.name}</h3>
              <p><Clock3 size={14} /> {s.durationMinutes} min</p>
              <b>{money.format(Number(s.price))}</b>
            </article>) :
          <Empty text="Nenhum serviço cadastrado." />
        }
      </div>
    }
    <p className="team-note">
      {pros.filter((p) => p.isActive).length} profissionais ativos no salão
    </p>
  </section>
}
