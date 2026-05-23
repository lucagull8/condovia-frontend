import{useState,useEffect}from'react';import{Link}from'react-router-dom';import{TriangleAlert,ArrowRight,ChevronRight,Wallet,Building2}from'lucide-react';import{Header,Footer,Badge}from'../components/Shared';import{ServiceIcon,findServiceCatalog}from'../components/ServiceIcon';import{useAuth}from'../context/AuthContext';import{getServizi,getCondomini}from'../api';
const fmt=n=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:2});
export default function Home(){const{utente}=useAuth();const[servizi,setServizi]=useState([]);const[condomini,setCondomini]=useState([]);const[loadS,setLS]=useState(true);const[loadC,setLC]=useState(true);const[filtro,setFiltro]=useState(null);
useEffect(()=>{getServizi().then(setServizi).finally(()=>setLS(false));getCondomini().then(setCondomini).finally(()=>setLC(false));},[]);
const attivi=servizi.filter(s=>s.status==='attivo').length;const scadenze=servizi.filter(s=>s.status==='scadenza').length;const daAtt=servizi.filter(s=>s.status==='no').length;
const lista=filtro?servizi.filter(s=>s.status===filtro):servizi;const nome=utente?`${utente.nome} ${utente.cognome}`:'';const studio=utente?.studio||'';const saldo=utente?.saldo??0;
return<div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}><Header/><div style={{maxWidth:1200,margin:'0 auto',width:'100%',padding:'40px 24px 60px'}}>
<div style={{marginBottom:32}}><p style={{margin:'0 0 2px',fontSize:13,color:'var(--ink-soft)'}}>Buongiorno</p>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(28px,5vw,40px)',letterSpacing:'-0.025em',margin:'0 0 6px'}}>{nome}<span style={{color:'var(--copper)'}}>.</span></h1>
<p style={{margin:0,fontSize:14,color:'var(--ink-soft)'}}>{studio} · {condomini.length} condomini gestiti</p></div>
<div style={{display:'grid',gridTemplateColumns:'1fr',gap:16,marginBottom:20}}>
{scadenze>0&&<Link to="/scadenze" style={{display:'flex',alignItems:'center',gap:16,padding:'20px 24px',border:'1px solid #e8b8a8',borderRadius:16,background:'linear-gradient(135deg,#fef5f3,#fce8e0)',color:'inherit'}}>
<div style={{width:44,height:44,borderRadius:12,flexShrink:0,background:'var(--danger)',display:'flex',alignItems:'center',justifyContent:'center'}}><TriangleAlert size={20} color="#fff"/></div>
<div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--danger)',marginBottom:3}}>Attenzione</div>
<div style={{fontSize:15,fontWeight:600}}>{scadenze} servizi in scadenza</div></div>
<div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'var(--danger)',flexShrink:0}}>Gestisci ora <ArrowRight size={14}/></div></Link>}
<Link to="/wallet" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px',borderRadius:16,background:'linear-gradient(155deg,#2e251f,#1a1411,#0c0806)',color:'#f5ece0',boxShadow:'0 16px 40px -20px rgba(20,12,6,.5)',position:'relative',overflow:'hidden'}}>
<div style={{position:'relative'}}><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><Wallet size={14} color="rgba(245,236,224,.6)"/><span style={{fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(245,236,224,.6)'}}>Wallet</span></div>
<div style={{fontSize:11,color:'rgba(245,236,224,.55)',marginBottom:4}}>Saldo disponibile</div>
<div style={{fontSize:30,fontWeight:700,letterSpacing:'-0.03em'}}><span style={{fontSize:18,marginRight:2,color:'rgba(245,236,224,.7)'}}>€</span>{fmt(saldo)}</div></div>
<ChevronRight size={18} color="rgba(245,236,224,.4)"/></Link></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
{[{label:'Servizi attivi',value:attivi,f:'attivo',color:'var(--success)',bg:'var(--success-bg)',border:'#c8dbc8'},
{label:'In scadenza',value:scadenze,f:'scadenza',color:'var(--danger)',bg:'var(--danger-bg)',border:'#e8b8a8'},
{label:'Da attivare',value:daAtt,f:'no',color:'var(--copper-dark)',bg:'var(--copper-50)',border:'var(--copper-100)'}].map(({label,value,f,color,bg,border})=>{
const a=filtro===f;return<button key={f} onClick={()=>setFiltro(a?null:f)} style={{padding:'16px 20px',borderRadius:14,background:a?bg:'var(--surface)',border:`1px solid ${a?border:'var(--border)'}`,cursor:'pointer',textAlign:'left'}}>
<div style={{fontSize:28,fontWeight:700,color:a?color:'var(--ink)',marginBottom:2}}>{loadS?'—':value}</div>
<div style={{fontSize:13,color:a?color:'var(--ink-soft)',fontWeight:a?600:400}}>{label}</div></button>;})}</div>
<div style={{border:'1px solid var(--border)',borderRadius:24,padding:'28px 32px',background:'var(--surface)',marginBottom:32}}>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
<h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:20,margin:0}}>Servizi condominiali</h2>
{filtro&&<button onClick={()=>setFiltro(null)} style={{fontSize:12,color:'var(--copper-dark)',background:'var(--copper-50)',border:0,borderRadius:6,padding:'4px 10px',cursor:'pointer'}}>× Mostra tutti</button>}</div>
{loadS?<div style={{textAlign:'center',padding:'32px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:'20px 12px'}}>
{lista.map(s=>{const cat=findServiceCatalog(s.id);return<Link key={s.id} to={`/servizio/${s.id}`} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
<ServiceIcon service={{...cat,...s}} size={60} status={s.status}/><span style={{fontSize:11,fontWeight:500,color:'var(--ink-soft)',textAlign:'center',lineHeight:1.25,opacity:s.status==='no'?.55:1}}>{s.label}</span></Link>;})}</div>}</div>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}><h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:20,margin:0}}>I tuoi condomini</h2><Link to="/condomini" style={{fontSize:13,color:'var(--copper-dark)',fontWeight:600}}>Vedi tutti →</Link></div>
{loadC?<div style={{textAlign:'center',padding:'24px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
{condomini.map(c=><Link key={c._id} to={`/condomini/${c._id}`} style={{display:'flex',flexDirection:'column',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden',background:'var(--surface)',color:'inherit'}}>
<div style={{padding:'16px 18px',background:'linear-gradient(135deg,#fdf8f3,#f5ece0)',borderBottom:'1px solid var(--border)'}}>
<div style={{fontSize:14,fontWeight:700,fontFamily:'Fraunces',marginBottom:2}}>{c.nome}</div><div style={{fontSize:12,color:'var(--ink-soft)'}}>{c.via}, {c.citta}</div></div>
<div style={{padding:'12px 18px',display:'flex',gap:12,alignItems:'center'}}>
<span style={{fontSize:12,color:'var(--ink-soft)'}}>{c.unita} unità</span><span style={{fontSize:12,color:'var(--success)',fontWeight:600}}>{c.attivi} attivi</span>
{c.scadenze>0&&<Badge variant="scadenza" dot>{c.scadenze} scad.</Badge>}</div></Link>)}</div>}
</div><Footer/></div>;}
