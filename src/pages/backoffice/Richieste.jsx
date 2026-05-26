import { useState, useEffect, useMemo, useCallback } from 'react';
import { StickyNote, FileText, Upload, X, Check, AlertCircle, ChevronLeft, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/Shared';
import { BASE, boGetRichieste, boPatchRichiesta, boPostContratto, boGetServizi, boGetCondominiAdmin } from '../../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });

const COLORI = [
  'linear-gradient(135deg,#d4915a,#8b5520)',
  'linear-gradient(135deg,#4a90c4,#1e5f8c)',
  'linear-gradient(135deg,#6e9a6e,#3d6b3d)',
  'linear-gradient(135deg,#9b59b6,#6c3483)',
];

export default function Richieste() {
  // Vista: null = lista admin, string = adminId selezionato
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [allRichieste, setAllRichieste] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [serviziMap, setServiziMap] = useState({});

  // Modal contratto
  const [modal, setModal] = useState(null);
  const [condomini, setCondomini] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const doRefresh = () => { setRefreshing(true); setRefreshKey(k => k + 1); };
  const [form, setForm] = useState({ fornitore: '', commissioneCondovia: '', stornoTipo: 'fix', stornoValore: '', dataInizio: '', dataScadenza: '', condominioId: '' });
  const [pdf, setPdf] = useState(null);
  const [pods, setPods] = useState([{ podNumber: '', pdf: null }]);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  // Carica servizi una volta sola
  useEffect(() => {
    boGetServizi().then(s => {
      const m = {};
      for (const sv of s) m[sv.sid] = sv;
      setServiziMap(m);
    });
  }, []);

  // Quando è selezionato un admin, carica le sue richieste (filtrate per stato)
  useEffect(() => {
    if (selectedAdmin) {
      setLoading(true);
      boGetRichieste(tab, selectedAdmin._id)
        .then(setData)
        .finally(() => { setLoading(false); setRefreshing(false); });
    }
  }, [tab, selectedAdmin, refreshKey]);

  // Carica tutte le richieste per la vista raggruppata
  useEffect(() => {
    if (!selectedAdmin) {
      setLoading(true);
      boGetRichieste('', '')
        .then(r => { setAllRichieste(r); })
        .finally(() => { setLoading(false); setRefreshing(false); });
    }
  }, [selectedAdmin, refreshKey]);

  // Raggruppa per admin
  const adminGroups = useMemo(() => {
    const map = {};
    for (const r of allRichieste) {
      const aid = r.amministratoreId?._id;
      if (!aid) continue;
      if (!map[aid]) map[aid] = { admin: r.amministratoreId, richieste: [] };
      map[aid].richieste.push(r);
    }
    return Object.values(map);
  }, [allRichieste]);

  const avanza = async (id, stato) => {
    try {
      await boPatchRichiesta(id, { stato });
      setData(d => d.map(r => r._id === id ? { ...r, stato } : r));
      setAllRichieste(d => d.map(r => r._id === id ? { ...r, stato } : r));
    } catch (e) { alert(e.message); }
  };

  const addNota = async (id) => {
    const t = prompt('Nota interna:');
    if (!t) return;
    try { await boPatchRichiesta(id, { notaInterna: t }); } catch (e) { alert(e.message); }
  };

  const openContrattoModal = async (r) => {
    setModal(r);
    setSaveErr('');
    setForm({
      fornitore: '', commissioneCondovia: '',
      stornoTipo: 'fix', stornoValore: '',
      dataInizio: new Date().toISOString().split('T')[0],
      dataScadenza: new Date(Date.now() + 365 * 864e5).toISOString().split('T')[0],
      condominioId: r.condominioId?._id || '',
    });
    setPdf(null);
    setPods([{ podNumber: '', pdf: null }]);
    if (r.amministratoreId?._id) {
      try {
        const c = await boGetCondominiAdmin(r.amministratoreId._id);
        setCondomini(c);
        if (!r.condominioId?._id && c.length > 0) setForm(f => ({ ...f, condominioId: c[0]._id }));
      } catch { setCondomini([]); }
    }
  };

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isEnergia = modal?.servizioId === 'energia';

  // Calcolo anteprima con commissione diretta
  const commNum = parseFloat(form.commissioneCondovia) || 0;
  const stornoVal = parseFloat(form.stornoValore) || 0;
  const stornoAmm = form.stornoTipo === 'pct' ? (commNum * stornoVal / 100) : stornoVal;
  const margine = commNum - stornoAmm;

  const handleSave = async () => {
    if (!form.fornitore || !form.dataInizio || !form.dataScadenza) {
      setSaveErr('Compila tutti i campi obbligatori.'); return;
    }
    if (!form.condominioId) { setSaveErr('Seleziona un condominio.'); return; }
    if (commNum <= 0) { setSaveErr('Inserisci la commissione Condovia (€).'); return; }
    if (margine < 0) { setSaveErr('Lo storno supera la commissione. Margine negativo.'); return; }

    setSaving(true); setSaveErr('');
    try {
      const fd = new FormData();
      fd.append('amministratoreId', modal.amministratoreId?._id || modal.amministratoreId);
      fd.append('condominioId', form.condominioId);
      fd.append('servizioId', modal.servizioId);
      fd.append('fornitore', form.fornitore);
      fd.append('commissioneCondovia', form.commissioneCondovia);
      fd.append('stornoTipo', form.stornoTipo);
      fd.append('stornoValore', form.stornoValore || '0');
      fd.append('dataInizio', form.dataInizio);
      fd.append('dataScadenza', form.dataScadenza);
      fd.append('richiestaId', modal._id);
      if (pdf) fd.append('pdf', pdf);

      // Multi-POD per energia
      if (isEnergia && pods.length > 0) {
        fd.append('pods', JSON.stringify(pods.map(p => ({ podNumber: p.podNumber }))));
        pods.forEach((p, idx) => { if (p.pdf) fd.append(`pod_pdf_${idx}`, p.pdf); });
      }

      await boPostContratto(fd);
      setData(d => d.map(r => r._id === modal._id ? { ...r, stato: 'contratto_caricato' } : r));
      setAllRichieste(d => d.map(r => r._id === modal._id ? { ...r, stato: 'contratto_caricato' } : r));
      setModal(null);
    } catch (e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', height: 42, borderRadius: 10, padding: '0 12px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };

  // ─── Vista 1: lista admin raggruppata ───────────────────
  if (!selectedAdmin) {
    return (
      <>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(18px,3vw,24px)', margin: 0, flex: 1 }}>Richieste per amministratore</h1>
          <button onClick={doRefresh} disabled={refreshing} title="Aggiorna" style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)' }}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Aggiorno…' : 'Aggiorna'}
          </button>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
        <div style={{ padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)' }}>Caricamento…</div>
          ) : adminGroups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nessuna richiesta</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Le richieste degli amministratori appariranno qui.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {adminGroups.map(({ admin, richieste }, i) => {
                const inAttesa = richieste.filter(r => r.stato === 'in_attesa').length;
                const contattato = richieste.filter(r => r.stato === 'contattato').length;
                const conContratto = richieste.filter(r => r.stato === 'contratto_caricato').length;
                return (
                  <div key={admin._id}
                    onClick={() => { setSelectedAdmin(admin); setTab(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'box-shadow .15s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px -8px rgba(0,0,0,.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORI[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {(admin.nome?.[0] || '') + (admin.cognome?.[0] || '')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{admin.nome} {admin.cognome}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{admin.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {inAttesa > 0 && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#c8843f', background: '#fef3e2', borderRadius: 6, padding: '3px 8px' }}>{inAttesa} in attesa</span>}
                      {contattato > 0 && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#6b5c4e', background: '#f0ebe4', borderRadius: 6, padding: '3px 8px' }}>{contattato} contattate</span>}
                      {conContratto > 0 && <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)', borderRadius: 6, padding: '3px 8px' }}>{conContratto} con contratto</span>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--copper-dark)', minWidth: 60, textAlign: 'right' }}>{richieste.length} tot.</div>
                    <div style={{ color: 'var(--ink-soft)', marginLeft: 4 }}>›</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  }

  // ─── Vista 2: richieste di un admin specifico ───────────
  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => { setSelectedAdmin(null); setTab(''); }} style={{ display: 'flex', alignItems: 'center', gap: 4, height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)' }}>
          <ChevronLeft size={14} /> Indietro
        </button>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(16px,3vw,22px)', margin: 0, flex: 1 }}>
          {selectedAdmin.nome} {selectedAdmin.cognome}
        </h1>
        <button onClick={doRefresh} disabled={refreshing} title="Aggiorna" style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)' }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Aggiorno…' : 'Aggiorna'}
        </button>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Filtro stato */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[{ k: '', l: 'Tutte' }, { k: 'in_attesa', l: 'In attesa' }, { k: 'contattato', l: 'Contattate' }, { k: 'contratto_caricato', l: 'Con contratto' }, { k: 'chiusa', l: 'Chiuse' }].map(({ k, l }) => (
            <button key={k} onClick={() => setTab(k)} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 0, cursor: 'pointer', background: tab === k ? 'var(--copper-50)' : 'transparent', color: tab === k ? 'var(--copper-dark)' : 'var(--ink-soft)', fontWeight: tab === k ? 600 : 400, fontSize: 13, boxShadow: tab === k ? '0 0 0 1px var(--copper-100)' : 'none' }}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)' }}>Caricamento…</div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Nessuna richiesta</div>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, background: 'var(--surface)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  {['Condominio', 'Servizio', 'Note', 'Data', 'Stato', 'Azioni'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {data.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13 }}>{r.condominioId?.nome || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500 }}>{serviziMap[r.servizioId]?.label || r.servizioId}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--ink-soft)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.note || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--ink-soft)' }}>{new Date(r.createdAt).toLocaleDateString('it-IT')}</td>
                      <td style={{ padding: '12px 14px' }}>
                        {r.stato === 'in_attesa' && <Badge variant="orange" dot>In attesa</Badge>}
                        {r.stato === 'contattato' && <Badge variant="rame" dot>Contattato</Badge>}
                        {r.stato === 'contratto_caricato' && <Badge variant="attivo" dot>Contratto ✓</Badge>}
                        {r.stato === 'chiusa' && <Badge dot>Chiusa</Badge>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {r.stato === 'in_attesa' && (
                            <button onClick={() => avanza(r._id, 'contattato')} style={{ height: 30, padding: '0 10px', borderRadius: 7, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 12, fontWeight: 600 }}>Contattato</button>
                          )}
                          {(r.stato === 'in_attesa' || r.stato === 'contattato') && (
                            <button onClick={() => openContrattoModal(r)} style={{ height: 30, padding: '0 10px', borderRadius: 7, border: 0, background: 'var(--success)', color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <FileText size={11} /> Carica contratto
                            </button>
                          )}
                          {r.stato === 'contattato' && (
                            <button onClick={() => avanza(r._id, 'chiusa')} style={{ height: 30, padding: '0 10px', borderRadius: 7, border: 0, boxShadow: '0 0 0 1.5px var(--border)', background: 'transparent', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Chiudi</button>
                          )}
                          <button onClick={() => addNota(r._id)} title="Nota" style={{ width: 30, height: 30, borderRadius: 7, border: 0, boxShadow: '0 0 0 1.5px var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StickyNote size={13} color="var(--ink-soft)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ═══ MODALE CARICA CONTRATTO ═══ */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'auto' }} onClick={() => setModal(null)}>
          <div style={{ width: '100%', maxWidth: 580, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 30px 60px -20px rgba(20,12,6,.4)', position: 'relative', animation: 'rise .3s cubic-bezier(.2,.7,.3,1)', maxHeight: '95vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes rise{from{transform:translateY(16px) scale(.97);opacity:0}to{transform:none;opacity:1}}`}</style>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} color="#fff" strokeWidth={1.6} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: 0 }}>Carica contratto</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>
                  {serviziMap[modal.servizioId]?.label || modal.servizioId} — {modal.amministratoreId?.nome} {modal.amministratoreId?.cognome}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Fornitore */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Fornitore *</label>
                <input value={form.fornitore} onChange={e => setF('fornitore', e.target.value)} placeholder="Es. Enel Energia" style={inp} />
              </div>

              {/* Condominio */}
              {condomini.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Condominio *</label>
                  <select value={form.condominioId} onChange={e => setF('condominioId', e.target.value)} style={inp}>
                    {condomini.map(c => <option key={c._id} value={c._id}>{c.nome} — {c.via}, {c.citta}</option>)}
                  </select>
                </div>
              )}

              {/* Commissione Condovia */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Commissione Condovia (€) *</label>
                <input type="number" value={form.commissioneCondovia} onChange={e => setF('commissioneCondovia', e.target.value)} placeholder="Es. 500" style={inp} />
              </div>

              {/* Storno */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Tipo storno (su commissione)</label>
                  <select value={form.stornoTipo} onChange={e => setF('stornoTipo', e.target.value)} style={inp}>
                    <option value="fix">Fisso (€)</option>
                    <option value="pct">Percentuale (% su commissione)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Valore storno</label>
                  <input type="number" value={form.stornoValore} onChange={e => setF('stornoValore', e.target.value)} placeholder={form.stornoTipo === 'fix' ? '85' : '10'} style={inp} />
                </div>
              </div>

              {/* Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Data inizio *</label>
                  <input type="date" value={form.dataInizio} onChange={e => setF('dataInizio', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Data scadenza *</label>
                  <input type="date" value={form.dataScadenza} onChange={e => setF('dataScadenza', e.target.value)} style={inp} />
                </div>
              </div>

              {/* PDF principale */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>PDF contratto (opzionale)</label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 42, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'var(--bg)', fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <Upload size={14} /> {pdf ? pdf.name : 'Seleziona file PDF'}
                  <input type="file" accept=".pdf" onChange={e => setPdf(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Multi-POD (solo energia) */}
              {isEnergia && (
                <div style={{ padding: '14px', borderRadius: 12, border: '1.5px solid var(--copper-100)', background: 'var(--copper-50)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--copper-dark)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>POD (punti di fornitura)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pods.map((pod, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center' }}>
                        <input
                          value={pod.podNumber}
                          onChange={e => setPods(ps => ps.map((p, i) => i === idx ? { ...p, podNumber: e.target.value } : p))}
                          placeholder={`POD ${idx + 1} (es. IT001E00000000)`}
                          style={{ ...inp, height: 38 }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 10px', borderRadius: 8, border: '1.5px dashed var(--border)', background: 'var(--surface)', fontSize: 12, color: 'var(--ink-soft)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <Upload size={12} /> {pod.pdf ? pod.pdf.name.substring(0, 15) + '…' : 'PDF'}
                          <input type="file" accept=".pdf" onChange={e => setPods(ps => ps.map((p, i) => i === idx ? { ...p, pdf: e.target.files[0] } : p))} style={{ display: 'none' }} />
                        </label>
                        {pods.length > 1 && (
                          <button onClick={() => setPods(ps => ps.filter((_, i) => i !== idx))} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Trash2 size={13} color="var(--danger)" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setPods(ps => [...ps, { podNumber: '', pdf: null }])} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: 0, background: 'var(--copper-100)', color: 'var(--copper-dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={13} /> Aggiungi POD
                  </button>
                </div>
              )}

              {/* Anteprima calcolo */}
              {commNum > 0 && (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'linear-gradient(155deg,#2e251f,#1a1411)', color: '#f5ece0', marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,236,224,.5)', marginBottom: 10 }}>Anteprima calcolo</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(245,236,224,.5)', marginBottom: 2 }}>Commissione Condovia</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>€ {fmt(commNum)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(245,236,224,.5)', marginBottom: 2 }}>Storno admin</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#d4915a' }}>−€ {fmt(stornoAmm)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(245,236,224,.5)', marginBottom: 2 }}>Margine Condovia</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: margine >= 0 ? '#86efac' : '#f87171' }}>€ {fmt(margine)}</div>
                    </div>
                  </div>
                </div>
              )}

              {saveErr && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>
                  <AlertCircle size={14} /> {saveErr}
                </div>
              )}

              <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 48, borderRadius: 12, border: 0, marginTop: 4, background: saving ? 'rgba(93,122,93,.4)' : 'var(--success)', boxShadow: saving ? 'none' : '0 8px 20px -10px rgba(93,122,93,.5)', color: '#fff', fontSize: 15, fontWeight: 600 }}>
                <Check size={16} /> {saving ? 'Salvataggio…' : 'Carica contratto e accredita storno'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
