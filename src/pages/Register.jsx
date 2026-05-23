import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckBig } from 'lucide-react';
import { Header, Footer } from '../components/Shared';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ nome: '', cognome: '', email: '', password: '', studio: '', telefono: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.cognome || !form.email || !form.password) { setErr('Compila tutti i campi obbligatori.'); return; }
    if (form.password.length < 6) { setErr('La password deve avere almeno 6 caratteri.'); return; }
    setBusy(true); setErr('');
    try { await register(form); setDone(true); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const inp = { width: '100%', height: 48, borderRadius: 12, padding: '0 16px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header isPublic />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px', background: 'radial-gradient(120% 120% at 30% 20%,#d4915a,#b87333,#6e3e15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px var(--copper-50)' }}>
                <CircleCheckBig size={32} color="#fff" />
              </div>
              <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 28, margin: '0 0 12px' }}>Richiesta ricevuta!</h1>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 8px' }}>
                Il team Condovia approverà il tuo account entro <strong>24 ore</strong>.
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 28px' }}>
                Potrai accedere con <strong>{form.email}</strong> e la password che hai scelto.
              </p>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 10, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600 }}>← Torna alla home</Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 30, margin: '0 0 6px' }}>Richiedi l'accesso</h1>
              <p style={{ margin: '0 0 32px', fontSize: 14, color: 'var(--ink-soft)' }}>Compila il modulo. Il team attiverà il tuo account entro 24 ore.</p>
              <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Nome *</label>
                    <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Mario" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Cognome *</label>
                    <input value={form.cognome} onChange={e => set('cognome', e.target.value)} placeholder="Rossi" style={inp} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="nome@studio.it" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Password * <span style={{ fontWeight: 400, color: 'var(--ink-soft)' }}>(min. 6 caratteri)</span></label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={inp} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Nome studio</label>
                    <input value={form.studio} onChange={e => set('studio', e.target.value)} placeholder="Studio Rossi" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>Telefono</label>
                    <input value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+39 06 ..." style={inp} />
                  </div>
                </div>
                {err && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid #e8b8a8', color: 'var(--danger)', fontSize: 13 }}>{err}</div>}
                <button type="submit" disabled={busy} style={{ height: 52, borderRadius: 13, border: 0, background: busy ? 'rgba(184,115,51,.4)' : 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 15, fontWeight: 600 }}>
                  {busy ? 'Invio…' : 'Invia richiesta →'}
                </button>
              </form>
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Hai già un account? <Link to="/login" style={{ color: 'var(--copper-dark)', fontWeight: 600 }}>Accedi</Link></span>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
