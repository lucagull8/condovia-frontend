import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../../components/Shared';
import { changePassword } from '../../api';

export default function BackofficeProfilo() {
  const { utente } = useAuth();
  const init = utente ? `${utente.nome?.[0] ?? ''}${utente.cognome?.[0] ?? ''}`.toUpperCase() : '';

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
    <>
      <div className="bo-sticky-hdr" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, margin: 0 }}>Profilo</h1>
      </div>
      <div style={{ maxWidth: 560, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Info utente */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 24, background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#d4915a,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{init}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{utente?.nome} {utente?.cognome}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{utente?.email}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--copper-dark)', marginTop: 4 }}>Team Condovia</div>
          </div>
        </div>

        {/* Cambia password */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 24, background: 'var(--surface)' }}>
          <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: '0 0 20px' }}>Cambia password</h3>
          <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={lbl}>Password attuale</label><PasswordInput value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} inputStyle={inp} /></div>
            <div><label style={lbl}>Nuova password</label><PasswordInput value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} inputStyle={inp} /></div>
            <div><label style={lbl}>Conferma nuova password</label><PasswordInput value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} inputStyle={inp} /></div>
            {pwErr && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>{pwErr}</div>}
            {pwOk && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--success-bg)', border: '1px solid #c8dbc8', color: 'var(--success)', fontSize: 13 }}>Password aggiornata. Hai ricevuto una email di conferma.</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={pwBusy} style={{ height: 44, padding: '0 24px', borderRadius: 12, border: 0, background: pwBusy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{pwBusy ? 'Salvataggio…' : 'Aggiorna password'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
