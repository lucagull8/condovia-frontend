import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, TrendingUp, Inbox, Receipt, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { boGetDashboard } from '../../api';

const NAV = [
  { label: 'Dashboard', to: '/backoffice', icon: LayoutDashboard },
  { label: 'Amministratori', to: '/backoffice/amministratori', icon: Users },
  { label: 'Contratti', to: '/backoffice/contratti', icon: FileText },
  { label: 'Margini', to: '/backoffice/margini', icon: TrendingUp },
  { label: 'Richieste', to: '/backoffice/richieste', icon: Inbox },
  { label: 'Fatturazione', to: '/backoffice/fatturazione', icon: Receipt },
  { label: 'Iscrizioni', to: '/backoffice/iscrizioni', icon: UserPlus },
];

export default function BackofficeLayout({ children }) {
  const path = useLocation().pathname;
  const nav = useNavigate();
  const { utente, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState({ richieste: 0, iscrizioni: 0, wallet: 0 });
  const doLogout = () => { logout(); nav('/backoffice/login'); };
  const displayName = utente ? `${utente.nome} ${utente.cognome}` : 'Commerciale';

  useEffect(() => {
    boGetDashboard().then(d => setBadges({ richieste: d.richiesteInAttesa || 0, iscrizioni: d.iscrizioniPending || 0, wallet: d.richiesteWalletPending || 0 })).catch(() => {});
  }, [path]);

  const getBadge = (to) => {
    if (to === '/backoffice/richieste') return badges.richieste;
    if (to === '/backoffice/iscrizioni') return badges.iscrizioni;
    if (to === '/backoffice/amministratori') return badges.wallet;
    return 0;
  };

  const sidebar = (
    <>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(155deg,#d4915a,#b87333,#6e3e15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 16 }}>c</div>
          <span style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500, color: '#f5ece0' }}>condovia</span>
          <button onClick={() => setOpen(false)} className="bo-close" style={{ display: 'none', marginLeft: 'auto', background: 'transparent', border: 0, color: 'rgba(245,236,224,.6)' }}><X size={18} /></button>
        </div>
        <div style={{ marginTop: 6, marginLeft: 36, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4915a' }}>Backoffice</div>
      </div>
      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,.06)' }} />
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ label, to, icon: I }) => {
          const active = path === to || (to !== '/backoffice' && path.startsWith(to));
          const badge = getBadge(to);
          return (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13.5, fontWeight: active ? 600 : 400, color: active ? '#f5ece0' : 'rgba(245,236,224,.55)', background: active ? 'linear-gradient(90deg,rgba(184,115,51,.22),rgba(184,115,51,.06))' : 'transparent', borderLeft: active ? '2px solid var(--copper)' : '2px solid transparent' }}>
              <I size={15} /><span style={{ flex: 1 }}>{label}</span>
              {badge > 0 && <span style={{ background: '#a55339', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '1px 5px', lineHeight: 1.4 }}>{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div style={{ margin: '8px 12px 16px', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#d4915a,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{utente ? `${utente.nome?.[0] || ''}${utente.cognome?.[0] || ''}` : 'CO'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f5ece0' }}>{displayName}</div>
          <div style={{ fontSize: 11, color: 'rgba(245,236,224,.5)' }}>Commerciale</div>
        </div>
        <button onClick={doLogout} style={{ background: 'transparent', border: 0, padding: 0 }}><LogOut size={14} color="rgba(245,236,224,.4)" /></button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @media(max-width:768px){
          .bo-sidebar{display:none !important}
          .bo-overlay{display:block !important}
          .bo-topbar{display:flex !important}
          .bo-close{display:block !important}
          .bo-drawer{display:flex !important}
          .bo-main{margin-left:0 !important}
        }
      `}</style>
      {/* Desktop sidebar */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside className="bo-sidebar" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', background: 'linear-gradient(180deg,#2e2620,#1b1714)', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,.06)' }}>
          {sidebar}
        </aside>
        {/* Mobile topbar */}
        <div className="bo-topbar" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 56, background: 'linear-gradient(180deg,#2e2620,#1b1714)', alignItems: 'center', padding: '0 16px', gap: 12, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={() => setOpen(true)} style={{ background: 'transparent', border: 0, color: '#f5ece0' }}><Menu size={22} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(155deg,#d4915a,#b87333,#6e3e15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 13 }}>c</div>
            <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, color: '#f5ece0' }}>condovia</span>
          </div>
        </div>
        {/* Mobile drawer overlay */}
        {open && <div className="bo-overlay" style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.5)' }} onClick={() => setOpen(false)} />}
        {/* Mobile drawer */}
        {open && <aside className="bo-drawer" style={{ display: 'none', position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, zIndex: 201, background: 'linear-gradient(180deg,#2e2620,#1b1714)', flexDirection: 'column' }}>{sidebar}</aside>}
        <main className="bo-main" style={{ flex: 1, background: '#f7f7f5', minHeight: '100vh', overflow: 'auto', paddingTop: 0 }}>{children}</main>
      </div>
    </>
  );
}
