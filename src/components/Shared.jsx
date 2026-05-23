import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header({ isPublic = false }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { utente, logout } = useAuth();
  const initials = utente ? `${utente.nome?.[0] ?? ''}${utente.cognome?.[0] ?? ''}`.toUpperCase() : '';
  const displayName = utente ? `${utente.nome} ${utente.cognome?.[0]}.` : '';
  const doLogout = () => { logout(); nav('/'); };
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,247,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 60 }}>
      <Link to={isPublic ? '/' : '/home'} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(155deg,#d4915a 0%,#b87333 50%,#6e3e15 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 16 }}>c</div>
        <span style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500 }}>condovia</span>
      </Link>
      {!isPublic && <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
        {[{ label: 'Home', to: '/home' }, { label: 'Wallet', to: '/wallet' }, { label: 'Scadenze', to: '/scadenze' }].map(({ label, to }) => {
          const a = loc.pathname === to;
          return <Link key={to} to={to} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 13.5, fontWeight: a ? 600 : 500, color: a ? 'var(--copper-dark)' : 'var(--ink-soft)', background: a ? 'var(--copper-50)' : 'transparent' }}>{label}</Link>;
        })}
      </nav>}
      <div style={{ flex: 1, maxWidth: 360, margin: '0 auto', position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
        <input type="search" placeholder="Cerca servizi…" style={{ width: '100%', height: 34, paddingLeft: 32, paddingRight: 12, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', fontSize: 13, color: 'var(--ink)', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        {isPublic ? <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 10, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 13.5, fontWeight: 600 }}>Login →</Link> : <>
          <Link to="/profilo" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 10px 4px 4px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#d4915a,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{initials}</div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{displayName}</span>
          </Link>
          <button onClick={doLogout} title="Esci" style={{ width: 34, height: 34, borderRadius: 8, border: 0, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}><LogOut size={15} /></button>
        </>}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(155deg,#d4915a 0%,#b87333 50%,#6e3e15 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 12 }}>c</div>
        <span style={{ fontFamily: 'Fraunces', fontSize: 14, fontWeight: 500 }}>condovia</span>
      </div>
      <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>© 2026 Condovia. Tutti i diritti riservati.</span>
    </footer>
  );
}

const BS = { attivo: { background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid #c8dbc8' }, scadenza: { background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid #e8b8a8' }, rame: { background: 'var(--copper-50)', color: 'var(--copper-dark)', border: '1px solid var(--copper-100)' }, grigio: { background: '#f1f0ee', color: 'var(--ink-soft)', border: '1px solid var(--border)' }, orange: { background: '#fef3e2', color: '#c2600a', border: '1px solid #f9d5a0' } };
export function Badge({ variant = 'grigio', dot, children, style }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6, ...BS[variant] || BS.grigio, ...style }}>
    {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />}{children}
  </span>;
}

export function LoadingScreen() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(155deg,#d4915a,#b87333,#6e3e15)', margin: '0 auto 12px', animation: 'pulse 1.4s ease-in-out infinite' }} />
      <style>{`@keyframes pulse{0%,100%{opacity:.4;transform:scale(.95)}50%{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Caricamento…</div>
    </div>
  </div>;
}

export function Toggle({ on, onChange }) {
  return <button onClick={() => onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, border: 0, background: on ? 'var(--copper)' : '#d0cac2', position: 'relative', flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s' }} />
  </button>;
}
