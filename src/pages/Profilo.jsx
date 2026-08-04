import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer, Badge, Toggle, PasswordInput } from '../components/Shared';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api';

export default function Profilo() {
  const { utente } = useAuth();
  const nome = utente ? `${utente.nome} ${utente.cognome}` : '';
  const init = utente ? `${utente.nome?.[0] ?? ''}${utente.cognome?.[0] ?? ''}`.toUpperCase() : '';
  const [n, setN] = useState({ scadenze: true, preventivi: true, wallet: true, newsletter: false });

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwErr, setPwErr] = useState('');
  const [pwOk, setPwOk] = useState(false);

  const handleChangePw = async (e) => {
    e.preventDefault();
    setPwErr(''); setPwOk(false);
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwErr('Compila tutti i campi.'); return; }
    if (pwForm.newPw.length < 6) { setPwErr('La nuova password deve avere almeno 6 caratteri.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwErr('Le password non coincidono.'); return; }
    setPwBusy(true);
    try {
      await changePassword(pwForm.current, pwForm.newPw);
      setPwOk(true);
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (e) { setPwErr(e.message); }
    finally { setPwBusy(false); }
  };

  const inp = { width: '100%', height: 46, borderRadius: 10, padding: '0 16px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', padding: '32px 24px 60px' }}>
        <Link to="/home" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20, display: 'inline-block' }}>← Torna alla home</Link>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(26px,6vw,48px)', margin: '0 0 32px' }}>Il tuo profilo<span style={{ color: 'var(--copper)' }}>.</span></h1>

        {/* Avatar + info */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '32px 24px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 112, height: 112, borderRadius: '50%', background: 'radial-gradient(120% 120% at 30% 20%,#d4915a,#b87333,#6e3e15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Fraunces', fontSize: 36, fontWeight: 600, boxShadow: '0 0 0 8px var(--copper-50)' }}>{init}</div>
          <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 26, margin: '0 0 4px' }}>{nome}</h2>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{utente?.studio}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{utente?.email}</div>
          <Badge variant="rame" dot>Amministratore</Badge>
        </div>

        {/* Dati studio */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: '0 0 16px' }}>Dati studio</h3>
          {[{ k: 'Studio', v: utente?.studio }, { k: 'P.IVA', v: utente?.partitaIva }, { k: 'Telefono', v: utente?.telefono }, { k: 'PEC', v: utente?.pec }].map(({ k, v }, i) =>
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{k}</span>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{v || '—'}</span>
            </div>
          )}
        </div>

        {/* Cambia password */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: '0 0 16px' }}>Cambia password</h3>
          <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={lbl}>Password attuale</label><PasswordInput value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} inputStyle={inp} /></div>
            <div><label style={lbl}>Nuova password</label><PasswordInput value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} inputStyle={inp} /></div>
            <div><label style={lbl}>Conferma nuova password</label><PasswordInput value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} inputStyle={inp} /></div>
            {pwErr && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>{pwErr}</div>}
            {pwOk && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--success-bg)', border: '1px solid #c8dbc8', color: 'var(--success)', fontSize: 13 }}>Password aggiornata con successo.</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={pwBusy} style={{ height: 44, padding: '0 24px', borderRadius: 12, border: 0, background: pwBusy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{pwBusy ? 'Salvataggio…' : 'Aggiorna password'}</button>
            </div>
          </form>
        </div>

        {/* Notifiche */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)' }}>
          <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: '0 0 16px' }}>Preferenze notifiche</h3>
          {[{ k: 'scadenze', l: 'Email scadenze', s: 'Avvisi scadenze' }, { k: 'preventivi', l: 'Nuovi preventivi', s: 'Proposte fornitori' }, { k: 'wallet', l: 'Avvisi wallet', s: 'Accrediti e trasferimenti' }, { k: 'newsletter', l: 'Newsletter', s: 'Novità piattaforma' }].map(({ k, l, s }, i) =>
            <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>{l}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{s}</div></div>
              <Toggle on={n[k]} onChange={v => setN(p => ({ ...p, [k]: v }))} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
