import { useState, useEffect } from 'react';
import { StickyNote, FileText, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/Shared';
import { boGetRichieste, boPatchRichiesta, boPostContratto, boGetServizi, boGetCondominiAdmin } from '../../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });

export default function Richieste() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [serviziMap, setServiziMap] = useState({});

  // Modal state
  const [modal, setModal] = useState(null); // richiesta object or null
  const [condomini, setCondomini] = useState([]);
  const [form, setForm] = useState({ fornitore: '', prezzo: '', stornoTipo: 'fix', stornoValore: '', dataInizio: '', dataScadenza: '', condominioId: '' });
  const [pdf, setPdf] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([boGetRichieste(tab), boGetServizi()])
      .then(([r, s]) => {
        setData(r);
        const m = {};
        for (const sv of s) m[sv.sid] = sv;
        setServiziMap(m);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  const avanza = async (id, stato) => {
    try { await boPatchRichiesta(id, { stato }); setData(d => d.map(r => r._id === id ? { ...r, stato } : r)); } catch (e) { alert(e.message); }
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
      fornitore: '', prezzo: '', stornoTipo: 'fix', stornoValore: '',
      dataInizio: new Date().toISOString().split('T')[0],
      dataScadenza: new Date(Date.now() + 365 * 864e5).toISOString().split('T')[0],
      condominioId: r.condominioId?._id || '',
    });
    setPdf(null);

    // Load condomini for this admin
    if (r.amministratoreId?._id) {
      try {
        const c = await boGetCondominiAdmin(r.amministratoreId._id);
        setCondomini(c);
        if (!r.condominioId?._id && c.length > 0) {
          setForm(f => ({ ...f, condominioId: c[0]._id }));
        }
      } catch (e) { setCondomini([]); }
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Calculate preview
  const servizio = modal ? serviziMap[modal.servizioId] : null;
  const commPct = servizio?.commissionePct || 0.15;
  const prezzoNum = parseFloat(form.prezzo) || 0;
  const stornoVal = parseFloat(form.stornoValore) || 0;
  const commissione = prezzoNum * commPct;
  const stornoAmm = form.stornoTipo === 'pct' ? (prezzoNum * stornoVal / 100) : stornoVal;
  const margine = commissione - stornoAmm;

  const handleSave = async () => {
    if (!form.fornitore || !form.prezzo || !form.dataInizio || !form.dataScadenza) {
      setSaveErr('Compila tutti i campi obbligatori.'); return;
    }
    if (!form.condominioId) {
      setSaveErr('Seleziona un condominio.'); return;
    }
    if (margine < 0) {
      setSaveErr('Attenzione: lo storno supera la commissione. Margine negativo.'); return;
    }

    setSaving(true); setSaveErr('');
    try {
      const fd = new FormData();
      fd.append('amministratoreId', modal.amministratoreId?._id || modal.amministratoreId);
      fd.append('condominioId', form.condominioId);
      fd.append('servizioId', modal.servizioId);
      fd.append('fornitore', form.fornitore);
      fd.append('prezzo', form.prezzo);
      fd.append('stornoTipo', form.stornoTipo);
      fd.append('stornoValore', form.stornoValore);
      fd.append('dataInizio', form.dataInizio);
      fd.append('dataScadenza', form.dataScadenza);
      fd.append('richiestaId', modal._id);
      if (pdf) fd.append('pdf', pdf);

      await boPostContratto(fd);

      // Update richiesta in list
      setData(d => d.map(r => r._id === modal._id ? { ...r, stato: 'contratto_caricato' } : r));
      setModal(null);
    } catch (e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', height: 42, borderRadius: 10, padding: '0 12px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(18px,3vw,24px)', margin: 0 }}>Richieste servizio</h1>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[{ k: '', l: 'Tutte' }, { k: 'in_attesa', l: 'In attesa' }, { k: 'contattato', l: 'Contattate' }, { k: 'contratto_caricato', l: 'Con contratto' }, { k: 'chiusa', l: 'Chiuse' }].map(({ k, l }) => (
            <button key={k} onClick={() => setTab(k)} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 0, cursor: 'pointer', background: tab === k ? 'var(--copper-50)' : 'transparent', color: tab === k ? 'var(--copper-dark)' : 'var(--ink-soft)', fontWeight: tab === k ? 600 : 400, fontSize: 13, boxShadow: tab === k ? '0 0 0 1px var(--copper-100)' : 'none' }}>{l}</button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)' }}>Caricamento…</div> : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nessuna richiesta</div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Le richieste degli amministratori appariranno qui.</div>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, background: 'var(--surface)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  {['Amministratore', 'Condominio', 'Servizio', 'Note', 'Data', 'Stato', 'Azioni'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {data.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13 }}>{r.amministratoreId?.nome} {r.amministratoreId?.cognome}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13 }}>{r.condominioId?.nome || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 500 }}>{serviziMap[r.servizioId]?.label || r.servizioId}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--ink-soft)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.note || '—'}</td>
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
          <div style={{ width: '100%', maxWidth: 560, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 30px 60px -20px rgba(20,12,6,.4)', position: 'relative', animation: 'rise .3s cubic-bezier(.2,.7,.3,1)', maxHeight: '95vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
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

            {/* Info richiesta */}
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--copper-50)', border: '1px solid var(--copper-100)', marginBottom: 16, fontSize: 13 }}>
              <strong>Condominio:</strong> {modal.condominioId?.nome || '—'} · <strong>Commissione servizio:</strong> {(commPct * 100).toFixed(0)}%
              {servizio?.commissioneNote && <span style={{ color: 'var(--ink-soft)' }}> ({servizio.commissioneNote})</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Fornitore *</label>
                <input value={form.fornitore} onChange={e => set('fornitore', e.target.value)} placeholder="Es. Elettrica Roma S.r.l." style={inp} />
              </div>

              {condomini.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Condominio *</label>
                  <select value={form.condominioId} onChange={e => set('condominioId', e.target.value)} style={inp}>
                    {condomini.map(c => <option key={c._id} value={c._id}>{c.nome} — {c.via}, {c.citta}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Prezzo annuo (€) *</label>
                  <input type="number" value={form.prezzo} onChange={e => set('prezzo', e.target.value)} placeholder="1200" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Tipo storno</label>
                  <select value={form.stornoTipo} onChange={e => set('stornoTipo', e.target.value)} style={inp}>
                    <option value="fix">Fisso (€)</option>
                    <option value="pct">Percentuale (%)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Valore storno</label>
                  <input type="number" value={form.stornoValore} onChange={e => set('stornoValore', e.target.value)} placeholder={form.stornoTipo === 'fix' ? '85' : '7'} style={inp} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Data inizio *</label>
                  <input type="date" value={form.dataInizio} onChange={e => set('dataInizio', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Data scadenza *</label>
                  <input type="date" value={form.dataScadenza} onChange={e => set('dataScadenza', e.target.value)} style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>PDF contratto (opzionale)</label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 42, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'var(--bg)', fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <Upload size={14} /> {pdf ? pdf.name : 'Seleziona file PDF'}
                  <input type="file" accept=".pdf" onChange={e => setPdf(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Preview calcolo */}
              {prezzoNum > 0 && (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'linear-gradient(155deg,#2e251f,#1a1411)', color: '#f5ece0', marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,236,224,.5)', marginBottom: 10 }}>Anteprima calcolo</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(245,236,224,.5)', marginBottom: 2 }}>Commissione ({(commPct * 100).toFixed(0)}%)</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>€ {fmt(commissione)}</div>
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
