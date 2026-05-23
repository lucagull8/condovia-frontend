import{useState}from'react';import{Link}from'react-router-dom';import{Header,Footer,Badge,Toggle}from'../components/Shared';import{useAuth}from'../context/AuthContext';
export default function Profilo(){const{utente}=useAuth();const nome=utente?`${utente.nome} ${utente.cognome}`:'';const init=utente?`${utente.nome?.[0]??''}${utente.cognome?.[0]??''}`.toUpperCase():'';
const[n,setN]=useState({scadenze:true,preventivi:true,wallet:true,newsletter:false});
return<div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}><Header/><div style={{maxWidth:800,margin:'0 auto',width:'100%',padding:'32px 24px 60px'}}>
<Link to="/home" style={{fontSize:13,color:'var(--ink-soft)',marginBottom:20,display:'inline-block'}}>← Torna alla home</Link>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:48,margin:'0 0 32px'}}>Il tuo profilo<span style={{color:'var(--copper)'}}>.</span></h1>
<div style={{border:'1px solid var(--border)',borderRadius:20,padding:'32px 24px',background:'var(--surface)',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:12,marginBottom:20}}>
<div style={{width:112,height:112,borderRadius:'50%',background:'radial-gradient(120% 120% at 30% 20%,#d4915a,#b87333,#6e3e15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Fraunces',fontSize:36,fontWeight:600,boxShadow:'0 0 0 8px var(--copper-50)'}}>{init}</div>
<h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:26,margin:'0 0 4px'}}>{nome}</h2>
<div style={{fontSize:14,color:'var(--ink-soft)'}}>{utente?.studio}</div><div style={{fontSize:13,color:'var(--ink-soft)'}}>{utente?.email}</div>
<Badge variant="rame" dot>Amministratore</Badge></div>
<div style={{border:'1px solid var(--border)',borderRadius:20,padding:24,background:'var(--surface)',marginBottom:20}}>
<h3 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:18,margin:'0 0 16px'}}>Dati studio</h3>
{[{k:'Studio',v:utente?.studio},{k:'P.IVA',v:utente?.partitaIva},{k:'Telefono',v:utente?.telefono},{k:'PEC',v:utente?.pec}].map(({k,v},i)=>
<div key={k} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderTop:i>0?'1px solid var(--border)':'none'}}><span style={{fontSize:13,color:'var(--ink-soft)'}}>{k}</span><span style={{fontSize:13.5,fontWeight:500}}>{v||'—'}</span></div>)}</div>
<div style={{border:'1px solid var(--border)',borderRadius:20,padding:24,background:'var(--surface)'}}>
<h3 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:18,margin:'0 0 16px'}}>Preferenze notifiche</h3>
{[{k:'scadenze',l:'Email scadenze',s:'Avvisi scadenze'},{k:'preventivi',l:'Nuovi preventivi',s:'Proposte fornitori'},{k:'wallet',l:'Avvisi wallet',s:'Accrediti e trasferimenti'},{k:'newsletter',l:'Newsletter',s:'Novità piattaforma'}].map(({k,l,s},i)=>
<div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px 0',borderTop:i>0?'1px solid var(--border)':'none'}}>
<div><div style={{fontSize:14,fontWeight:600}}>{l}</div><div style={{fontSize:12.5,color:'var(--ink-soft)'}}>{s}</div></div>
<Toggle on={n[k]} onChange={v=>setN(p=>({...p,[k]:v}))}/></div>)}</div>
</div><Footer/></div>;}
