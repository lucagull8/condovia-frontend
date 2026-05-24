import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet as WI, Eye, EyeOff, ArrowDown, ArrowUp, Bell, Check, X, FileText, ExternalLink } from 'lucide-react';
import { Header, Footer } from '../components/Shared';
import { useAuth } from '../context/AuthContext';
import { getWallet, richiediPagamento, getWalletRichieste, getWalletRicevutaUrl, BASE } from '../api';

const fmt = n => Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2 });

export default function WalletPage() {
  const { utente } = useAuth();
  const [h, setH] = useState(false);
  const [w, setW] = useState({ saldo: 0, movimenti: [] });
  const [richieste, setRichieste] = useState([]);
  const [ld, setLd] = useState(true);

  // Modale richiesta pagamento
  const [showModal, setShowModal] = useState(false);
  const [importo, setImporto] = useState('');
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([getWallet(), getWalletRichieste()])
      .then(([wData, rData]) => { setW(wData); setRichieste(rData); })
      .finally(() => setLd(false));
  }, []);

  const { saldo, movimenti } = w;
  const ent = movimenti.filter(m => m.tipo === 'in').reduce((a, m) => a + m.importo, 0);
  const usc = movimenti.filter(m => m.tipo === 'out').reduce((a, m) => a + m.importo, 0);

  const openModal = () => {
    setImporto('');
    setSendErr('');
    setSent(false);
    setShowModal(true);
  };

  const doPay = async () => {
    const imp = parseFloat(importo);
    if (!imp || isNaN(imp)) { setSendErr('Inserisci un importo valido.'); return; }
    if (imp < 50) { setSendErr('Importo minimo: € 50,00.'); return; }
    if (imp > saldo) { setSendErr(`Importo massimo disponibile: € ${fmt(saldo)}.`); return; }

    setSending(true);
    setSendErr('');
    try {
      await richiediPagamento(imp);
      setSent(true);
      // Ricarica le richieste
      const rData = await getWalletRichieste();
      setRichieste(rData);
    } catch (e) {
      setSendErr(e.message);
    } finally {
      setSending(false);
    }
  };

  // Ricevute (richieste pagate con ricevuta)
  const ricevute = richieste.filter(r => r.stato === 'pagata' && r.ricevutaName);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '32px 24px 60px' }}>
        <Link to="/home" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20, display: 'inline-block' }}>← Torna alla home</Link>
        <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(36px,5vw,56px)', letterSpacing: '-0.025em', margin: '0 0 32px' }}>
          Wallet<span style={{ color: 'var(--copper)' }}>.</span>
        </h1>

        {/* Saldo card */}
        <div style={{ borderRadius: 28, padding: 32, background: 'linear-gradient(155deg,#2e251f,#1a1411,#0c0806)', color: '#f5ece0', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px -30px rgba(20,12,6,.55)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(155deg,#c8843f,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WI size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,236,224,.6)' }}>Wallet Condovia</span>
            </div>
            <button onClick={() => setH(v => !v)} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,.08)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,236,224,.7)' }}>
              {h ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'rgba(245,236,224,.55)', marginBottom: 6 }}>Saldo disponibile</div>
            <div style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 700, letterSpacing: '-0.035em', filter: h ? 'blur(14px)' : 'none', transition: 'filter .2s' }}>
              <span style={{ fontSize: '0.5em', color: 'rgba(245,236,224,.6)', marginRight: 4 }}>€</span>
              {ld ? '—' : fmt(saldo)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid rgba(255,255,255,.08)', margin: '24px 0', padding: '16px 0' }}>
            {[
              { l: 'ENTRATE', v: `+€ ${fmt(ent)}`, c: '#d4915a' },
              { l: 'USCITE', v: `−€ ${fmt(usc)}`, c: 'rgba(245,236,224,.85)' },
              { l: 'MOVIMENTI', v: movimenti.length, c: 'rgba(245,236,224,.7)' },
            ].map(({ l, v, c }, i) => (
              <div key={l} style={{ textAlign: 'center', padding: '0 12px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(245,236,224,.45)', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottone richiedi pagamento */}
        <button onClick={openModal} disabled={saldo < 50} style={{ width: '100%', height: 52, borderRadius: 14, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saldo < 50 ? .55 : 1, marginBottom: 16, cursor: saldo < 50 ? 'not-allowed' : 'pointer' }}>
          <Bell size={16} /> Richiedi pagamento
        </button>
        {saldo < 50 && saldo > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: -8, marginBottom: 16 }}>Saldo minimo per richiedere il pagamento: € 50,00</p>
        )}

        {/* Richieste in corso */}
        {richieste.filter(r => r.stato === 'in_attesa').length > 0 && (
          <div style={{ border: '1px solid var(--copper-100)', borderRadius: 14, background: 'var(--copper-50)', padding: '14px 18px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--copper-dark)', marginBottom: 8 }}>⏳ Richieste in elaborazione</div>
            {richieste.filter(r => r.stato === 'in_attesa').map(r => (
              <div key={r._id} style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                € {fmt(r.importo)} — richiesta il {new Date(r.createdAt).toLocaleDateString('it-IT')}
              </div>
            ))}
          </div>
        )}

        {/* Movimenti recenti */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 16px' }}>Movimenti recenti</h2>
          {ld ? <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-soft)' }}>Caricamento…</div> :
            movimenti.length === 0 ? <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-soft)' }}>Nessun movimento</div> :
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {movimenti.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: m.tipo === 'in' ? 'var(--success-bg)' : 'var(--copper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {m.tipo === 'in' ? <ArrowDown size={14} color="var(--success)" /> : <ArrowUp size={14} color="var(--copper-dark)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.desc}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{m.data}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: m.tipo === 'in' ? 'var(--success)' : 'var(--copper-dark)' }}>
                      {m.tipo === 'in' ? '+' : '−'}€ {fmt(m.importo)}
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Documenti / Ricevute pagamento */}
        {ricevute.length > 0 && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 24, background: 'var(--surface)' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 16px' }}>Documenti</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ricevute.map(r => (
                <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--copper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={16} color="var(--copper-dark)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>Ricevuta pagamento</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                      € {fmt(r.importo)} · {new Date(r.updatedAt || r.createdAt).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  <a href={getWalletRicevutaUrl(r._id)} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 12.5, fontWeight: 600, color: 'var(--copper-dark)', textDecoration: 'none' }}>
                    <ExternalLink size={12} /> Scarica
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* ═══ MODALE RICHIEDI PAGAMENTO ═══ */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ width: '100%', maxWidth: 420, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 16 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, margin: 0 }}>Richiedi pagamento</h2>
              <button onClick={() => setShowModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            </div>

            {sent ? (
              <>
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Check size={26} color="var(--success)" />
                  </div>
                  <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Richiesta inviata!</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Il nostro team elaborerà il pagamento entro <strong>24-48 ore</strong>.</div>
                </div>
                <button onClick={() => setShowModal(false)} style={{ width: '100%', height: 48, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                  Chiudi
                </button>
              </>
            ) : (
              <>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--copper-50)', border: '1px solid var(--copper-100)', fontSize: 13 }}>
                  Saldo disponibile: <strong>€ {fmt(saldo)}</strong>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>
                    Importo da richiedere (min € 50,00 — max € {fmt(saldo)})
                  </label>
                  <input
                    type="number"
                    value={importo}
                    onChange={e => setImporto(e.target.value)}
                    placeholder="Es. 150"
                    min="50"
                    max={saldo}
                    style={{ width: '100%', height: 48, borderRadius: 10, padding: '0 14px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {sendErr && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>
                    {sendErr}
                  </div>
                )}
                <button onClick={doPay} disabled={sending} style={{ width: '100%', height: 48, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: sending ? .6 : 1 }}>
                  <Bell size={16} /> {sending ? 'Invio…' : 'Invia richiesta'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
