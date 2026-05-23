import{useState,useEffect}from'react';import{Download}from'lucide-react';import{Badge}from'../../components/Shared';import{boGetFatturazione,boPatchFattura}from'../../api';
const fmt=n=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:2});
const SB={in_attesa:{l:'In attesa',v:'orange'},elaborazione:{l:'In elaborazione',v:'rame'},pagata:{l:'Pagata',v:'attivo'}};
export default function Fatturazione(){const[fatture,setFatture]=useState([]);const[stats,setStats]=useState({inAttesa:0,elaborazione:0,valoreInAttesa:0,valoreTotale:0});const[ld,setLd]=useState(true);const[tab,setTab]=useState('tutte');
const load=()=>{setLd(true);boGetFatturazione(tab==='tutte'?'':tab).then(d=>{setFatture(d.fatture);setStats(d.stats);}).finally(()=>setLd(false));};
useEffect(load,[tab]);
const ch=async(id,stato)=>{try{await boPatchFattura(id,{stato});load();}catch(e){alert(e.message);}};
return<><div style={{position:'sticky',top:0,zIndex:10,background:'#f7f7f5',borderBottom:'1px solid var(--border)',padding:'0 20px',height:60,display:'flex',alignItems:'center'}}>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(18px,3vw,22px)',margin:0}}>Fatturazione</h1>
{stats.inAttesa>0&&<span style={{background:'var(--danger)',color:'#fff',fontSize:11,fontWeight:700,borderRadius:6,padding:'2px 7px',marginLeft:10}}>{stats.inAttesa}</span>}</div>
<div style={{padding:'20px',display:'flex',flexDirection:'column',gap:16}}>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
{[{l:'In attesa',v:stats.inAttesa,col:'var(--danger)',bg:'var(--danger-bg)',b:'#e8b8a8'},{l:'In elaborazione',v:stats.elaborazione,col:'var(--copper-dark)',bg:'var(--copper-50)',b:'var(--copper-100)'},{l:'Da emettere',v:`€ ${fmt(stats.valoreInAttesa)}`,col:'var(--ink)',bg:'var(--surface)',b:'var(--border)'},{l:'Totale',v:`€ ${fmt(stats.valoreTotale)}`,col:'var(--success)',bg:'var(--success-bg)',b:'#c8dbc8'}].map(({l,v,col,bg,b})=>
<div key={l} style={{padding:'14px 16px',borderRadius:14,background:bg,border:`1px solid ${b}`}}><div style={{fontSize:12,color:'var(--ink-soft)',marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:col}}>{v}</div></div>)}</div>
<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
{[{k:'tutte',l:'Tutte'},{k:'in_attesa',l:'In attesa'},{k:'elaborazione',l:'In elaborazione'},{k:'pagata',l:'Pagate'}].map(({k,l})=>
<button key={k} onClick={()=>setTab(k)} style={{height:34,padding:'0 14px',borderRadius:8,border:0,background:tab===k?'var(--ink)':'var(--surface)',color:tab===k?'#fff':'var(--ink-soft)',boxShadow:tab===k?'none':'0 0 0 1.5px var(--border)',fontSize:13,fontWeight:tab===k?600:400}}>{l}</button>)}</div>
{ld?<div style={{textAlign:'center',padding:'48px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:fatture.length===0?
<div style={{textAlign:'center',padding:'40px 0',color:'var(--ink-soft)'}}>Nessuna fattura in questa categoria</div>:
<div style={{display:'flex',flexDirection:'column',gap:8}}>{fatture.map(f=>{const bd=SB[f.stato]||{l:f.stato,v:'grigio'};
return<div key={f._id} style={{border:'1px solid var(--border)',borderRadius:14,padding:'16px 20px',background:'var(--surface)',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
<div style={{minWidth:100}}><div style={{fontSize:13,fontWeight:700,fontFamily:'monospace'}}>{f.numero}</div><div style={{fontSize:11.5,color:'var(--ink-soft)'}}>{new Date(f.createdAt).toLocaleDateString('it-IT')}</div></div>
<div style={{flex:1,minWidth:150}}><div style={{fontSize:13.5,fontWeight:600}}>{f.amministratoreId?.nome} {f.amministratoreId?.cognome}</div><div style={{fontSize:11.5,color:'var(--ink-soft)'}}>{f.tipo}</div></div>
<div style={{fontSize:16,fontWeight:700}}>€ {fmt(f.importo)}</div>
<Badge variant={bd.v} dot>{bd.l}</Badge>
<div style={{display:'flex',gap:6}}>
{f.stato==='in_attesa'&&<button onClick={()=>ch(f._id,'elaborazione')} style={{height:32,padding:'0 12px',borderRadius:8,border:0,background:'linear-gradient(180deg,#c8843f,#a06525)',color:'#fff',fontSize:12,fontWeight:600}}>Approva</button>}
{f.stato==='elaborazione'&&<button onClick={()=>ch(f._id,'pagata')} style={{height:32,padding:'0 12px',borderRadius:8,border:0,background:'var(--success)',color:'#fff',fontSize:12,fontWeight:600}}>Segna pagata</button>}
</div></div>;})}</div>}</div></>;
}
