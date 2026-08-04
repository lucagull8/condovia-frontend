import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 -3.5 147 147" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Same paths as brand SVG — ring+building filled with currentColor (dark on light bg, white on dark bg) */}
      <path fill="currentColor" d="M46.888615,113.043755 C35.377499,103.245377 28.724243,90.837219 27.207577,75.087051 C27.374397,70.235420 27.232773,66.131973 27.091148,62.028534 C29.418417,40.363899 40.688808,24.714464 60.134785,15.573214 C80.347313,6.071624 99.603355,8.842381 117.087883,22.868534 C119.264725,24.614809 122.159164,26.671595 119.578560,29.787558 C117.197136,32.663010 114.749374,30.605453 112.165756,29.090273 C106.483261,25.757730 100.523254,22.898380 94.274765,19.413412 C93.258774,18.954529 92.644554,18.928118 92.030327,18.901707 C79.084793,17.492237 66.713715,18.935854 55.934681,26.950373 C40.410549,38.493011 33.161388,54.152794 34.885693,73.333351 C36.512165,91.425728 45.941841,104.902603 62.200542,114.647064 C62.340328,112.551613 62.511974,111.157616 62.514385,109.763329 C62.544350,92.452461 62.614117,75.141144 62.504478,57.831009 C62.483719,54.553699 63.233620,52.406696 66.252792,50.510975 C72.562767,46.548965 78.502960,41.998039 85.287979,37.198902 C85.287979,67.914391 85.287979,97.832405 85.287979,128.169296 C72.262299,127.856140 60.687920,124.044075 50.192696,115.649170 C48.939365,114.361511 47.913990,113.702637 46.888615,113.043755 z"/>
      {/* White interior of building — painted over the currentColor fill to keep building white */}
      <rect x="64" y="39" width="20" height="88" fill="white"/>
      <path fill="#B06D30" d="M91.122421,79.901169 C91.122421,75.861290 91.122421,71.821411 91.122421,66.279671 C98.872757,71.265594 105.507935,75.366936 111.895523,79.823166 C112.856537,80.493591 112.937241,82.818947 112.955330,84.384201 C113.074257,94.673058 113.064262,104.963417 113.074005,116.158829 C113.029106,118.481369 113.006531,119.898369 112.983948,121.315361 C106.073250,123.433090 99.162560,125.550827 92.041809,127.018799 C91.757210,125.875824 91.682671,125.382607 91.608131,124.889389 C91.646477,110.611374 91.684830,96.333359 91.717133,81.353439 C91.601143,80.333733 91.404922,80.083611 91.122421,79.901169 z"/>
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
