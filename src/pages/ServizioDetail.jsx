import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { CircleCheckBig, TriangleAlert, Plus, Send, Shield, FileDown, Calendar, Building2, User } from 'lucide-react';
import { Header, Footer, Badge } from '../components/Shared';
import { ICON_MAP, findServiceCatalog } from '../components/ServiceIcon';
import { getServizio, getCondomini, creaRichiesta, BASE } from '../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });
const fmtD = d => d ? new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const daysLeft = d => d ? Math.max(0, Math.ceil((new Date(d) - Date.now()) / 864e5)) : null;

export default function ServizioDetail() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [cond, setCond] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(false);
  const [note, setNote] = useState('');
  const [condoId, setCondoId] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [showRinnovo, setShowRinnovo] = useState(false);
  const [rinnovoSent, setRinnovoSent] = useState(false);

  useEffect(() => {
    Promise.all([getServizio(id), getCondomini()])
      .then(([serv, condList]) => {
        setS(serv);
        setCond(condList);
        if (condList.length > 0) setCondoId(condList[0]._id);
      })
      .catch(() => setErrore(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Caricamento…</div>;
  if (errore || !s) return <Navigate to="/home" replace />;

  const cat = findServiceCatalog(id);
  const Icon = ICON_MAP[s.icon || cat.icon] || Shield;
  const status = s.status || 'no';
  const days = daysLeft(s.dataScadenza);
  const coperti = s.condominicoperti || [];

  const doRichiesta = async () => {
    setBusy(true);
    try { await creaRichiesta({ condominioId: condoId, servizioId: id, note }); setSent(true); }
    catch (e) { setSent(true); }
    finally { setBusy(false); }
  };

  const doRinnovo = async () => {
    setBusy(true);
    try { await creaRichiesta({ condominioId: condoId, servizioId: id, note: `RINNOVO: ${note || 'nessuna nota'}` }); setRinnovoSent(true); }
    catch (e) { setRinnovoSent(true); }
    finally { setBusy(false); }
  };

  const inp = { width: '100%', height: 42, borderRadius: 10, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '32px 24px 60px' }}>
        <Link to="/home" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20, display: 'inline-block' }}>← Torna alla home</Link>

        {/* ═══ HEADER CARD ═══ */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(20px,3vw,32px)', background: 'var(--surface)', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 88, height: 88, borderRadius: 22, flexShrink: 0, background: s.bg || cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={40} color={s.color || cat.color} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(24px,3vw,32px)', margin: '0 0 8px' }}>{s.titolo || s.label}</h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 580 }}>{s.desc}</p>
            </div>
          </div>

          {/* Status banner */}
          {status === 'attivo' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'var(--success-bg)', border: '1px solid #c8dbc8', flexWrap: 'wrap' }}>
              <CircleCheckBig size={20} color="var(--success)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', marginRight: 12 }}>ATTIVO</span>
                <span style={{ fontSize: 13.5 }}>Fornitore: <strong>{s.fornitore}</strong> · fino al {fmtD(s.dataScadenza)}</span>
              </div>
            </div>
          )}
          {status === 'scadenza' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', flexWrap: 'wrap' }}>
              <TriangleAlert size={20} color="var(--danger)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', marginRight: 12 }}>IN SCADENZA</span>
                <span style={{ fontSize: 13.5 }}>Scade il {fmtD(s.dataScadenza)}{days !== null ? ` (${days} giorni)` : ''}</span>
              </div>
              <button onClick={() => setShowRinnovo(true)} style={{ height: 36, padding: '0 14px', borderRadius: 9, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 13, fontWeight: 600 }}>Rinnova →</button>
            </div>
          )}
          {status === 'no' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'var(--copper-50)', border: '1px solid var(--copper-100)' }}>
              <Plus size={20} color="var(--copper-dark)" />
              <span style={{ fontSize: 13.5 }}>Servizio non ancora attivo — compila il modulo per richiedere l'attivazione</span>
            </div>
          )}
        </div>

        {/* ═══ CONTRATTO ATTIVO — VISIBILE ALL'ADMIN ═══ */}
        {(status === 'attivo' || status === 'scadenza') && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleCheckBig size={18} color="#fff" />
              </div>
              <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: 0 }}>Il tuo contratto</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <User size={13} color="var(--ink-soft)" />
                  <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fornitore</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{s.fornitore}</div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Calendar size={13} color="var(--ink-soft)" />
                  <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Periodo</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtD(s.dataInizio)}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>→ {fmtD(s.dataScadenza)} {days !== null && <span>({days} giorni)</span>}</div>
              </div>

              {s.condominioNome && (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Building2 size={13} color="var(--ink-soft)" />
                    <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Condominio</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{s.condominioNome}</div>
                </div>
              )}
            </div>

            {/* Storno card */}
            <div style={{ borderRadius: 14, padding: '18px 20px', background: 'linear-gradient(180deg,#fbf3ea,#f4e3cf)', border: '1px solid var(--copper-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: s.pdfUrl ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--copper-dark)', marginBottom: 4 }}>Il tuo storno annuo</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Accreditato automaticamente nel wallet</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--copper-dark)', letterSpacing: '-0.025em' }}>€ {fmt(s.storno || 0)}</div>
            </div>

            {/* PDF download */}
            {s.pdfUrl && (
              <a href={`${BASE}${s.pdfUrl}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'inherit', marginTop: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileDown size={18} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Contratto PDF</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Scarica il documento del contratto</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--copper-dark)' }}>Scarica →</span>
              </a>
            )}
          </div>
        )}

        {/* ═══ DETTAGLI + STORNO (solo per servizi non attivi) ═══ */}
        {status === 'no' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)' }}>
              <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, margin: '0 0 16px' }}>Dettagli</h3>
              {[
                { k: 'Categoria', v: s.label },
                { k: 'Stato', v: <Badge dot>Da attivare</Badge> },
              ].map(({ k, v }, i) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{k}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 20, padding: 24, background: 'linear-gradient(180deg,#fbf3ea,#f4e3cf)', border: '1px solid var(--copper-100)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--copper-dark)', marginBottom: 8 }}>Storno</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 12 }}>Lo storno verrà definito al momento dell'attivazione del servizio</div>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>Attivando questo servizio inizierai a ricevere uno storno annuo nel tuo wallet.</p>
            </div>
          </div>
        )}

        {/* ═══ FORM RICHIESTA (solo per servizi non attivi) ═══ */}
        {status === 'no' && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28, background: 'var(--surface)', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, margin: '0 0 20px' }}>Richiedi attivazione</h2>
            {sent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 14, background: 'var(--success-bg)', border: '1px solid #c8dbc8' }}>
                <CircleCheckBig size={24} color="var(--success)" />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--success)' }}>Richiesta inviata!</div>
                  <div style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>Il team Condovia ti contatterà entro 24 ore.</div>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 24, background: 'var(--bg)' }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Condominio</label>
                  {cond.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--danger)' }}>Aggiungi prima un condominio dalla sezione <Link to="/condomini" style={{ color: 'var(--copper-dark)', fontWeight: 600 }}>Condomini</Link>.</div>
                  ) : (
                    <select value={condoId} onChange={e => setCondoId(e.target.value)} style={{ ...inp, height: 42, padding: '0 12px' }}>
                      {cond.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                    </select>
                  )}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Note (opzionale)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Es. Problema urgente con il servizio attuale…" style={{ ...inp, height: 'auto', padding: '10px 12px' }} />
                </div>
                <button onClick={doRichiesta} disabled={busy || cond.length === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 48, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 15, fontWeight: 600, opacity: (busy || cond.length === 0) ? 0.55 : 1 }}>
                  <Send size={16} /> {busy ? 'Invio…' : 'Invia richiesta di attivazione'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ FORM RINNOVO (per servizi in scadenza) ═══ */}
        {showRinnovo && status === 'scadenza' && (
          <div style={{ border: '1px solid #e8b8a8', borderRadius: 20, padding: 28, background: 'var(--surface)', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, margin: '0 0 20px' }}>Richiesta di rinnovo</h2>
            {rinnovoSent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 14, background: 'var(--success-bg)', border: '1px solid #c8dbc8' }}>
                <CircleCheckBig size={24} color="var(--success)" />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--success)' }}>Richiesta rinnovo inviata!</div>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 24, background: 'var(--bg)' }}>
                <div style={{ marginBottom: 16 }}>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Note opzionali…" style={{ ...inp, height: 'auto', padding: '10px 12px' }} />
                </div>
                <button onClick={doRinnovo} disabled={busy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 48, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 15, fontWeight: 600, opacity: busy ? 0.6 : 1 }}>
                  <Send size={16} /> {busy ? 'Invio…' : 'Conferma rinnovo'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Copertura condomini */}
        {status !== 'no' && coperti.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 16px' }}>Copertura per condominio</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {coperti.map(c => (
                <div key={c._id || c.nome} style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.nome}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{c.unita} unità</div>
                  </div>
                  {c.status === 'attivo' ? <Badge variant="attivo" dot>Attivo</Badge> : <Badge variant="scadenza" dot>Scadenza</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
