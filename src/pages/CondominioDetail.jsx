import{useState,useEffect}from'react';import{Link,useParams,Navigate}from'react-router-dom';import{Building2}from'lucide-react';import{Header,Footer,Badge}from'../components/Shared';import{ServiceIcon,SERVIZI_CATALOGO}from'../components/ServiceIcon';import{getCondominio}from'../api';
export default function CondominioDetail(){const{id}=useParams();const[c,setC]=useState(null);const[ld,setLd]=useState(true);
useEffect(()=>{getCondominio(id).then(setC).catch(()=>{}).finally(()=>setLd(false));},[id]);
if(ld)return<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Caricamento…</div>;
if(!c)return<Navigate to="/condomini" replace/>;const servizi=c.servizi||{};
return<div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}><Header/><div style={{maxWidth:1200,margin:'0 auto',width:'100%',padding:'24px 24px 60px'}}>
<div style={{fontSize:13,color:'var(--ink-soft)',marginBottom:20}}><Link to="/home">Home</Link> / <Link to="/condomini">Condomini</Link> / <strong style={{color:'var(--ink)'}}>{c.nome}</strong></div>
<div style={{border:'1px solid var(--border)',borderRadius:24,padding:28,background:'var(--surface)',marginBottom:16}}>
<div style={{display:'flex',gap:16,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
<div style={{width:80,height:80,borderRadius:20,flexShrink:0,background:'linear-gradient(155deg,#c8843f,#8b5520)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 8px var(--copper-50)'}}><Building2 size={36} color="#fff"/></div>
<div><h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(22px,3vw,30px)',margin:'0 0 4px'}}>{c.nome}</h1><p style={{margin:0,fontSize:14,color:'var(--ink-soft)'}}>{c.via}, {c.citta} · <strong>{c.unita} unità</strong></p></div></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',borderTop:'1px solid var(--border)',paddingTop:16}}>
{[{l:'Attivi',v:c.attivi,col:'var(--success)'},{l:'Scadenze',v:c.scadenze,col:c.scadenze>0?'var(--danger)':'var(--ink-soft)'},{l:'Storno',v:`€ ${c.storno}`,col:'var(--copper-dark)'},{l:'Unità',v:c.unita,col:'var(--ink)'}].map(({l,v,col},i)=>
<div key={l} style={{padding:'0 20px',borderLeft:i>0?'1px solid var(--border)':'none'}}><div style={{fontSize:12,color:'var(--ink-soft)',marginBottom:3}}>{l}</div><div style={{fontSize:26,fontWeight:700,color:col}}>{v}</div></div>)}</div></div>
<div style={{border:'1px solid var(--border)',borderRadius:20,padding:'24px 28px',background:'var(--surface)'}}>
<h2 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:20,margin:'0 0 20px'}}>Servizi</h2>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:'20px 12px'}}>{SERVIZI_CATALOGO.map(s=>{const st=servizi[s.id]||'no';return<Link key={s.id} to={`/servizio/${s.id}`} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
<ServiceIcon service={s} size={56} status={st}/><span style={{fontSize:11,fontWeight:500,color:'var(--ink-soft)',textAlign:'center',lineHeight:1.25,opacity:st==='no'?.55:1}}>{s.label}</span></Link>;})}</div></div>
</div><Footer/></div>;}
