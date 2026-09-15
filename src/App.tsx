import { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Shell } from './components/layout/Shell';
import type { LoginResponse } from './types/api';
import type { View } from './types/view';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('tesoura_token'));
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [view, setView] = useState<View>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
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
    onLogout={() => { localStorage.removeItem('tesoura_token'); setToken(null) }}
  />
}
