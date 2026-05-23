import{useState,useEffect}from'react';import{Link}from'react-router-dom';import{Wallet as WI,Eye,EyeOff,ArrowDown,ArrowUp,TrendingUp,Bell,Check,X}from'lucide-react';import{Header,Footer}from'../components/Shared';import{useAuth}from'../context/AuthContext';import{getWallet,richiediPagamento}from'../api';
const fmt=n=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:2});
export default function Wallet(){const{utente}=useAuth();const[h,setH]=useState(false);const[modal,setModal]=useState(false);const[w,setW]=useState({saldo:0,movimenti:[]});const[ld,setLd]=useState(true);const[send,setSend]=useState(false);
useEffect(()=>{getWallet().then(setW).finally(()=>setLd(false));},[]);const{saldo,movimenti}=w;
const ent=movimenti.filter(m=>m.tipo==='in').reduce((a,m)=>a+m.importo,0);const usc=movimenti.filter(m=>m.tipo==='out').reduce((a,m)=>a+m.importo,0);
const doPay=async()=>{setSend(true);try{await richiediPagamento(saldo);}catch(e){}finally{setSend(false);setModal(true);}};
return<div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}><Header/><div style={{maxWidth:1200,margin:'0 auto',width:'100%',padding:'32px 24px 60px'}}>
<Link to="/home" style={{fontSize:13,color:'var(--ink-soft)',marginBottom:20,display:'inline-block'}}>← Torna alla home</Link>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(36px,5vw,56px)',letterSpacing:'-0.025em',margin:'0 0 32px'}}>Wallet<span style={{color:'var(--copper)'}}>.</span></h1>
<div style={{borderRadius:28,padding:32,background:'linear-gradient(155deg,#2e251f,#1a1411,#0c0806)',color:'#f5ece0',position:'relative',overflow:'hidden',boxShadow:'0 30px 60px -30px rgba(20,12,6,.55)',marginBottom:16}}>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,position:'relative'}}>
<div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:42,height:42,borderRadius:12,background:'linear-gradient(155deg,#c8843f,#8b5520)',display:'flex',alignItems:'center',justifyContent:'center'}}><WI size={20} color="#fff"/></div>
<span style={{fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(245,236,224,.6)'}}>Wallet Condovia</span></div>
<button onClick={()=>setH(v=>!v)} style={{width:34,height:34,borderRadius:8,background:'rgba(255,255,255,.08)',border:0,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(245,236,224,.7)'}}>{h?<EyeOff size={15}/>:<Eye size={15}/>}</button></div>
<div style={{position:'relative'}}><div style={{fontSize:12,color:'rgba(245,236,224,.55)',marginBottom:6}}>Saldo disponibile</div>
<div style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:700,letterSpacing:'-0.035em',filter:h?'blur(14px)':'none',transition:'filter .2s'}}><span style={{fontSize:'0.5em',color:'rgba(245,236,224,.6)',marginRight:4}}>€</span>{ld?'—':fmt(saldo)}</div></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',borderTop:'1px solid rgba(255,255,255,.08)',margin:'24px 0',padding:'16px 0'}}>
{[{l:'ENTRATE',v:`+€ ${fmt(ent)}`,c:'#d4915a'},{l:'USCITE',v:`−€ ${fmt(usc)}`,c:'rgba(245,236,224,.85)'},{l:'MOVIMENTI',v:movimenti.length,c:'rgba(245,236,224,.7)'}].map(({l,v,c},i)=>
<div key={l} style={{textAlign:'center',padding:'0 12px',borderLeft:i>0?'1px solid rgba(255,255,255,.08)':'none'}}>
<div style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.08em',color:'rgba(245,236,224,.45)',marginBottom:4}}>{l}</div>
<div style={{fontSize:14,fontWeight:600,color:c}}>{v}</div></div>)}</div></div>
<button onClick={doPay} disabled={send||saldo<=0} style={{width:'100%',height:52,borderRadius:14,border:0,background:'linear-gradient(180deg,#c8843f,#a06525)',boxShadow:'0 0 0 1px rgba(110,62,21,.55)',color:'#fff',fontSize:15,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:saldo<=0?.55:1,marginBottom:16}}><Bell size={16}/> {send?'Invio…':'Richiedi pagamento'}</button>
<div style={{border:'1px solid var(--border)',borderRadius:20,padding:24,background:'var(--surface)'}}>
<h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:20,margin:'0 0 16px'}}>Movimenti recenti</h2>
{ld?<div style={{textAlign:'center',padding:'24px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:movimenti.length===0?<div style={{textAlign:'center',padding:'24px 0',color:'var(--ink-soft)'}}>Nessun movimento</div>:
<div style={{display:'flex',flexDirection:'column'}}>{movimenti.map((m,i)=><div key={m.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderTop:i>0?'1px solid var(--border)':'none'}}>
<div style={{width:34,height:34,borderRadius:10,flexShrink:0,background:m.tipo==='in'?'var(--success-bg)':'var(--copper-50)',display:'flex',alignItems:'center',justifyContent:'center'}}>
{m.tipo==='in'?<ArrowDown size={14} color="var(--success)"/>:<ArrowUp size={14} color="var(--copper-dark)"/>}</div>
<div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{m.desc}</div><div style={{fontSize:12,color:'var(--ink-soft)'}}>{m.data}</div></div>
<div style={{fontSize:14,fontWeight:700,color:m.tipo==='in'?'var(--success)':'var(--copper-dark)'}}>{m.tipo==='in'?'+':'−'}€ {fmt(m.importo)}</div></div>)}</div>}</div>
</div><Footer/>
{modal&&<div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(26,20,17,.55)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}} onClick={()=>setModal(false)}>
<div style={{width:'100%',maxWidth:420,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,padding:'32px 28px',display:'flex',flexDirection:'column',alignItems:'center',gap:18,textAlign:'center'}} onClick={e=>e.stopPropagation()}>
<h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:28,margin:0}}>Richiesta ricevuta!</h2>
<p style={{margin:0,fontSize:14,color:'var(--ink-soft)'}}>Il nostro team ti contatterà entro <strong>24 ore</strong>.</p>
<button onClick={()=>setModal(false)} style={{width:'100%',height:48,borderRadius:12,border:0,background:'linear-gradient(180deg,#c8843f,#a06525)',color:'#fff',fontSize:14,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><Check size={15}/> Ho capito</button>
</div></div>}</div>;}
