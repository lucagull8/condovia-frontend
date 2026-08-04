import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 -3.5 147 147" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve">
      <path fill="#312C29" d="M1,61 C1,40.7 1,20.8 1,1 C50,1 99,1 148,1 C148,47.7 148,94.3 148,141 C99,141 50,141 1,141 C1,114.5 1,88 1,61 M91.7,82.1 C91.6,96.3 91.6,110.6 91.4,125.3 C91.5,125.9 91.6,126.5 92.3,127.7 C99.2,125.6 106.1,123.4 113.7,121.2 C117.6,118.5 123.4,117.4 124.1,111.8 C123.7,111.4 123.3,111 122.9,110.6 C119.7,112.5 116.4,114.4 113.1,115.3 C113.1,105 113.1,94.7 113,84.4 C112.9,82.8 112.9,80.5 111.9,79.8 C105.5,75.4 98.9,71.3 91.1,66.3 C91.1,71.8 91.1,75.9 91.2,80.4 C91.3,80.7 91.5,80.9 91.7,82.1 M26.8,62.8 C26.8,66.8 26.9,70.9 26.9,75.8 C28.7,90.8 35.4,103.2 47.1,113.6 C48.1,114.3 49,115 50.4,116.3 C60.7,124 72.3,127.9 85.3,128.2 C85.3,97.8 85.3,67.9 85.3,37.2 C78.5,42 72.6,46.5 66.3,50.5 C63.2,52.4 62.5,54.6 62.5,57.8 C62.6,75.1 62.5,92.5 62.5,109.8 C62.5,111.2 62.3,112.6 62.2,114.6 C45.9,104.9 36.5,91.4 34.9,73.3 C33.2,54.2 40.4,38.5 55.9,27 C66.7,18.9 79.1,17.5 92.5,19.2 C93,19.3 93.5,19.4 94.7,19.8 C100.5,22.9 106.5,25.8 112.2,29.1 C114.7,30.6 117.2,32.7 119.6,29.8 C122.2,26.7 119.3,24.6 117.1,22.9 C99.6,8.8 80.3,6.1 60.1,15.6 C40.7,24.7 29.4,40.4 26.8,62.8 z"/>
      <path fill="#F9F7F6" d="M46.9,113 C35.4,103.2 28.7,90.8 27.2,75.1 C27.4,70.2 27.2,66.1 27.1,62 C29.4,40.4 40.7,24.7 60.1,15.6 C80.3,6.1 99.6,8.8 117.1,22.9 C119.3,24.6 122.2,26.7 119.6,29.8 C117.2,32.7 114.7,30.6 112.2,29.1 C106.5,25.8 100.5,22.9 94.3,19.4 C93.3,19 92.6,18.9 92,18.9 C79.1,17.5 66.7,18.9 55.9,27 C40.4,38.5 33.2,54.2 34.9,73.3 C36.5,91.4 45.9,104.9 62.2,114.6 C62.3,112.6 62.5,111.2 62.5,109.8 C62.5,92.5 62.6,75.1 62.5,57.8 C62.5,54.6 63.2,52.4 66.3,50.5 C72.6,46.5 78.5,42 85.3,37.2 C85.3,67.9 85.3,97.8 85.3,128.2 C72.3,127.9 60.7,124 50.2,115.6 C48.9,114.4 47.9,113.7 46.9,113 z"/>
      <path fill="#B06D30" d="M91.1,79.9 C91.1,75.9 91.1,71.8 91.1,66.3 C98.9,71.3 105.5,75.4 111.9,79.8 C112.9,80.5 112.9,82.8 113,84.4 C113.1,94.7 113.1,105 113.1,116.2 C113,118.5 113,119.9 113,121.3 C106.1,123.4 99.2,125.6 92,127 C91.8,125.9 91.7,125.4 91.6,124.9 C91.6,110.6 91.7,96.3 91.7,81.4 C91.6,80.3 91.4,80.1 91.1,79.9 z"/>
      <path fill="#E7E3E1" d="M113.4,121.3 C113,119.9 113,118.5 113.1,116.6 C116.4,114.4 119.7,112.5 122.9,110.6 C123.3,111 123.7,111.4 124.1,111.8 C123.4,117.4 117.6,118.5 113.4,121.3 z"/>
    </svg>
  );
}

export function Header({ isPublic = false }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { utente, logout } = useAuth();
  const initials = utente ? `${utente.nome?.[0] ?? ''}${utente.cognome?.[0] ?? ''}`.toUpperCase() : '';
  const displayName = utente ? `${utente.nome} ${utente.cognome?.[0]}.` : '';
  const doLogout = () => { logout(); nav('/'); };
  const NAV = [{ label: 'Home', to: '/home' }, { label: 'Wallet', to: '/wallet' }, { label: 'Scadenze', to: '/scadenze' }];
  return (
    <>
      <style>{`
        .hdr-nav{display:flex}
        .hdr-search{display:flex}
        .hdr-name{display:flex}
        .hdr-logout{display:flex}
        .mob-tab-bar{display:none}
        .hdr-page-pad{}
        @media(max-width:640px){
          .hdr-nav{display:none !important}
          .hdr-search{display:none !important}
          .hdr-name{display:none !important}
          .mob-tab-bar{display:flex !important}
          .hdr-page-pad{padding-bottom:64px}
        }
      `}</style>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,247,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 60 }}>
        <Link to={isPublic ? '/' : '/home'} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <LogoMark size={28} />
          <span style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500 }}>CONDOVIA</span>
        </Link>
        {!isPublic && <nav className="hdr-nav" style={{ alignItems: 'center', gap: 4, marginLeft: 8 }}>
          {NAV.map(({ label, to }) => {
            const a = loc.pathname === to;
            return <Link key={to} to={to} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 13.5, fontWeight: a ? 600 : 500, color: a ? 'var(--copper-dark)' : 'var(--ink-soft)', background: a ? 'var(--copper-50)' : 'transparent' }}>{label}</Link>;
          })}
        </nav>}
        <div className="hdr-search" style={{ flex: 1, maxWidth: 360, margin: '0 auto', position: 'relative', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
          <input type="search" placeholder="Cerca servizi…" style={{ width: '100%', height: 34, paddingLeft: 32, paddingRight: 12, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', fontSize: 13, color: 'var(--ink)', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          {isPublic ? <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 10, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 13.5, fontWeight: 600 }}>Login →</Link> : <>
            <Link to="/profilo" className="hdr-name" style={{ alignItems: 'center', gap: 7, padding: '4px 10px 4px 4px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#d4915a,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{initials}</div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{displayName}</span>
            </Link>
            <button onClick={doLogout} title="Esci" style={{ width: 34, height: 34, borderRadius: 8, border: 0, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}><LogOut size={15} /></button>
          </>}
        </div>
      </header>
      {!isPublic && (
        <nav className="mob-tab-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, height: 64, background: 'rgba(250,250,247,.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)', alignItems: 'stretch', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {[...NAV, { label: 'Profilo', to: '/profilo' }].map(({ label, to }) => {
            const a = loc.pathname === to;
            return (
              <Link key={to} to={to} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: 10, fontWeight: a ? 700 : 500, color: a ? 'var(--copper-dark)' : 'var(--ink-soft)', textDecoration: 'none', paddingTop: 4 }}>
                <span style={{ width: 36, height: 3, borderRadius: 2, background: a ? 'var(--copper)' : 'transparent', marginBottom: 1 }} />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LogoMark size={20} />
        <span style={{ fontFamily: 'Fraunces', fontSize: 14, fontWeight: 500 }}>CONDOVIA</span>
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
      <div style={{ width: 36, height: 36, margin: '0 auto 12px', animation: 'pulse 1.4s ease-in-out infinite', color: '#b87333' }}><LogoMark size={36} /></div>
      <style>{`@keyframes pulse{0%,100%{opacity:.4;transform:scale(.95)}50%{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Caricamento…</div>
    </div>
  </div>;
}

export function PasswordInput({ value, onChange, placeholder = '••••••••', style = {}, inputStyle = {} }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: '100%', paddingRight: 40, boxSizing: 'border-box', ...inputStyle }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 0, cursor: 'pointer', padding: 4, color: 'inherit', opacity: 0.5, display: 'flex', alignItems: 'center' }}
        tabIndex={-1}
        aria-label={show ? 'Nascondi password' : 'Mostra password'}
      >
        {show
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  );
}

export function Toggle({ on, onChange }) {
  return <button onClick={() => onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, border: 0, background: on ? 'var(--copper)' : '#d0cac2', position: 'relative', flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s' }} />
  </button>;
}
