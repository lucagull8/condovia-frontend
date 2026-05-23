import{useState,useEffect}from'react';import{Link}from'react-router-dom';import{CircleAlert,ChevronRight}from'lucide-react';import{Header,Footer,Badge}from'../components/Shared';import{ServiceIcon,findServiceCatalog}from'../components/ServiceIcon';import{getServizi}from'../api';
const fmtD=d=>d?new Date(d).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}):'';const days=d=>d?Math.ceil((new Date(d)-Date.now())/864e5):null;
export default function Scadenze(){const[s,setS]=useState([]);const[ld,setLd]=useState(true);useEffect(()=>{getServizi().then(setS).finally(()=>setLd(false));},[]);
const inSc=s.filter(x=>x.status==='scadenza');const att=s.filter(x=>x.status==='attivo');
return<div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}><Header/><div style={{maxWidth:1000,margin:'0 auto',width:'100%',padding:'32px 24px 60px'}}>
<Link to="/home" style={{fontSize:13,color:'var(--ink-soft)',marginBottom:20,display:'inline-block'}}>← Torna alla home</Link>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(32px,5vw,48px)',margin:'0 0 6px'}}>Servizi in scadenza<span style={{color:'var(--copper)'}}>.</span></h1>
{!ld&&<p style={{margin:'0 0 28px',fontSize:14,color:'var(--ink-soft)'}}>{inSc.length} da rinnovare · {att.length} attivi</p>}
{ld?<div style={{textAlign:'center',padding:'48px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:<>
{inSc.length>0&&<><h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:20,margin:'0 0 16px'}}>Da rinnovare</h2>
<div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:40}}>{inSc.map(x=>{const cat=findServiceCatalog(x.id);const d=days(x.dataScadenza);return<div key={x.id} style={{display:'flex',alignItems:'center',gap:16,padding:'20px 24px',border:'1px solid #e8b8a8',borderRadius:16,background:'var(--surface)',borderLeft:'3px solid var(--danger)',flexWrap:'wrap'}}>
<ServiceIcon service={{...cat,...x}} size={56} status="scadenza"/>
<div style={{flex:1,minWidth:200}}><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}><span style={{fontSize:16,fontWeight:700}}>{x.label}</span>{d!==null&&<Badge variant="scadenza" dot>{d} giorni</Badge>}</div>
<div style={{fontSize:13,color:'var(--ink-soft)'}}><strong>{x.fornitore}</strong></div>{x.condominioNome&&<div style={{fontSize:12.5,color:'var(--ink-soft)'}}>Condominio <strong>{x.condominioNome}</strong></div>}</div>
<Link to={`/servizio/${x.id}`} style={{display:'inline-flex',alignItems:'center',gap:6,height:40,padding:'0 18px',borderRadius:10,background:'linear-gradient(180deg,#c8843f,#a06525)',color:'#fff',fontSize:13.5,fontWeight:600,flexShrink:0}}>Rinnova →</Link></div>;})}</div></>}
{att.length>0&&<><h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:20,margin:'0 0 16px'}}>Servizi attivi</h2>
<div style={{border:'1px solid var(--border)',borderRadius:20,overflow:'hidden',background:'var(--surface)'}}>{att.map((x,i)=>{const cat=findServiceCatalog(x.id);return<Link key={x.id} to={`/servizio/${x.id}`} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 20px',borderTop:i>0?'1px solid var(--border)':'none',color:'inherit'}}>
<ServiceIcon service={{...cat,...x}} size={44}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{x.label}</div><div style={{fontSize:12.5,color:'var(--ink-soft)'}}>{x.fornitore}</div></div>
<ChevronRight size={15} color="var(--ink-soft)"/></Link>;})}</div></>}</>}
</div><Footer/></div>;}
