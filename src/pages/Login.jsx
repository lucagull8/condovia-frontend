import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const nav = useNavigate(); const { login } = useAuth();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const handle = async (e) => { e.preventDefault(); if (!email||!pw){setErr('Inserisci email e password.');return;} setBusy(true);setErr('');
    try{const d=await login(email,pw);nav(d.ruolo==='commerciale'?'/backoffice':'/home');}catch(e){setErr(e.message);}finally{setBusy(false);}};
  const inp={width:'100%',height:48,borderRadius:12,padding:'0 16px',border:'1.5px solid var(--border)',background:'var(--surface)',fontSize:14,color:'var(--ink)',outline:'none',boxSizing:'border-box'};
  return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24}}>
    <div style={{width:'100%',maxWidth:460}}>
      <Link to="/" style={{display:'flex',alignItems:'center',gap:8,marginBottom:48}}>
        <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(155deg,#d4915a,#b87333,#6e3e15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Fraunces',fontWeight:600,fontSize:18}}>c</div>
        <span style={{fontFamily:'Fraunces',fontSize:20,fontWeight:500}}>condovia</span>
      </Link>
      <h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:30,margin:'0 0 6px'}}>Accedi al tuo account</h1>
      <p style={{margin:'0 0 32px',fontSize:14,color:'var(--ink-soft)'}}>Area riservata agli amministratori di condominio</p>
      <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--ink-soft)',marginBottom:6}}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nome@studio.it" style={inp}/></div>
        <div><label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--ink-soft)',marginBottom:6}}>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" style={{...inp,borderColor:err?'var(--danger)':'var(--border)'}}/></div>
        {err&&<div style={{padding:'10px 14px',borderRadius:10,background:'var(--danger-bg)',border:'1px solid #e8b8a8',color:'var(--danger)',fontSize:13}}>{err}</div>}
        <button type="submit" disabled={busy} style={{height:52,borderRadius:13,border:0,marginTop:4,background:busy?'rgba(184,115,51,.4)':'linear-gradient(180deg,#c8843f,#a06525)',color:'#fff',fontSize:15,fontWeight:600}}>{busy?'Accesso in corso…':'Accedi →'}</button>
      </form>
      <div style={{marginTop:24,textAlign:'center'}}><span style={{fontSize:12.5,color:'var(--ink-soft)'}}>Account: <strong>alessio.saraceno@condovia.it</strong> / <strong>demo123</strong></span></div>
      <div style={{marginTop:32,textAlign:'center'}}><Link to="/backoffice/login" style={{fontSize:12.5,color:'var(--ink-soft)'}}>Team Condovia? → Backoffice</Link></div>
    </div></div>;
}
