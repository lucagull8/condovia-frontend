import { Link } from 'react-router-dom';
import { Wallet, Users, CircleCheckBig, CircleAlert, Circle } from 'lucide-react';
import { Header, Footer } from '../components/Shared';
import { ServiceIcon, SERVIZI_CATALOGO } from '../components/ServiceIcon';
export default function Landing() {
  return <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header isPublic />
    <section style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '80px 24px 60px' }}>
      <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 'clamp(36px,6vw,72px)', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 20px', maxWidth: 680 }}>I tuoi servizi<br /><span style={{ color: 'var(--copper)' }}>a portata di mano.</span></h1>
      <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 520, margin: '0 0 36px' }}>Condovia connette gli amministratori di condominio con i migliori fornitori certificati del Lazio.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(180deg,#c8843f,#a06525)', boxShadow: '0 0 0 1px rgba(110,62,21,.55)', color: '#fff', fontSize: 15, fontWeight: 600 }}>Accedi come Amministratore →</Link>
        <Link to="/registrati" style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 12, boxShadow: '0 0 0 1.5px var(--border-strong)', fontSize: 15, fontWeight: 500 }}>Iscriviti</Link>
        <Link to="/backoffice/login" style={{ display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 18px', borderRadius: 10, boxShadow: '0 0 0 1.5px rgba(184,115,51,.55)', color: 'var(--copper-dark)', fontSize: 13, fontWeight: 600 }}>Backoffice</Link>
      </div>
    </section>
    <section style={{ maxWidth: 1200, margin: '0 auto 60px', width: '100%', padding: '0 24px' }}>
      <div style={{ border: '1px solid var(--border)', borderRadius: 32, padding: 'clamp(20px,4vw,40px)', background: 'var(--surface)' }}>
        <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, margin: '0 0 20px' }}>Tutti i servizi condominiali</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '20px 12px' }}>
          {SERVIZI_CATALOGO.map(s => <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <ServiceIcon service={s} size={60} status="no" />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.25 }}>{s.label}</span>
          </div>)}
        </div>
      </div>
    </section>
    <section style={{ maxWidth: 1000, margin: '0 auto 80px', width: '100%', padding: '0 24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 18 }}>I nostri partner</div>
        <style>{`
          .pcard{display:flex;align-items:center;justify-content:center;background:#fff;border:1px solid var(--border);border-radius:12px;width:132px;height:64px;padding:10px 14px;transition:transform .2s,box-shadow .2s}
          .pcard:hover{transform:translateY(-1px);box-shadow:0 4px 14px -6px rgba(31,29,33,.14)}
          .pcard img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
          .pcard img.baiocco{max-height:44px}
          .pcard img.elti{max-height:28px}
          .pcard img.domova{max-height:26px}
          .pcard img.hexa{max-height:56px;border-radius:6px}
          @media(max-width:520px){.pcard{width:120px;height:56px}}
        `}</style>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <div className="pcard" title="Baiocco Holding SPA"><img className="baiocco" src="/partners/baiocco.jpg" alt="Baiocco Holding SPA" loading="lazy" /></div>
          <div className="pcard" title="E.L.T.I."><img className="elti" src="/partners/elti.jpg" alt="E.L.T.I." loading="lazy" /></div>
          <div className="pcard" title="Gruppo Hexa"><img className="hexa" src="/partners/hexa.jpg" alt="Gruppo Hexa" loading="lazy" /></div>
          <div className="pcard" title="Domova Gestioni"><img className="domova" src="/partners/domova.jpg" alt="Domova Gestioni" loading="lazy" /></div>
        </div>
      </div>
    </section>
    <Footer />
  </div>;
}
