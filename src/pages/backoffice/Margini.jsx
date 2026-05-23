import{useState,useEffect}from'react';import{Badge}from'../../components/Shared';import{boGetMargini}from'../../api';
const fmt=n=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:2});
export default function Margini(){const[data,setData]=useState(null);const[ld,setLd]=useState(true);
useEffect(()=>{boGetMargini().then(setData).finally(()=>setLd(false));},[]);
const margini=data?.margini||[];const totali=data?.totali||{prezzo:0,storno:0,margine:0,contratti:0};const mx=Math.max(...margini.map(m=>m.totaleMargine),1);
return<><div style={{position:'sticky',top:0,zIndex:10,background:'#fcfcfa',borderBottom:'1px solid var(--border)',padding:'0 20px',height:60,display:'flex',alignItems:'center'}}>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(18px,3vw,24px)',margin:0}}>Margini & Commissioni</h1></div>
<div style={{padding:20,display:'flex',flexDirection:'column',gap:20}}>
{ld?<div style={{textAlign:'center',padding:'48px 0',color:'var(--ink-soft)'}}>Caricamento…</div>:<>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>
{[{l:'GMV totale',v:`€ ${fmt(totali.prezzo)}`},{l:'Storni admin',v:`−€ ${fmt(totali.storno)}`,m:true},{l:'Margine netto',v:`€ ${fmt(totali.margine)}`,a:true},{l:'Contratti',v:totali.contratti}].map(({l,v,m,a})=>
<div key={l} style={{border:`1px solid ${a?'#c8dbc8':'var(--border)'}`,borderRadius:16,padding:'18px 20px',background:a?'var(--success-bg)':'var(--surface)'}}>
<div style={{fontSize:12.5,color:'var(--ink-soft)',marginBottom:8}}>{l}</div>
<div style={{fontSize:26,fontWeight:700,letterSpacing:'-0.025em',color:a?'var(--success)':m?'var(--ink-soft)':'var(--ink)'}}>{v}</div></div>)}</div>
{margini.length===0?<div style={{textAlign:'center',padding:'40px 0',color:'var(--ink-soft)'}}>Nessun contratto attivo — i margini appariranno qui.</div>:
<div style={{border:'1px solid var(--border)',borderRadius:20,background:'var(--surface)',overflow:'hidden'}}>
<div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)'}}><span style={{fontSize:16,fontWeight:700,fontFamily:'Fraunces'}}>Per servizio</span></div>
<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}><thead><tr style={{background:'var(--bg)'}}>
{['Servizio','N°','GMV','Storno','Margine','%'].map(h=><th key={h} style={{padding:'9px 14px',textAlign:'left',fontSize:11,fontWeight:600,letterSpacing:'0.04em',textTransform:'uppercase',color:'var(--ink-soft)',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>)}
</tr></thead><tbody>{margini.map(m=>{const p=m.totalePrezzo>0?((m.totaleMargine/m.totalePrezzo)*100).toFixed(1):'0';const bw=(m.totaleMargine/mx)*100;
return<tr key={m._id} style={{borderBottom:'1px solid var(--border)'}}>
<td style={{padding:'11px 14px',fontSize:13.5,fontWeight:500}}>{m._id}</td>
<td style={{padding:'11px 14px',fontSize:13}}>{m.numContratti}</td>
<td style={{padding:'11px 14px',fontSize:13}}>€ {fmt(m.totalePrezzo)}</td>
<td style={{padding:'11px 14px',fontSize:13,color:'var(--ink-soft)'}}>−€ {fmt(m.totaleStorno)}</td>
<td style={{padding:'11px 14px',fontSize:13,color:'var(--copper-dark)',fontWeight:600}}>€ {fmt(m.totaleMargine)}</td>
<td style={{padding:'11px 14px'}}><div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:60,height:6,borderRadius:3,background:'var(--border)',overflow:'hidden'}}><div style={{height:'100%',width:`${bw}%`,background:'var(--copper)',borderRadius:3}}/></div><span style={{fontSize:12,color:'var(--ink-soft)'}}>{p}%</span></div></td>
</tr>;})}</tbody></table></div></div>}</>}</div></>;
}
