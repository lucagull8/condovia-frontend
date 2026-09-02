import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, X, Check, FileText, Upload } from 'lucide-react';
import { Badge } from '../../components/Shared';
import { useVisibilityRefresh } from '../../hooks/useVisibilityRefresh';
import { boGetContratti, boGetContrattoFileUrl, boPostContratto, boGetAmministratori, boGetCondominiAdmin, boGetServizi } from '../../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });
const fmtD = d => d ? new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const todayISO = () => new Date().toISOString().split('T')[0];
const inYear = () => new Date(Date.now() + 365 * 864e5).toISOString().split('T')[0];

const inp = { width: '100%', height: 42, borderRadius: 10, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, boxSizing: 'border-box' };
const lbl = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 };

export default function Contratti() {
  const [data, setData] = useState([]);
  const [ld, setLd] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [servizi, setServizi] = useState([]);
  const [condomini, setCondomini] = useState([]);
  const [form, setForm] = useState({
    amministratoreId: '', condominioId: '', servizioId: '',
    fornitore: '', commissioneCondovia: '', stornoTipo: 'fix', stornoValore: '',
    dataInizio: todayISO(), dataScadenza: inYear(),
  });
  const [pdf, setPdf] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const load = useCallback(() => {
    setLd(true);
    boGetContratti().then(setData).finally(() => setLd(false));
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);
  useVisibilityRefresh(useCallback(() => setRefreshKey(k => k + 1), []));

  const openModal = async () => {
    setSaveErr('');
    setPdf(null);
    setForm({ amministratoreId: '', condominioId: '', servizioId: '', fornitore: '', commissioneCondovia: '', stornoTipo: 'fix', stornoValore: '', dataInizio: todayISO(), dataScadenza: inYear() });
    setShowModal(true);
    try {
      const [a, s] = await Promise.all([boGetAmministratori(), boGetServizi()]);
      setAdmins(a);
      setServizi(s);
    } catch (e) { setSaveErr(e.message); }
  };

  useEffect(() => {
    if (!form.amministratoreId) { setCondomini([]); return; }
    boGetCondominiAdmin(form.amministratoreId).then(setCondomini).catch(() => setCondomini([]));
    setForm(f => ({ ...f, condominioId: '' }));
  }, [form.amministratoreId]);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.amministratoreId || !form.condominioId || !form.servizioId || !form.fornitore || !form.dataInizio || !form.dataScadenza) {
      setSaveErr('Compila tutti i campi obbligatori.'); return;
    }
    setSaving(true); setSaveErr('');
    try {
      const fd = new FormData();
      fd.append('amministratoreId', form.amministratoreId);
      fd.append('condominioId', form.condominioId);
      fd.append('servizioId', form.servizioId);
      fd.append('fornitore', form.fornitore);
      fd.append('commissioneCondovia', form.commissioneCondovia || '0');
      fd.append('stornoTipo', form.stornoTipo);
      fd.append('stornoValore', form.stornoValore || '0');
      fd.append('dataInizio', form.dataInizio);
      fd.append('dataScadenza', form.dataScadenza);
      if (pdf) fd.append('pdf', pdf);
      await boPostContratto(fd);
      setShowModal(false);
      setRefreshKey(k => k + 1);
    } catch (e) {
      setSaveErr(e.message);
    } finally { setSaving(false); }
  };

  const serviziLabel = useMemo(() => Object.fromEntries(servizi.map(s => [s.sid, s.label])), [servizi]);

  return (
    <>
      <div className="bo-sticky-hdr" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(18px,3vw,24px)', margin: 0 }}>Contratti</h1>
        <button onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 10, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Nuovo contratto
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {ld ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)' }}>Caricamento…</div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nessun contratto ancora</div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 16 }}>Crea un nuovo contratto o attendi che venga approvata una richiesta.</div>
            <button onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 18px', borderRadius: 10, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={14} /> Nuovo contratto
            </button>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, background: 'var(--surface)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  {['Admin', 'Condominio', 'Servizio', 'Fornitore', 'Prezzo', 'Storno', 'Margine', 'Scadenza', 'Stato', 'PDF'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{data.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>{c.amministratoreId?.nome} {c.amministratoreId?.cognome}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>{c.condominioId?.nome || '—'}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 500 }}>{c.servizioId}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--ink-soft)' }}>{c.fornitore}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>€ {fmt(c.prezzo)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--ink-soft)' }}>€ {fmt(c.stornoAmmontare)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--copper-dark)', fontWeight: 600 }}>€ {fmt(c.margineCondovia)}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>{fmtD(c.dataScadenza)}</td>
                    <td style={{ padding: '11px 14px' }}>{c.stato === 'attivo' ? <Badge variant="attivo" dot>Attivo</Badge> : <Badge variant="scadenza" dot>Scadenza</Badge>}</td>
                    <td style={{ padding: '11px 14px' }}>
                      {c.hasPdf ? (
                        <a href={boGetContrattoFileUrl(c._id)} target="_blank" rel="noreferrer" title="Apri PDF" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--copper-dark)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                          <FileText size={14} /> Apri
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--ink-soft)' }}>{data.length} contratti</div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', background: 'var(--surface)', borderRadius: 20, padding: '28px 24px', position: 'relative', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 6px' }}>Nuovo contratto</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--ink-soft)' }}>Crea un contratto senza passare da una richiesta.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Amministratore *</label>
                <select value={form.amministratoreId} onChange={e => setF('amministratoreId', e.target.value)} style={inp}>
                  <option value="">Seleziona…</option>
                  {admins.map(a => <option key={a._id} value={a._id}>{a.nome} {a.cognome}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Condominio *</label>
                <select value={form.condominioId} onChange={e => setF('condominioId', e.target.value)} style={inp} disabled={!form.amministratoreId}>
                  <option value="">{form.amministratoreId ? 'Seleziona…' : 'Prima scegli l\'amministratore'}</option>
                  {condomini.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Servizio *</label>
                <select value={form.servizioId} onChange={e => setF('servizioId', e.target.value)} style={inp}>
                  <option value="">Seleziona…</option>
                  {servizi.map(s => <option key={s.sid} value={s.sid}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Fornitore *</label>
                <input value={form.fornitore} onChange={e => setF('fornitore', e.target.value)} placeholder="Es. Enel Energia" style={inp} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={lbl}>Commissione Condovia (€)</label>
                  <input type="number" step="0.01" value={form.commissioneCondovia} onChange={e => setF('commissioneCondovia', e.target.value)} placeholder="0" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Storno amministratore</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select value={form.stornoTipo} onChange={e => setF('stornoTipo', e.target.value)} style={{ ...inp, flex: '0 0 90px' }}>
                      <option value="fix">€</option>
                      <option value="percent">%</option>
                    </select>
                    <input type="number" step="0.01" value={form.stornoValore} onChange={e => setF('stornoValore', e.target.value)} placeholder="0" style={inp} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={lbl}>Data inizio *</label>
                  <input type="date" value={form.dataInizio} onChange={e => setF('dataInizio', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Data scadenza *</label>
                  <input type="date" value={form.dataScadenza} onChange={e => setF('dataScadenza', e.target.value)} style={inp} />
                </div>
              </div>

              <div>
                <label style={lbl}>PDF del contratto (opzionale)</label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'var(--bg)', fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <Upload size={14} /> {pdf ? pdf.name : 'Carica PDF'}
                  <input type="file" accept=".pdf" onChange={e => setPdf(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>

              {saveErr && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(220,80,60,.08)', border: '1px solid rgba(220,80,60,.25)', color: 'var(--danger)', fontSize: 13 }}>{saveErr}</div>
              )}

              <button onClick={submit} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                <Check size={15} /> {saving ? 'Creazione…' : 'Crea contratto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
