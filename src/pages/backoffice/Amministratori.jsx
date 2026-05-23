import{useState,useEffect}from'react';import{Search}from'lucide-react';import{Badge}from'../../components/Shared';import{boGetAmministratori}from'../../api';
const fmt=n=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:2});
const C=['linear-gradient(135deg,#d4915a,#8b5520)','linear-gradient(135deg,#4a90c4,#1e5f8c)','linear-gradient(135deg,#6e9a6e,#3d6b3d)','linear-gradient(135deg,#9b59b6,#6c3483)'];
export default function Amministratori(){const[data,setData]=useState([]);const[ld,setLd]=useState(true);const[q,setQ]=useState('');
useEffect(()=>{boGetAmministratori().then(setData).finally(()=>setLd(false));},[]);
const filtered=data.filter(a=>q===''||`${a.nome} ${a.cognome} ${a.studio||''}`.toLowerCase().includes(q.toLowerCase()));
return<><div style={{position:'sticky',top:0,zIndex:10,background:'#fcfcfa',borderBottom:'1px solid var(--border)',padding:'0 20px',height:60,display:'flex',alignItems:'center'}}>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(18px,3vw,24px)',margin:0}}>Amministratori</h1>
<span style={{fontSize:12,color:'var(--ink-soft)',marginLeft:12}}>{data.length} registrati</span></div>
<div style={{padding:'20px',display:'flex',flexDirection:'column',gap:16}}>
<div style={{position:'relative'}}><Search size={13} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--ink-soft)'}}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca…" style={{width:'100%',height:36,paddingLeft:30,borderRadius:8,border:'1px solid var(--border)',fontSize:13,background:'var(--surface)',outline:'none'}}/></div>
{ld?<div style={{textAlign:'center',padding:'40px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:filtered.length===0?
<div style={{textAlign:'center',padding:'40px 0',color:'var(--ink-soft)'}}>Nessun amministratore registrato</div>:
<div style={{border:'1px solid var(--border)',borderRadius:16,background:'var(--surface)',overflow:'hidden'}}>
<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}><thead><tr style={{background:'var(--bg)'}}>
{['Amministratore','Studio','Condomini','Servizi','Storno','Stato'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',color:'var(--ink-soft)',borderBottom:'1px solid var(--border)'}}>{h}</th>)}
</tr></thead><tbody>{filtered.map((a,i)=><tr key={a._id} style={{borderBottom:'1px solid var(--border)'}}>
<td style={{padding:'12px 14px'}}><div style={{display:'flex',alignItems:'center',gap:10}}>
<div style={{width:34,height:34,borderRadius:9,background:C[i%4],display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:700,flexShrink:0}}>{(a.nome?.[0]||'')+(a.cognome?.[0]||'')}</div>
<div><div style={{fontSize:13.5,fontWeight:600}}>{a.nome} {a.cognome}</div><div style={{fontSize:11.5,color:'var(--ink-soft)'}}>{a.email}</div></div></div></td>
<td style={{padding:'12px 14px',fontSize:13}}>{a.studio||'—'}</td>
<td style={{padding:'12px 14px',fontSize:13,fontWeight:700,color:'var(--copper-dark)'}}>{a.condomini||0}</td>
<td style={{padding:'12px 14px',fontSize:13,fontWeight:700,color:'var(--success)'}}>{a.serviziAttivi||0}</td>
<td style={{padding:'12px 14px',fontSize:13.5,fontWeight:600,color:'var(--copper-dark)'}}>€ {fmt(a.stornoTotale||0)}</td>
<td style={{padding:'12px 14px'}}>{a.stato==='attivo'?<Badge variant="attivo" dot>Attivo</Badge>:<Badge variant="scadenza" dot>Sospeso</Badge>}</td>
</tr>)}</tbody></table></div></div>}</div></>;
}
