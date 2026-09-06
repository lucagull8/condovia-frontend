import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { Header, Footer } from '../components/Shared';
import { DocumentiPanel } from '../components/DocumentiPanel';
import { getMieiDocumenti, getMioDocumentoUrl } from '../api';

export default function Documenti() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    getMieiDocumenti().then(setDocs).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />
      <main className="hdr-page-pad" style={{ maxWidth: 980, width: '100%', margin: '0 auto', padding: '32px 20px 60px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--copper-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="var(--copper-dark)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(24px,4vw,32px)', letterSpacing: '-0.02em', margin: 0 }}>Documenti</h1>
            <p style={{ margin: '2px 0 0', fontSize: 13.5, color: 'var(--ink-soft)' }}>Contratti con i fornitori e fatture emesse da Condovia.</p>
          </div>
        </div>

        <div style={{ marginTop: 28, padding: '24px 22px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18 }}>
          {loading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-soft)' }}>Caricamento…</div>
          ) : err ? (
            <div style={{ padding: '16px', borderRadius: 10, background: 'rgba(220,80,60,.08)', border: '1px solid rgba(220,80,60,.25)', color: 'var(--danger)', fontSize: 13 }}>{err}</div>
          ) : (
            <>
              <DocumentiPanel
                titolo="Contratti"
                tipo="contratto"
                docs={docs.filter(d => d.tipo === 'contratto')}
                fileUrl={d => getMioDocumentoUrl(d._id)}
                emptyText="Nessun contratto ancora caricato dal team Condovia."
              />
              <DocumentiPanel
                titolo="Fatture"
                tipo="fattura"
                docs={docs.filter(d => d.tipo === 'fattura')}
                fileUrl={d => getMioDocumentoUrl(d._id)}
                filtroPerMese
                emptyText="Nessuna fattura ancora emessa."
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
