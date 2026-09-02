import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, X, Check, FileText, Upload, Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Badge } from '../../components/Shared';
import { useVisibilityRefresh } from '../../hooks/useVisibilityRefresh';
import { boGetContratti, boGetContrattoFileUrl, boPostContratto, boGetAmministratori, boGetCondominiAdmin, boGetServizi } from '../../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });
const fmtD = d => d ? new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const todayISO = () => new Date().toISOString().split('T')[0];
const inYear = () => new Date(Date.now() + 365 * 864e5).toISOString().split('T')[0];
const norm = s => String(s || '').toLowerCase();

const inp = { width: '100%', height: 42, borderRadius: 10, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, boxSizing: 'border-box' };
const lbl = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 };
const filterInp = { height: 34, borderRadius: 8, padding: '0 10px', border: '1px solid var(--border)', background: '#fff', fontSize: 12.5, boxSizing: 'border-box', color: 'var(--ink)' };

const PAGE_SIZE = 50;

export default function Contratti() {
  const [data, setData] = useState([]);
  const [ld, setLd] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filtri
  const [q, setQ] = useState('');
  const [filtroStato, setFiltroStato] = useState('');
  const [filtroAdmin, setFiltroAdmin] = useState('');
  const [filtroServizio, setFiltroServizio] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState('dataScadenza');
  const [sortDir, setSortDir] = useState('desc');

  // Modale
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

  // Lista uniche per dropdown filtri
  const adminOptions = useMemo(() => {
    const map = new Map();
    for (const c of data) {
      if (c.amministratoreId?._id) map.set(c.amministratoreId._id, `${c.amministratoreId.nome} ${c.amministratoreId.cognome}`);
    }
    return Array.from(map, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  const servizioOptions = useMemo(() => {
    const set = new Set(data.map(c => c.servizioId).filter(Boolean));
    return Array.from(set).sort();
  }, [data]);

  // Applica filtri + search + sort
  const filtered = useMemo(() => {
    const qq = norm(q);
    let out = data.filter(c => {
      if (filtroStato && c.stato !== filtroStato) return false;
      if (filtroAdmin && c.amministratoreId?._id !== filtroAdmin) return false;
      if (filtroServizio && c.servizioId !== filtroServizio) return false;
      if (qq) {
        const hay = norm(`${c.amministratoreId?.nome || ''} ${c.amministratoreId?.cognome || ''} ${c.condominioId?.nome || ''} ${c.servizioId || ''} ${c.fornitore || ''}`);
        if (!hay.includes(qq)) return false;
      }
      return true;
    });
    const getVal = c => {
      switch (sortKey) {
        case 'admin': return norm(`${c.amministratoreId?.nome || ''} ${c.amministratoreId?.cognome || ''}`);
        case 'condominio': return norm(c.condominioId?.nome);
        case 'servizio': return norm(c.servizioId);
        case 'fornitore': return norm(c.fornitore);
        case 'prezzo': return Number(c.prezzo) || 0;
        case 'storno': return Number(c.stornoAmmontare) || 0;
        case 'margine': return Number(c.margineCondovia) || 0;
        case 'dataScadenza': return new Date(c.dataScadenza).getTime() || 0;
        case 'stato': return norm(c.stato);
        default: return 0;
      }
    };
    out.sort((a, b) => {
      const av = getVal(a), bv = getVal(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return out;
  }, [data, q, filtroStato, filtroAdmin, filtroServizio, sortKey, sortDir]);

  // Reset pagina quando cambiano filtri
  useEffect(() => { setPage(0); }, [q, filtroStato, filtroAdmin, filtroServizio, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visiblePage = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const setSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortHead = ({ id, children }) => (
    <th onClick={() => setSort(id)} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: sortKey === id ? 'var(--copper-dark)' : 'var(--ink-soft)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        {sortKey === id && (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
      </span>
    </th>
  );

  const clearFilters = () => { setQ(''); setFiltroStato(''); setFiltroAdmin(''); setFiltroServizio(''); };
  const hasActive = q || filtroStato || filtroAdmin || filtroServizio;

  const openModal = async () => {
    setSaveErr(''); setPdf(null);
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

  return (
    <>
      <div className="bo-sticky-hdr" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(18px,3vw,24px)', margin: 0 }}>Contratti</h1>
        <button onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 10, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Nuovo contratto
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* ═══ BARRA FILTRI ═══ */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 12 }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)', pointerEvents: 'none' }} />
            <input placeholder="Cerca admin, condominio, servizio, fornitore…" value={q} onChange={e => setQ(e.target.value)} style={{ ...filterInp, width: '100%', paddingLeft: 32 }} />
          </div>
          <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} style={{ ...filterInp, minWidth: 130 }}>
            <option value="">Tutti gli stati</option>
            <option value="attivo">Attivi</option>
            <option value="scadenza">In scadenza</option>
          </select>
          <select value={filtroAdmin} onChange={e => setFiltroAdmin(e.target.value)} style={{ ...filterInp, minWidth: 180 }}>
            <option value="">Tutti gli amministratori</option>
            {adminOptions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
          <select value={filtroServizio} onChange={e => setFiltroServizio(e.target.value)} style={{ ...filterInp, minWidth: 160 }}>
            <option value="">Tutti i servizi</option>
            {servizioOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {hasActive && (
            <button onClick={clearFilters} style={{ height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 12, color: 'var(--ink-soft)', cursor: 'pointer' }}>Pulisci</button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-soft)' }}>
            {ld ? '…' : `${filtered.length} ${filtered.length === 1 ? 'contratto' : 'contratti'}${filtered.length !== data.length ? ` (su ${data.length})` : ''}`}
          </div>
        </div>

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
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)', color: 'var(--ink-soft)' }}>
            Nessun contratto corrisponde ai filtri. <button onClick={clearFilters} style={{ background: 'transparent', border: 0, color: 'var(--copper-dark)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Pulisci filtri</button>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, background: 'var(--surface)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  <SortHead id="admin">Admin</SortHead>
                  <SortHead id="condominio">Condominio</SortHead>
                  <SortHead id="servizio">Servizio</SortHead>
                  <SortHead id="fornitore">Fornitore</SortHead>
                  <SortHead id="prezzo">Prezzo</SortHead>
                  <SortHead id="storno">Storno</SortHead>
                  <SortHead id="margine">Margine</SortHead>
                  <SortHead id="dataScadenza">Scadenza</SortHead>
                  <SortHead id="stato">Stato</SortHead>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>PDF</th>
                </tr></thead>
                <tbody>{visiblePage.map(c => (
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
            {/* Paginazione */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--ink-soft)' }}>
              <div>Mostrando <strong style={{ color: 'var(--ink)' }}>{page * PAGE_SIZE + 1}–{Math.min(filtered.length, (page + 1) * PAGE_SIZE)}</strong> di <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong></div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setPage(0)} disabled={page === 0} style={{ height: 30, width: 30, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ChevronsLeft size={14} /></button>
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ height: 30, padding: '0 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, fontSize: 12 }}>‹ Prec</button>
                  <span style={{ padding: '0 8px' }}>Pagina {page + 1} di {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{ height: 30, padding: '0 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, fontSize: 12 }}>Succ ›</button>
                  <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} style={{ height: 30, width: 30, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ChevronsRight size={14} /></button>
                </div>
              )}
            </div>
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
