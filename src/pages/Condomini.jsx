import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Plus, X, Check, RefreshCw } from 'lucide-react';
import { Header, Footer, Badge } from '../components/Shared';
import { getCondomini, creaCondominio } from '../api';

export default function Condomini() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [zona, setZona] = useState('tutti');
  const [sort, setSort] = useState('nome');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', via: '', citta: '', unita: '', codiceFiscale: '' });
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const loadData = () => {
    setLoading(true);
    getCondomini().then(setData).finally(() => { setLoading(false); setRefreshing(false); });
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    let r = data.filter(c => {
      const match = q === '' || `${c.nome} ${c.via} ${c.citta}`.toLowerCase().includes(q.toLowerCase());
      const z = zona === 'tutti' || (zona === 'roma' && c.citta === 'Roma') || (zona === 'provincia' && c.citta !== 'Roma');
      return match && z;
    });
    if (sort === 'nome') r.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (sort === 'unita') r.sort((a, b) => b.unita - a.unita);
    else r.sort((a, b) => (b.storno || 0) - (a.storno || 0));
    return r;
  }, [data, q, zona, sort]);

  const sortLabels = { nome: 'Nome', unita: 'Unità', storno: 'Storno' };
  const nextSort = { nome: 'unita', unita: 'storno', storno: 'nome' };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nome.trim()) { setSaveErr('Inserisci il nome del condominio.'); return; }
    setSaving(true); setSaveErr('');
    try {
      const nuovo = await creaCondominio({ nome: form.nome, via: form.via, citta: form.citta, unita: parseInt(form.unita) || 0, codiceFiscale: form.codiceFiscale });
      setData(d => [...d, { ...nuovo, attivi: 0, scadenze: 0, storno: 0 }]);
      setForm({ nome: '', via: '', citta: '', unita: '', codiceFiscale: '' });
      setShowModal(false);
    } catch (e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', height: 44, borderRadius: 10, padding: '0 14px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '32px 24px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(32px,5vw,48px)', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
              I tuoi condomini<span style={{ color: 'var(--copper)' }}>.</span>
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)' }}>
              {loading ? '…' : `${data.length} edifici gestiti`} · Roma e provincia
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setRefreshing(true); loadData(); }} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', color: 'var(--ink-soft)' }}>
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Aggiorno…' : 'Aggiorna'}
            </button>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 18px', borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f 0%,#a06525 100%)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 14, fontWeight: 600 }}>
              <Plus size={16} /> Aggiungi condominio
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
            <input type="text" placeholder="Cerca condominio…" value={q} onChange={e => setQ(e.target.value)} style={{ width: '100%', height: 36, paddingLeft: 32, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', background: 'var(--bg)' }} />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['tutti', 'roma', 'provincia'].map(z => (
              <button key={z} onClick={() => setZona(z)} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 0, cursor: 'pointer', background: zona === z ? 'var(--copper-50)' : 'transparent', color: zona === z ? 'var(--copper-dark)' : 'var(--ink-soft)', fontWeight: zona === z ? 600 : 400, fontSize: 13, boxShadow: zona === z ? '0 0 0 1px var(--copper-100)' : 'none' }}>
                {z.charAt(0).toUpperCase() + z.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setSort(nextSort[sort])} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 0, cursor: 'pointer', background: 'var(--surface)', boxShadow: '0 0 0 1.5px var(--border-strong)', fontSize: 13, fontWeight: 500 }}>
            Ordina per: {sortLabels[sort]} ▾
          </button>
        </div>

        {/* List */}
        {loading ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>Caricamento…</div> :
         filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)', borderRadius: 20, background: 'var(--surface)' }}>
            <Building2 size={40} color="var(--ink-soft)" style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nessun condominio ancora</div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 20 }}>Aggiungi il tuo primo condominio per iniziare a gestire i servizi.</div>
            <button onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 20px', borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 14, fontWeight: 600 }}>
              <Plus size={16} /> Aggiungi condominio
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
            {filtered.map(c => (
              <div key={c._id} style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ padding: '20px 22px', background: 'linear-gradient(135deg,#fdf8f3,#f5ece0)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0, background: 'linear-gradient(155deg,#c8843f,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={24} color="#fff" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, marginBottom: 2 }}>{c.nome}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{c.via ? `${c.via}, ` : ''}{c.citta || '—'}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
                  {[
                    { label: 'Unità', val: c.unita || 0, color: 'var(--copper-dark)' },
                    { label: 'Servizi attivi', val: c.attivi || 0, color: 'var(--success)' },
                    { label: 'In scadenza', val: c.scadenze || 0, color: (c.scadenze || 0) > 0 ? 'var(--danger)' : 'var(--ink-soft)' },
                    { label: 'Storno annuo', val: `€ ${c.storno || 0}`, color: 'var(--copper-dark)' },
                  ].map(({ label, val, color }, i) => (
                    <div key={label} style={{ padding: '14px 18px', borderTop: i >= 2 ? '1px solid var(--border)' : 'none', borderLeft: i % 2 === 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px 18px' }}>
                  <Link to={`/condomini/${c._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38, borderRadius: 10, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', fontSize: 13.5, fontWeight: 600, color: '#fff' }}>Servizi →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />

      {/* ═══ MODALE AGGIUNGI CONDOMINIO ═══ */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ width: '100%', maxWidth: 480, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 30px 60px -20px rgba(20,12,6,.4)', position: 'relative', animation: 'rise .3s cubic-bezier(.2,.7,.3,1)' }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes rise{from{transform:translateY(16px) scale(.97);opacity:0}to{transform:none;opacity:1}}`}</style>

            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(155deg,#c8843f,#8b5520)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} color="#fff" strokeWidth={1.6} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, margin: 0 }}>Aggiungi condominio</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>Inserisci i dati dell'edificio</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Nome condominio *</label>
                <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Es. Residence Aventino" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Indirizzo</label>
                <input value={form.via} onChange={e => set('via', e.target.value)} placeholder="Es. Via di San Saba 24" style={inp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Città</label>
                  <input value={form.citta} onChange={e => set('citta', e.target.value)} placeholder="Es. Roma" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>N° condomini</label>
                  <input type="number" value={form.unita} onChange={e => set('unita', e.target.value)} placeholder="Es. 32" style={inp} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Codice fiscale</label>
                <input value={form.codiceFiscale} onChange={e => set('codiceFiscale', e.target.value)} placeholder="Es. 97012345678" style={inp} />
              </div>

              {saveErr && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>{saveErr}</div>}

              <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 48, borderRadius: 12, border: 0, marginTop: 4, background: saving ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: saving ? 'none' : '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 15, fontWeight: 600 }}>
                <Check size={16} /> {saving ? 'Salvataggio…' : 'Salva condominio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
