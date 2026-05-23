import{useState,useEffect}from'react';import{Link}from'react-router-dom';import{Download}from'lucide-react';import{Badge}from'../../components/Shared';import{boGetContratti}from'../../api';
const fmt=n=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:2});
export default function Contratti(){const[data,setData]=useState([]);const[ld,setLd]=useState(true);
useEffect(()=>{boGetContratti().then(setData).finally(()=>setLd(false));},[]);
return<><div style={{position:'sticky',top:0,zIndex:10,background:'#fcfcfa',borderBottom:'1px solid var(--border)',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(18px,3vw,24px)',margin:0}}>Contratti</h1></div>
<div style={{padding:20}}>{ld?<div style={{textAlign:'center',padding:'48px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:data.length===0?
<div style={{textAlign:'center',padding:'60px 24px',border:'1px dashed var(--border)',borderRadius:20,background:'var(--surface)'}}>
<div style={{fontSize:16,fontWeight:600,marginBottom:8}}>Nessun contratto ancora</div>
<div style={{fontSize:14,color:'var(--ink-soft)'}}>I contratti appariranno qui quando verranno approvate le richieste.</div></div>:
<div style={{border:'1px solid var(--border)',borderRadius:20,background:'var(--surface)',overflow:'hidden'}}>
<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}><thead><tr style={{background:'var(--bg)'}}>
{['Admin','Condominio','Servizio','Fornitore','Prezzo','Storno','Margine','Scadenza','Stato'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',color:'var(--ink-soft)',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>)}
</tr></thead><tbody>{data.map(c=><tr key={c._id} style={{borderBottom:'1px solid var(--border)'}}>
<td style={{padding:'11px 14px',fontSize:13}}>{c.amministratoreId?.nome} {c.amministratoreId?.cognome}</td>
<td style={{padding:'11px 14px',fontSize:13}}>{c.condominioId?.nome||'—'}</td>
<td style={{padding:'11px 14px',fontSize:13,fontWeight:500}}>{c.servizioId}</td>
<td style={{padding:'11px 14px',fontSize:13,color:'var(--ink-soft)'}}>{c.fornitore}</td>
<td style={{padding:'11px 14px',fontSize:13}}>€ {fmt(c.prezzo)}</td>
<td style={{padding:'11px 14px',fontSize:13,color:'var(--ink-soft)'}}>€ {fmt(c.stornoAmmontare)}</td>
<td style={{padding:'11px 14px',fontSize:13,color:'var(--copper-dark)',fontWeight:600}}>€ {fmt(c.margineCondovia)}</td>
<td style={{padding:'11px 14px',fontSize:13}}>{new Date(c.dataScadenza).toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'})}</td>
<td style={{padding:'11px 14px'}}>{c.stato==='attivo'?<Badge variant="attivo" dot>Attivo</Badge>:<Badge variant="scadenza" dot>Scadenza</Badge>}</td>
</tr>)}</tbody></table></div>
<div style={{padding:'12px 20px',borderTop:'1px solid var(--border)',fontSize:12.5,color:'var(--ink-soft)'}}>{data.length} contratti</div></div>}</div></>;
}
