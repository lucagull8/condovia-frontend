import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoMark, PasswordInput } from '../../components/Shared';
import { forgotPassword } from '../../api';

function ForgotModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const handle = async (e) => {
    e.preventDefault();
    if (!email) { setErr('Inserisci la tua email.'); return; }
    setBusy(true); setErr('');
    try { await forgotPassword(email); setDone(true); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };
  const inp = { width: '100%', height: 46, borderRadius: 10, padding: '0 14px', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)', color: '#f5ece0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#2a221d', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '32px 28px' }}>
        {done ? (
          <>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, color: '#f5ece0', margin: '0 0 10px' }}>Email inviata</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,236,224,.55)', margin: '0 0 24px', lineHeight: 1.6 }}>Se l'email è associata a un account attivo riceverai una password temporanea.</p>
            <button onClick={onClose} style={{ height: 44, width: '100%', borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Chiudi</button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, color: '#f5ece0', margin: '0 0 8px' }}>Password dimenticata?</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,236,224,.55)', margin: '0 0 20px', lineHeight: 1.6 }}>Inserisci la tua email e ti mandiamo una password temporanea.</p>
            <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@condovia.it" style={inp} autoFocus />
              {err && <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(220,80,60,.12)', border: '1px solid rgba(220,80,60,.3)', color: '#f99', fontSize: 13 }}>{err}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,.12)', background: 'transparent', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'rgba(245,236,224,.5)' }}>Annulla</button>
                <button type="submit" disabled={busy} style={{ flex: 2, height: 44, borderRadius: 12, border: 0, background: busy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{busy ? 'Invio…' : 'Invia password'}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function BackofficeLogin() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); if (!pw) { setErr('Inserisci la password.'); return; }
    setBusy(true); setErr('');
    try { const d = await login(email, pw); d.ruolo === 'commerciale' ? nav('/backoffice') : setErr('Accesso riservato al team Condovia.'); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  const inp = { width: '100%', height: 48, borderRadius: 12, padding: '0 16px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', color: '#f5ece0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#1a1411,#2e2620,#1b1714)', padding: 24 }}>
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: '40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <LogoMark size={36} variant="light" />
          <div><div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: '#f5ece0' }}>CONDOVIA</div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(212,145,90,.7)', marginTop: -2 }}>Backoffice</div></div>
        </div>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 26, color: '#f5ece0', margin: '0 0 6px' }}>Accedi al backoffice</h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: 'rgba(245,236,224,.5)' }}>Area riservata al team commerciale</p>
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(245,236,224,.6)', display: 'block', marginBottom: 6 }}>EMAIL</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(245,236,224,.6)', display: 'block', marginBottom: 6 }}>PASSWORD</label><PasswordInput value={pw} onChange={e => setPw(e.target.value)} inputStyle={{ ...inp }} /></div>
          {err && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,80,60,.12)', border: '1px solid rgba(220,80,60,.3)', color: '#f99', fontSize: 13 }}>{err}</div>}
          <button type="submit" disabled={busy} style={{ height: 52, borderRadius: 13, border: 0, marginTop: 4, background: busy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{busy ? 'Accesso in corso…' : 'Accedi'}</button>
        </form>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button onClick={() => setShowForgot(true)} style={{ background: 'transparent', border: 0, fontSize: 13, color: 'rgba(245,236,224,.4)', cursor: 'pointer', textDecoration: 'underline' }}>Password dimenticata?</button>
        </div>
      </div>
    </div>
  );
}
