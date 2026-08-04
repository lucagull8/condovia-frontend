import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoMark, PasswordInput } from '../components/Shared';
import { forgotPassword } from '../api';

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
  const inp = { width: '100%', height: 46, borderRadius: 10, padding: '0 14px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'var(--bg)', borderRadius: 20, padding: '32px 28px', border: '1px solid var(--border)', boxShadow: '0 24px 64px -16px rgba(0,0,0,.2)' }}>
        {done ? (
          <>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, margin: '0 0 12px' }}>Email inviata</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 24px', lineHeight: 1.6 }}>Se l'email è associata a un account attivo, riceverai una password temporanea a breve.</p>
            <button onClick={onClose} style={{ height: 46, width: '100%', borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Chiudi</button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, margin: '0 0 8px' }}>Password dimenticata?</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 24px', lineHeight: 1.6 }}>Inserisci la tua email e ti mandiamo una password temporanea.</p>
            <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@studio.it" style={inp} autoFocus />
              {err && <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>{err}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={onClose} style={{ flex: 1, height: 46, borderRadius: 12, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--ink-soft)' }}>Annulla</button>
                <button type="submit" disabled={busy} style={{ flex: 2, height: 46, borderRadius: 12, border: 0, background: busy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{busy ? 'Invio…' : 'Invia password'}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  const nav = useNavigate(); const { login } = useAuth();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const handle = async (e) => { e.preventDefault(); if (!email||!pw){setErr('Inserisci email e password.');return;} setBusy(true);setErr('');
    try{const d=await login(email,pw);nav(d.ruolo==='commerciale'?'/backoffice':'/home');}catch(e){setErr(e.message);}finally{setBusy(false);}};
  const inp = { width:'100%', height:48, borderRadius:12, padding:'0 16px', border:'1.5px solid var(--border)', background:'var(--surface)', fontSize:14, color:'var(--ink)', outline:'none', boxSizing:'border-box' };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24,overflowY:'auto'}}>
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}
      <div style={{width:'100%',maxWidth:460}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:8,marginBottom:48}}>
          <LogoMark size={32} />
          <span style={{fontFamily:'Fraunces',fontSize:20,fontWeight:500}}>CONDOVIA</span>
        </Link>
        <h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:30,margin:'0 0 6px'}}>Accedi al tuo account</h1>
        <p style={{margin:'0 0 32px',fontSize:14,color:'var(--ink-soft)'}}>Area riservata agli amministratori di condominio</p>
        <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div><label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--ink-soft)',marginBottom:6}}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nome@studio.it" style={inp}/></div>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--ink-soft)',marginBottom:6}}>Password</label>
            <PasswordInput value={pw} onChange={e=>setPw(e.target.value)} inputStyle={{...inp, borderColor: err ? 'var(--danger)' : 'var(--border)'}} />
          </div>
          {err&&<div style={{padding:'10px 14px',borderRadius:10,background:'var(--danger-bg)',border:'1px solid #e8b8a8',color:'var(--danger)',fontSize:13}}>{err}</div>}
          <button type="submit" disabled={busy} style={{height:52,borderRadius:13,border:0,marginTop:4,background:busy?'rgba(184,115,51,.4)':'linear-gradient(180deg,#c8843f,#a06525)',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer'}}>{busy?'Accesso in corso…':'Accedi →'}</button>
        </form>
        <div style={{marginTop:20,textAlign:'center'}}>
          <button onClick={() => setShowForgot(true)} style={{background:'transparent',border:0,fontSize:13,color:'var(--ink-soft)',cursor:'pointer',textDecoration:'underline'}}>Password dimenticata?</button>
        </div>
        <div style={{marginTop:16,textAlign:'center'}}><Link to="/backoffice/login" style={{fontSize:12.5,color:'var(--ink-soft)'}}>Team Condovia? → Backoffice</Link></div>
      </div>
    </div>
  );
}
