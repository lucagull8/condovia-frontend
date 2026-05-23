import{useState,useEffect}from'react';import{CircleCheckBig,CircleX,Clock,Mail,User,Calendar}from'lucide-react';import{boGetIscrizioni,boApprovaIscrizione,boRifiutaIscrizione}from'../../api';
const fD=d=>d?new Date(d).toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}):'—';
const fL=d=>d?new Date(d).toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'}):'—';
export default function Iscrizioni(){const[tab,setTab]=useState('pending');const[data,setData]=useState([]);const[ld,setLd]=useState(true);const[counts,setCounts]=useState({pending:0,attivo:0,rifiutato:0});
async function load(s){setLd(true);try{setData(await boGetIscrizioni(s));}finally{setLd(false);}}
async function loadC(){const[p,a,r]=await Promise.all([boGetIscrizioni('pending'),boGetIscrizioni('attivo'),boGetIscrizioni('rifiutato')]);setCounts({pending:p.length,attivo:a.length,rifiutato:r.length});}
useEffect(()=>{load(tab);loadC();},[tab]);
const approva=async id=>{setData(d=>d.map(u=>(u._id||u.id)===id?{...u,_b:true}:u));try{await boApprovaIscrizione(id);setData(d=>d.filter(u=>(u._id||u.id)!==id));setCounts(c=>({...c,pending:Math.max(0,c.pending-1),attivo:c.attivo+1}));}catch(e){alert(e.message);setData(d=>d.map(u=>(u._id||u.id)===id?{...u,_b:false}:u));}};
const rifiuta=async id=>{if(!confirm('Confermi il rifiuto?'))return;setData(d=>d.map(u=>(u._id||u.id)===id?{...u,_b:true}:u));try{await boRifiutaIscrizione(id);setData(d=>d.filter(u=>(u._id||u.id)!==id));setCounts(c=>({...c,pending:Math.max(0,c.pending-1),rifiutato:c.rifiutato+1}));}catch(e){alert(e.message);setData(d=>d.map(u=>(u._id||u.id)===id?{...u,_b:false}:u));}};
return<div style={{padding:'24px 20px 60px'}}><div style={{marginBottom:24}}>
<h1 style={{fontFamily:'Fraunces',fontWeight:500,fontSize:'clamp(24px,4vw,32px)',letterSpacing:'-0.02em',margin:'0 0 4px'}}>Richieste di iscrizione</h1>
<p style={{margin:0,fontSize:14,color:'#6b5c4e'}}>Approva o rifiuta le nuove richieste di accesso</p></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24}}>
{[{l:'In attesa',v:counts.pending,c:'#f59e0b',bg:'#fef3c7',i:Clock},{l:'Approvati',v:counts.attivo,c:'#22c55e',bg:'#dcfce7',i:CircleCheckBig},{l:'Rifiutati',v:counts.rifiutato,c:'#ef4444',bg:'#fee2e2',i:CircleX}].map(({l,v,c,bg,i:I})=>
<div key={l} style={{borderRadius:14,padding:'16px 18px',background:'#fff',border:'1px solid #e8e2da'}}>
<div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><div style={{width:28,height:28,borderRadius:7,background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}><I size={13} color={c}/></div><span style={{fontSize:11,fontWeight:600,color:'#6b5c4e',textTransform:'uppercase'}}>{l}</span></div>
<div style={{fontSize:28,fontWeight:700,color:'#1a1411'}}>{v}</div></div>)}</div>
<div style={{display:'flex',gap:4,borderBottom:'1px solid #e8e2da',marginBottom:20,flexWrap:'wrap'}}>
{[{k:'pending',l:'In attesa'},{k:'attivo',l:'Approvati'},{k:'rifiutato',l:'Rifiutati'}].map(t=>
<button key={t.k} onClick={()=>setTab(t.k)} style={{padding:'8px 16px',border:0,background:'transparent',fontSize:14,fontWeight:tab===t.k?600:400,color:tab===t.k?'#c8843f':'#6b5c4e',borderBottom:tab===t.k?'2px solid #c8843f':'2px solid transparent',marginBottom:-1}}>{t.l}</button>)}</div>
{ld?<div style={{textAlign:'center',padding:'48px 0',color:'#6b5c4e'}}>Caricamento…</div>:data.length===0?
<div style={{textAlign:'center',padding:'48px 0',color:'#6b5c4e'}}>Nessuna richiesta {tab==='pending'?'in attesa':tab==='attivo'?'approvata':'rifiutata'}.</div>:
<div style={{display:'flex',flexDirection:'column',gap:10}}>{data.map(u=>{const uid=u._id||u.id;
return<div key={uid} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 18px',borderRadius:14,background:'#fff',border:'1px solid #e8e2da',opacity:u._b?.5:1,flexWrap:'wrap'}}>
<div style={{width:40,height:40,borderRadius:10,flexShrink:0,background:'linear-gradient(135deg,#d4915a,#8b5520)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Fraunces',fontSize:14,fontWeight:600}}>{u.nome?.[0]}{u.cognome?.[0]}</div>
<div style={{flex:1,minWidth:180}}><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{u.nome} {u.cognome}</div>
<div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
<span style={{display:'flex',alignItems:'center',gap:4,fontSize:13,color:'#6b5c4e'}}><Mail size={12}/> {u.email}</span>
<span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#9e8e7e'}}><Calendar size={11}/> {fD(u.createdAt)}</span></div></div>
{tab==='attivo'?<div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'#22c55e'}}><CircleCheckBig size={15}/> Approvato</div>:
tab==='rifiutato'?<div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'#ef4444'}}><CircleX size={15}/> Rifiutato</div>:
<div style={{display:'flex',gap:8}}>
<button onClick={()=>rifiuta(uid)} disabled={u._b} style={{height:36,padding:'0 14px',borderRadius:9,background:'transparent',border:'1.5px solid #e8b8a8',fontSize:13,fontWeight:600,color:'#c0392b'}}>Rifiuta</button>
<button onClick={()=>approva(uid)} disabled={u._b} style={{height:36,padding:'0 16px',borderRadius:9,background:'linear-gradient(180deg,#c8843f,#a06525)',boxShadow:'0 0 0 1px rgba(110,62,21,.55)',border:0,fontSize:13,fontWeight:600,color:'#fff',opacity:u._b?.6:1}}>{u._b?'…':'Approva →'}</button></div>}
</div>;})}</div>}</div>;
}
