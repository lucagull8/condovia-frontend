import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function BackofficeLogin() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('commerciale@condovia.it');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const handle = async (e) => {
    e.preventDefault(); if (!pw) { setErr('Inserisci la password.'); return; }
    setBusy(true); setErr('');
    try { const d = await login(email, pw); d.ruolo === 'commerciale' ? nav('/backoffice') : setErr('Accesso riservato al team Condovia.'); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  const inp = { width: '100%', height: 48, borderRadius: 12, padding: '0 16px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', color: '#f5ece0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#1a1411,#2e2620,#1b1714)', padding: 24 }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: '40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(155deg,#d4915a,#b87333,#6e3e15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 20 }}>c</div>
          <div><div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: '#f5ece0' }}>condovia</div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(212,145,90,.7)', marginTop: -2 }}>Backoffice</div></div>
        </div>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 26, color: '#f5ece0', margin: '0 0 6px' }}>Accedi al backoffice</h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: 'rgba(245,236,224,.5)' }}>Area riservata al team commerciale</p>
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(245,236,224,.6)', display: 'block', marginBottom: 6 }}>EMAIL</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(245,236,224,.6)', display: 'block', marginBottom: 6 }}>PASSWORD</label><input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" style={inp} /></div>
          {err && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(220,80,60,.12)', border: '1px solid rgba(220,80,60,.3)', color: '#f99', fontSize: 13 }}>{err}</div>}
          <button type="submit" disabled={busy} style={{ height: 52, borderRadius: 13, border: 0, marginTop: 4, background: busy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 15, fontWeight: 600 }}>{busy ? 'Accesso in corso…' : 'Accedi'}</button>
        </form>
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'rgba(245,236,224,.3)' }}>Password: <strong>admin123</strong></div>
      </div>
    </div>
  );
}
