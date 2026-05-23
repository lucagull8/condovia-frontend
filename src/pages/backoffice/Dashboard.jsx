import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Wallet, CircleAlert, Plus } from 'lucide-react';
import { Badge } from '../../components/Shared';
import { boGetDashboard, boGetRichieste, boGetContratti } from '../../api';
const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });
export default function BackofficeDashboard() {
  const [kpi, setKpi] = useState(null);
  const [richieste, setRichieste] = useState([]);
  const [contratti, setContratti] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([boGetDashboard(), boGetRichieste('in_attesa'), boGetContratti()])
      .then(([k, r, c]) => { setKpi(k); setRichieste(r); setContratti(c); })
      .finally(() => setLoading(false));
  }, []);
  const cards = kpi ? [
    { label: 'Contratti attivi', val: kpi.contrattiAttivi, icon: FileText, bg: 'linear-gradient(135deg,#c8843f,#8b5520)' },
    { label: 'Margine Condovia', val: `€ ${fmt(kpi.margineMese)}`, icon: TrendingUp, bg: 'linear-gradient(135deg,#6e9a6e,#3d6b3d)' },
    { label: 'Storni erogati', val: `€ ${fmt(kpi.stornoMese)}`, icon: Wallet, bg: 'linear-gradient(135deg,#6b7280,#374151)' },
    { label: 'Richieste in attesa', val: kpi.richiesteInAttesa, icon: CircleAlert, bg: 'linear-gradient(135deg,#ef4444,#b91c1c)' },
  ] : [];
  return <>
    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center' }}>
      <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, margin: 0 }}>Dashboard commerciale</h1>
    </div>
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {loading ? <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)' }}>Caricamento…</div> : <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          {cards.map(({ label, val, icon: I, bg }) => <div key={label} style={{ border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}><div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{label}</div><div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={15} color="#fff" /></div></div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em' }}>{val}</div>
          </div>)}
        </div>
        {richieste.length > 0 && <div style={{ border: '1px solid var(--border)', borderRadius: 20, background: 'var(--surface)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}><span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Fraunces' }}>Richieste in attesa ({richieste.length})</span></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}><thead><tr style={{ background: 'var(--bg)' }}>
            {['Amministratore','Condominio','Servizio','Data','Azione'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)' }}>{h}</th>)}
          </tr></thead><tbody>{richieste.map(r => <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '12px 16px', fontSize: 13.5 }}>{r.amministratoreId?.nome} {r.amministratoreId?.cognome}</td>
            <td style={{ padding: '12px 16px', fontSize: 13.5 }}>{r.condominioId?.nome || '—'}</td>
            <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 500 }}>{r.servizioId}</td>
            <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--ink-soft)' }}>{new Date(r.createdAt).toLocaleDateString('it-IT')}</td>
            <td style={{ padding: '12px 16px' }}><Link to="/backoffice/richieste" style={{ height: 32, padding: '0 12px', borderRadius: 8, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 12.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Gestisci →</Link></td>
          </tr>)}</tbody></table></div>
        </div>}
        {contratti.length > 0 && <div style={{ border: '1px solid var(--border)', borderRadius: 20, background: 'var(--surface)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Fraunces' }}>Contratti ({contratti.length})</span>
            <Link to="/backoffice/contratti" style={{ fontSize: 13, color: 'var(--copper-dark)', fontWeight: 600 }}>Vedi tutti →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}><thead><tr style={{ background: 'var(--bg)' }}>
            {['Admin','Servizio','Prezzo','Storno','Margine','Stato'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)' }}>{h}</th>)}
          </tr></thead><tbody>{contratti.slice(0,5).map(c => <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '11px 14px', fontSize: 13 }}>{c.amministratoreId?.nome} {c.amministratoreId?.cognome}</td>
            <td style={{ padding: '11px 14px', fontSize: 13 }}>{c.servizioId}</td>
            <td style={{ padding: '11px 14px', fontSize: 13 }}>€ {fmt(c.prezzo)}</td>
            <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--ink-soft)' }}>€ {fmt(c.stornoAmmontare)}</td>
            <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--copper-dark)', fontWeight: 600 }}>€ {fmt(c.margineCondovia)}</td>
            <td style={{ padding: '11px 14px' }}>{c.stato === 'attivo' ? <Badge variant="attivo" dot>Attivo</Badge> : <Badge variant="scadenza" dot>Scadenza</Badge>}</td>
          </tr>)}</tbody></table></div>
        </div>}
        {richieste.length === 0 && contratti.length === 0 && <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)' }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nessuna attività ancora</div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Le richieste e i contratti appariranno qui quando gli amministratori inizieranno a usare la piattaforma.</div>
        </div>}
      </>}
    </div>
  </>;
}
