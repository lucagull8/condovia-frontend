import { useMemo, useState } from 'react';
import { FileText, Upload, Download, Trash2, Search, X } from 'lucide-react';

const MESI = ['Tutti', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

const fmtD = d => d ? new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const norm = s => String(s || '').toLowerCase();

// Pannello riutilizzabile per gestire una lista di documenti (contratti o fatture).
// Se onUpload/onDelete sono passati, mostra i controlli di modifica (backoffice).
// Altrimenti è solo lettura (lato amministratore).
export function DocumentiPanel({
  titolo,
  tipo,             // 'contratto' | 'fattura'
  docs,             // array di documenti [{_id, titolo, dataDocumento, fileName, createdAt, ...}]
  fileUrl,          // (doc) => URL per aprire il file
  onUpload,         // async (file, titolo, dataDocumento) => void  — se null, no upload
  onDelete,         // async (docId) => void — se null, no delete
  filtroPerMese = false,  // true per fatture
  emptyText = 'Nessun documento caricato',
}) {
  const [q, setQ] = useState('');
  const [anno, setAnno] = useState('');
  const [mese, setMese] = useState(''); // '' = tutti, '1'..'12'
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Modale upload
  const [showModal, setShowModal] = useState(false);
  const [modTitolo, setModTitolo] = useState('');
  const [modData, setModData] = useState('');
  const [modFile, setModFile] = useState(null);

  const anni = useMemo(() => {
    const set = new Set();
    for (const d of docs) {
      const dt = d.dataDocumento || d.createdAt;
      if (dt) set.add(new Date(dt).getFullYear());
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [docs]);

  const filtrati = useMemo(() => {
    const qq = norm(q);
    return docs.filter(d => {
      const dt = d.dataDocumento || d.createdAt;
      const dObj = dt ? new Date(dt) : null;
      if (anno && (!dObj || dObj.getFullYear() !== Number(anno))) return false;
      if (mese && (!dObj || (dObj.getMonth() + 1) !== Number(mese))) return false;
      if (qq) {
        const hay = norm(`${d.titolo || ''} ${d.fileName || ''} ${d.note || ''}`);
        if (!hay.includes(qq)) return false;
      }
      return true;
    });
  }, [docs, q, anno, mese]);

  const submit = async () => {
    if (!modFile) { setErr('Seleziona un file'); return; }
    setBusy(true); setErr('');
    try {
      await onUpload(modFile, modTitolo, modData);
      setShowModal(false); setModFile(null); setModTitolo(''); setModData('');
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const del = async (d) => {
    if (!confirm(`Eliminare "${d.titolo || d.fileName}"?`)) return;
    try { await onDelete(d._id); } catch (e) { alert(e.message); }
  };

  const clearFilters = () => { setQ(''); setAnno(''); setMese(''); };
  const hasFilters = q || anno || mese;

  const inp = { height: 36, borderRadius: 8, padding: '0 10px', border: '1px solid var(--border)', background: '#fff', fontSize: 13, boxSizing: 'border-box' };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header + azione upload */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={16} color="var(--copper-dark)" />
          <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: 0 }}>{titolo}</h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>({docs.length})</span>
        </div>
        {onUpload && (
          <button onClick={() => { setErr(''); setModTitolo(''); setModData(''); setModFile(null); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 10, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Upload size={14} /> Carica {tipo === 'fattura' ? 'fattura' : 'contratto'}
          </button>
        )}
      </div>

      {/* Filtri */}
      {docs.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12, padding: 10, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)', pointerEvents: 'none' }} />
            <input placeholder="Cerca per titolo o nome file…" value={q} onChange={e => setQ(e.target.value)} style={{ ...inp, width: '100%', paddingLeft: 30 }} />
          </div>
          {anni.length > 0 && (
            <select value={anno} onChange={e => setAnno(e.target.value)} style={inp}>
              <option value="">Tutti gli anni</option>
              {anni.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}
          {filtroPerMese && (
            <select value={mese} onChange={e => setMese(e.target.value)} style={inp}>
              <option value="">Tutti i mesi</option>
              {MESI.slice(1).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          )}
          {hasFilters && (
            <button onClick={clearFilters} style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 12, color: 'var(--ink-soft)', cursor: 'pointer' }}>Pulisci</button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-soft)' }}>{filtrati.length} risult{filtrati.length === 1 ? 'ato' : 'ati'}</div>
        </div>
      )}

      {/* Lista */}
      {docs.length === 0 ? (
        <div style={{ padding: '32px 16px', border: '1px dashed var(--border)', borderRadius: 12, background: 'var(--bg)', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13.5 }}>
          {emptyText}
        </div>
      ) : filtrati.length === 0 ? (
        <div style={{ padding: '24px 16px', border: '1px dashed var(--border)', borderRadius: 12, background: 'var(--bg)', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>
          Nessun documento corrisponde ai filtri. <button onClick={clearFilters} style={{ background: 'transparent', border: 0, color: 'var(--copper-dark)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Pulisci filtri</button>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
          {filtrati.map((d, i) => (
            <div key={d._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < filtrati.length - 1 ? '1px solid var(--border)' : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--copper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={16} color="var(--copper-dark)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.titolo || d.fileName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span>{fmtD(d.dataDocumento || d.createdAt)}</span>
                  {d.titolo && d.fileName && <span style={{ opacity: 0.7 }}>· {d.fileName}</span>}
                </div>
              </div>
              <a href={fileUrl(d)} target="_blank" rel="noreferrer" title="Apri" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', color: 'var(--copper-dark)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                <Download size={13} /> Apri
              </a>
              {onDelete && (
                <button onClick={() => del(d)} title="Elimina" style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#c04040', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modale upload */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => !busy && setShowModal(false)}>
          <div style={{ width: '100%', maxWidth: 460, background: 'var(--surface)', borderRadius: 18, padding: '24px 22px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => !busy && setShowModal(false)} style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: 7, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
            <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: '0 0 4px' }}>Carica {tipo === 'fattura' ? 'fattura' : 'contratto'}</h3>
            <p style={{ margin: '0 0 18px', fontSize: 12.5, color: 'var(--ink-soft)' }}>PDF fino a 20MB. Il titolo aiuta a ritrovare il documento più tardi.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 5 }}>Titolo (consigliato)</label>
                <input value={modTitolo} onChange={e => setModTitolo(e.target.value)} placeholder={tipo === 'fattura' ? 'Es. Fattura gennaio 2026' : 'Es. Contratto Enel — Antincendio'} style={{ width: '100%', height: 40, borderRadius: 8, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 5 }}>Data documento</label>
                <input type="date" value={modData} onChange={e => setModData(e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 5 }}>File PDF *</label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'var(--bg)', fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <Upload size={14} /> {modFile ? modFile.name : 'Seleziona PDF'}
                  <input type="file" accept=".pdf" onChange={e => setModFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>
              {err && <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(220,80,60,.08)', border: '1px solid rgba(220,80,60,.25)', color: 'var(--danger)', fontSize: 12.5 }}>{err}</div>}
              <button onClick={submit} disabled={busy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                <Upload size={14} /> {busy ? 'Caricamento…' : 'Carica'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
