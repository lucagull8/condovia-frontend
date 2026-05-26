import { useState, useEffect } from 'react';
import { Search, ChevronLeft, Building2, FileText, Wallet, User, Plus, Upload, X, Check, ExternalLink, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/Shared';
import {
  boGetAmministratori, boGetAmministratore,
  boGetCondominiAdmin, boCreaCondo,
  boGetDocumentiAdmin, boUploadDocumento, boGetDocumentoFileUrl,
  boGetAdminWallet, boAzzeraWallet, boPagaWallet, boGetRicevutaWalletUrl,
  BASE,
} from '../../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });
const fD = d => d ? new Date(d).toLocaleDateString('it-IT') : '—';
const COLORI = [
  'linear-gradient(135deg,#d4915a,#8b5520)',
  'linear-gradient(135deg,#4a90c4,#1e5f8c)',
  'linear-gradient(135deg,#6e9a6e,#3d6b3d)',
  'linear-gradient(135deg,#9b59b6,#6c3483)',
];

export default function Amministratori() {
  const [list, setList] = useState([]);
  const [ld, setLd] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null); // admin object
  const [tab, setTab] = useState('anagrafica');

  // Detail data
  const [condomini, setCondomini] = useState([]);
  const [documenti, setDocumenti] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [ldDetail, setLdDetail] = useState(false);

  // Modale aggiungi condominio
  const [showCondoModal, setShowCondoModal] = useState(false);
  const [condoForm, setCondoForm] = useState({ nome: '', via: '', citta: '', unita: '', codiceFiscale: '' });
  const [condoSaving, setCondoSaving] = useState(false);

  // Upload documenti
  const [uploadTipo, setUploadTipo] = useState(null); // 'nomina' | 'bolletta'
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSaving, setUploadSaving] = useState(false);

  // Paga wallet
  const [pagaModal, setPagaModal] = useState(null); // richiestaWallet object
  const [pagaFile, setPagaFile] = useState(null);
  const [pagaSaving, setPagaSaving] = useState(false);

  const loadList = () => {
    setLd(true);
    boGetAmministratori().then(setList).finally(() => { setLd(false); setRefreshing(false); });
  };
  useEffect(() => { loadList(); }, []);

  const selectAdmin = async (admin) => {
    setSelected(admin);
    setTab('anagrafica');
    setLdDetail(true);
    try {
      const [c, d, w] = await Promise.all([
        boGetCondominiAdmin(admin._id),
        boGetDocumentiAdmin(admin._id),
        boGetAdminWallet(admin._id),
      ]);
      setCondomini(c);
      setDocumenti(d);
      setWalletData(w);
    } catch {}
    setLdDetail(false);
  };

  const reloadWallet = async () => {
    if (!selected) return;
    try { setWalletData(await boGetAdminWallet(selected._id)); } catch {}
  };

  const reloadCondomini = async () => {
    if (!selected) return;
    try { setCondomini(await boGetCondominiAdmin(selected._id)); } catch {}
  };

  const reloadDocumenti = async () => {
    if (!selected) return;
    try { setDocumenti(await boGetDocumentiAdmin(selected._id)); } catch {}
  };

  // Aggiungi condominio
  const handleAddCondo = async () => {
    if (!condoForm.nome.trim()) { alert('Nome obbligatorio'); return; }
    setCondoSaving(true);
    try {
      await boCreaCondo(selected._id, condoForm);
      await reloadCondomini();
      setShowCondoModal(false);
      setCondoForm({ nome: '', via: '', citta: '', unita: '', codiceFiscale: '' });
    } catch (e) { alert(e.message); }
    finally { setCondoSaving(false); }
  };

  // Upload documento
  const handleUploadDoc = async () => {
    if (!uploadFile) { alert('Seleziona un file'); return; }
    setUploadSaving(true);
    try {
      const fd = new FormData();
      fd.append('tipo', uploadTipo);
      fd.append('file', uploadFile);
      await boUploadDocumento(selected._id, fd);
      await reloadDocumenti();
      setUploadTipo(null);
      setUploadFile(null);
    } catch (e) { alert(e.message); }
    finally { setUploadSaving(false); }
  };

  // Azzera wallet
  const handleAzzera = async () => {
    if (!confirm(`Azzerare il wallet di ${selected.nome} ${selected.cognome}? Questa azione è irreversibile.`)) return;
    try {
      await boAzzeraWallet(selected._id);
      await reloadWallet();
      // Aggiorna saldo nella lista
      setList(l => l.map(a => a._id === selected._id ? { ...a, saldo: 0 } : a));
    } catch (e) { alert(e.message); }
  };

  // Paga richiesta wallet
  const handlePaga = async () => {
    setPagaSaving(true);
    try {
      const fd = new FormData();
      fd.append('richiestaId', pagaModal._id);
      if (pagaFile) fd.append('ricevuta', pagaFile);
      await boPagaWallet(selected._id, fd);
      await reloadWallet();
      setPagaModal(null);
      setPagaFile(null);
    } catch (e) { alert(e.message); }
    finally { setPagaSaving(false); }
  };

  const filtered = list.filter(a => q === '' || `${a.nome} ${a.cognome} ${a.studio || ''}`.toLowerCase().includes(q.toLowerCase()));

  const inp = { width: '100%', height: 42, borderRadius: 10, padding: '0 12px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };

  // ─── Vista lista ─────────────────────────────────────────
  if (!selected) {
    return (
      <>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(18px,3vw,24px)', margin: 0, flex: 1 }}>Amministratori</h1>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{list.length} attivi</span>
          <button onClick={() => { setRefreshing(true); loadList(); }} disabled={refreshing} title="Aggiorna" style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)' }}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Aggiorno…' : 'Aggiorna'}
          </button>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cerca…" style={{ width: '100%', height: 36, paddingLeft: 30, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface)', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {ld ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>Caricamento…</div> :
            filtered.length === 0 ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>Nessun amministratore</div> :
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((a, i) => (
                  <div key={a._id} onClick={() => selectAdmin(a)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px -8px rgba(0,0,0,.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORI[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {(a.nome?.[0] || '') + (a.cognome?.[0] || '')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{a.nome} {a.cognome}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{a.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-soft)' }}>
                      <span><strong style={{ color: 'var(--copper-dark)' }}>{a.condomini}</strong> cond.</span>
                      <span><strong style={{ color: 'var(--success)' }}>{a.serviziAttivi}</strong> servizi</span>
                      <span><strong style={{ color: 'var(--copper-dark)' }}>€ {fmt(a.stornoTotale || 0)}</strong></span>
                    </div>
                    {a.richiesteWalletPending > 0 && (
                      <span style={{ background: '#a55339', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 6px' }}>
                        💰 {a.richiesteWalletPending}
                      </span>
                    )}
                    <div style={{ color: 'var(--ink-soft)' }}>›</div>
                  </div>
                ))}
              </div>
          }
        </div>
      </>
    );
  }

  // ─── Vista dettaglio admin ─────────────────────────────────
  const TABS = [
    { k: 'anagrafica', l: 'Anagrafica', icon: User },
    { k: 'condomini', l: 'Condomini', icon: Building2 },
    { k: 'documenti', l: 'Documenti', icon: FileText },
    { k: 'wallet', l: 'Wallet', icon: Wallet },
  ];

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fcfcfa', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)' }}>
          <ChevronLeft size={14} /> Lista
        </button>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(16px,3vw,22px)', margin: 0 }}>
          {selected.nome} {selected.cognome}
        </h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, padding: '12px 20px 0', borderBottom: '1px solid var(--border)', background: '#fcfcfa' }}>
        {TABS.map(({ k, l, icon: I }) => (
          <button key={k} onClick={() => setTab(k)} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 14px', borderRadius: '8px 8px 0 0', border: 0, cursor: 'pointer', fontSize: 13, fontWeight: tab === k ? 700 : 400, color: tab === k ? 'var(--copper-dark)' : 'var(--ink-soft)', background: tab === k ? 'var(--surface)' : 'transparent', borderBottom: tab === k ? '2px solid var(--copper)' : '2px solid transparent' }}>
            <I size={13} /> {l}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {ldDetail ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>Caricamento…</div> : (
          <>
            {/* ── Anagrafica ── */}
            {tab === 'anagrafica' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {[
                  { l: 'Nome', v: `${selected.nome} ${selected.cognome}` },
                  { l: 'Email', v: selected.email },
                  { l: 'Studio', v: selected.studio || '—' },
                  { l: 'Telefono', v: selected.telefono || '—' },
                  { l: 'PEC', v: selected.pec || '—' },
                  { l: 'Partita IVA', v: selected.partitaIva || '—' },
                  { l: 'Saldo wallet', v: `€ ${fmt(selected.saldo || 0)}` },
                  { l: 'Iscritto il', v: fD(selected.createdAt) },
                ].map(({ l, v }) => (
                  <div key={l} style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Condomini ── */}
            {tab === 'condomini' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowCondoModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 14px', borderRadius: 10, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={14} /> Aggiungi condominio
                  </button>
                </div>
                {condomini.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)', border: '1px dashed var(--border)', borderRadius: 14 }}>Nessun condominio</div>
                ) : (
                  <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ background: 'var(--bg)' }}>
                        {['Nome', 'Indirizzo', 'Città', 'Unità', 'CF'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {condomini.map(c => (
                          <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{c.nome}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13 }}>{c.via || '—'}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13 }}>{c.citta || '—'}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13 }}>{c.unita || 0}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--ink-soft)' }}>{c.codiceFiscale || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Documenti ── */}
            {tab === 'documenti' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>Carica la nomina dell'assemblea e l'ultima bolletta per verificare l'identità dell'amministratore.</p>
                {['nomina', 'bolletta'].map(tipo => {
                  const doc = documenti.find(d => d.tipo === tipo);
                  const label = tipo === 'nomina' ? 'Nomina assemblea' : 'Ultima bolletta';
                  return (
                    <div key={tipo} style={{ padding: '18px 20px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                          {doc ? (
                            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                              {doc.fileName} · {fD(doc.updatedAt || doc.createdAt)}
                            </div>
                          ) : (
                            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Nessun documento caricato</div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {doc && (
                            <a href={boGetDocumentoFileUrl(selected._id, tipo)} target="_blank" rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 12.5, fontWeight: 600, color: 'var(--copper-dark)', textDecoration: 'none' }}>
                              <ExternalLink size={12} /> Visualizza
                            </a>
                          )}
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 12px', borderRadius: 8, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                            <Upload size={12} /> {doc ? 'Sostituisci' : 'Carica'}
                            <input type="file" accept=".pdf" onChange={e => { setUploadTipo(tipo); setUploadFile(e.target.files[0]); }} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Conferma upload */}
                {uploadFile && uploadTipo && (
                  <div style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--copper-50)', border: '1px solid var(--copper-100)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      Caricamento: <strong>{uploadTipo === 'nomina' ? 'Nomina assemblea' : 'Ultima bolletta'}</strong> — {uploadFile.name}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setUploadFile(null); setUploadTipo(null); }} style={{ height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 12.5, cursor: 'pointer' }}>Annulla</button>
                      <button onClick={handleUploadDoc} disabled={uploadSaving} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 0, background: 'var(--success)', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                        {uploadSaving ? '…' : 'Conferma upload'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Wallet ── */}
            {tab === 'wallet' && walletData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Saldo card */}
                <div style={{ padding: '20px 24px', borderRadius: 16, background: 'linear-gradient(155deg,#2e251f,#1a1411)', color: '#f5ece0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,236,224,.5)', marginBottom: 6 }}>Saldo disponibile</div>
                    <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>€ {fmt(walletData.saldo)}</div>
                  </div>
                  <button onClick={handleAzzera} style={{ height: 40, padding: '0 16px', borderRadius: 10, border: '1.5px solid rgba(245,236,224,.2)', background: 'transparent', color: '#f5ece0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Azzera wallet
                  </button>
                </div>

                {/* Richieste pagamento */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontFamily: 'Fraunces', fontSize: 16 }}>
                    Richieste di pagamento
                  </div>
                  {walletData.richiesteWallet.length === 0 ? (
                    <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>Nessuna richiesta</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ background: 'var(--bg)' }}>
                        {['Data', 'Importo', 'Stato', 'Ricevuta', 'Azione'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {walletData.richiesteWallet.map(r => (
                          <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px 14px', fontSize: 13 }}>{fD(r.createdAt)}</td>
                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: 'var(--copper-dark)' }}>€ {fmt(r.importo)}</td>
                            <td style={{ padding: '12px 14px' }}>
                              {r.stato === 'in_attesa'
                                ? <Badge variant="orange" dot>In attesa</Badge>
                                : <Badge variant="attivo" dot>Pagata</Badge>}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              {r.ricevutaName ? (
                                <a href={boGetRicevutaWalletUrl(r._id)} target="_blank" rel="noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--copper-dark)', fontWeight: 600, textDecoration: 'none' }}>
                                  <ExternalLink size={12} /> {r.ricevutaName.substring(0, 20)}
                                </a>
                              ) : <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>—</span>}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              {r.stato === 'in_attesa' && (
                                <button onClick={() => { setPagaModal(r); setPagaFile(null); }} style={{ height: 32, padding: '0 12px', borderRadius: 8, border: 0, background: 'var(--success)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                  Paga
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Movimenti */}
                <div style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontFamily: 'Fraunces', fontSize: 16 }}>Movimenti</div>
                  {walletData.movimenti.length === 0 ? (
                    <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>Nessun movimento</div>
                  ) : (
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {walletData.movimenti.map((m, i) => (
                        <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                          <div style={{ fontSize: 12, color: 'var(--ink-soft)', minWidth: 80 }}>{fD(m.createdAt)}</div>
                          <div style={{ flex: 1, fontSize: 13 }}>{m.desc}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: m.tipo === 'in' ? 'var(--success)' : 'var(--copper-dark)' }}>
                            {m.tipo === 'in' ? '+' : '−'}€ {fmt(m.importo)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ MODALE AGGIUNGI CONDOMINIO ═══ */}
      {showCondoModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowCondoModal(false)}>
          <div style={{ width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: 20, padding: '28px 24px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCondoModal(false)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 20px' }}>Aggiungi condominio</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { k: 'nome', l: 'Nome *', ph: 'Residence Aventino' },
                { k: 'via', l: 'Indirizzo', ph: 'Via di San Saba 24' },
                { k: 'citta', l: 'Città', ph: 'Roma' },
                { k: 'codiceFiscale', l: 'Codice fiscale', ph: '97012345678' },
              ].map(({ k, l, ph }) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>{l}</label>
                  <input value={condoForm[k]} onChange={e => setCondoForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>N° unità</label>
                <input type="number" value={condoForm.unita} onChange={e => setCondoForm(f => ({ ...f, unita: e.target.value }))} placeholder="32" style={inp} />
              </div>
              <button onClick={handleAddCondo} disabled={condoSaving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 46, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <Check size={15} /> {condoSaving ? 'Salvataggio…' : 'Salva condominio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODALE PAGA WALLET ═══ */}
      {pagaModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setPagaModal(null)}>
          <div style={{ width: '100%', maxWidth: 420, background: 'var(--surface)', borderRadius: 20, padding: '28px 24px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPagaModal(null)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 8px' }}>Paga richiesta</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--ink-soft)' }}>Importo richiesto: <strong>€ {fmt(pagaModal.importo)}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 4 }}>Ricevuta di pagamento (PDF, opzionale)</label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 42, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'var(--bg)', fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <Upload size={14} /> {pagaFile ? pagaFile.name : 'Seleziona PDF'}
                  <input type="file" accept=".pdf" onChange={e => setPagaFile(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>
              <button onClick={handlePaga} disabled={pagaSaving} style={{ width: '100%', height: 46, borderRadius: 12, border: 0, background: 'var(--success)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {pagaSaving ? '…' : `Conferma pagamento € ${fmt(pagaModal.importo)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
