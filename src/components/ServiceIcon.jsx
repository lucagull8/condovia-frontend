// Catalogo servizi ufficiali con glifi SVG custom (variante "Glifo pieno su tinta chiara" dal design).
// Ogni glifo è un path unico con fill-rule='evenodd' che ricava i dettagli in negativo, come le
// icone di sistema iOS/Material: peso solido, riconoscibili anche a 20px, coerenti tra loro.
export const SERVIZI_CATALOGO = [
  { id: 'edilizia',       label: 'Lavori edili e manutenzione',         tint: '#f6e6d3', fg: '#a05f26', path: 'M12 3.4c-3.6 0-6.5 2.9-6.5 6.5v5.4h13V9.9c0-3.6-2.9-6.5-6.5-6.5Z M2.6 16.7h18.8a1.35 1.35 0 0 1 0 2.7H2.6a1.35 1.35 0 0 1 0-2.7Z M8.2 7.5h2v7.8h-2Z M13.8 7.5h2v7.8h-2Z' },
  { id: 'elettrici',      label: 'Impianti elettrici (luce)',           tint: '#f8eec9', fg: '#9a7411', path: 'M12 2.5a6.7 6.7 0 0 0-4.1 12c.7.6 1.1 1.3 1.2 2.1h5.8c.1-.8.5-1.5 1.2-2.1A6.7 6.7 0 0 0 12 2.5Z M9 17.8h6v1.9H9Z M10.1 21h3.8v1.4h-3.8Z M13.3 5.6 8.9 11.6h2.9l-1 4.3 4.4-6.1h-2.9Z' },
  { id: 'gas',            label: 'Impianti gas',                        tint: '#fbe3ce', fg: '#b1571a', path: 'M12 22a6.6 6.6 0 0 0 6.6-6.6c0-4.8-4.8-6.8-4.8-10.8 0 0-1.6 2.2-1.6 4.8 0 0-1.2-1-1.7-2.4-1.3 2.3-3.9 4.5-3.9 7.8A6.6 6.6 0 0 0 12 22Z M12 19.7a3.4 3.4 0 0 0 3.4-3.4c0-2.5-2.5-3.5-2.5-6.1 0 0-1.1 1.7-1.1 3.3 0 0-.7-.6-1-1.4-.8 1.5-2.2 2.7-2.2 4.6a3.4 3.4 0 0 0 3.4 3Z' },
  { id: 'cancelli',       label: 'Cancelli automatici',                 tint: '#f7dcd6', fg: '#a4402c', path: 'M2 19.5h20v2H2Z M3.4 8.3 8.6 6v12.4H3.4Z M20.6 8.3 15.4 6v12.4h5.2Z M9.8 6h1.8v12.4H9.8Z M12.4 6h1.8v12.4h-1.8Z M4.9 9.8h1.6v7.4H4.9Z M17.5 9.8h1.6v7.4h-1.6Z' },
  { id: 'acque',          label: 'Acque potabili',                      tint: '#dceaf3', fg: '#2b7ba0', path: 'M12 2.3c3.7 4.8 6.5 8 6.5 11.6a6.5 6.5 0 1 1-13 0C5.5 10.3 8.3 7.1 12 2.3Z M12 18.6a4.9 4.9 0 0 1-4.9-4.9h2.7a2.2 2.2 0 0 0 2.2 2.2Z' },
  { id: 'ascensori',      label: 'Ascensori',                           tint: '#efe6d7', fg: '#7d5c31', path: 'M4.6 2.5h14.8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H4.6a1.5 1.5 0 0 1-1.5-1.5V4a1.5 1.5 0 0 1 1.5-1.5Z M11.35 4.6h1.3v14.8h-1.3Z M8.2 6.3 5.7 10.9h5Z M15.8 17.7l-2.5-4.6h5Z' },
  { id: 'privacy',        label: 'Privacy (GDPR)',                      tint: '#e4e8ee', fg: '#4c5f72', path: 'M12 2.4 4.4 5.3v6.2c0 5 3.2 8.6 7.6 10.2 4.4-1.6 7.6-5.2 7.6-10.2V5.3Z M12 8.1a2.8 2.8 0 0 0-1.4 5.2v2.6h2.8v-2.6A2.8 2.8 0 0 0 12 8.1Z' },
  { id: 'messa-a-terra',  label: 'Messa a terra',                       tint: '#f8eed6', fg: '#9c7318', path: 'M10.8 2.5h2.4v7.9h-2.4Z M6.1 10.3h11.8v2.3H6.1Z M7.9 14h8.2v2.3H7.9Z M9.7 17.7h4.6v2.3H9.7Z' },
  { id: 'immobiliari',    label: 'Servizi immobiliari',                 tint: '#e9e3f1', fg: '#6a4b90', path: 'M2.8 21.4V9.1h7.6v12.3Z M11.6 21.4V4.4h9.6v17Z M2 21.4h20v1.6H2Z M4.7 11.4h2v2h-2Z M7.7 11.4h2v2h-2Z M4.7 15h2v2h-2Z M7.7 15h2v2h-2Z M13.5 6.7h2.1v2.1h-2.1Z M17.1 6.7h2.1v2.1h-2.1Z M13.5 10.6h2.1v2.1h-2.1Z M17.1 10.6h2.1v2.1h-2.1Z M13.5 14.5h2.1v2.1h-2.1Z M17.1 14.5h2.1v2.1h-2.1Z' },
  { id: 'assicurazione',  label: 'Assicurazione fabbricato',            tint: '#e2e7f2', fg: '#3a5088', path: 'M12 2.4 4.4 5.3v6.2c0 5 3.2 8.6 7.6 10.2 4.4-1.6 7.6-5.2 7.6-10.2V5.3Z M12 6.6 7.4 10.2v6.2h9.2v-6.2Z M11.1 13.1h1.9v3.3h-1.9Z' },
];

const CAT_BY_ID = Object.fromEntries(SERVIZI_CATALOGO.map(s => [s.id, s]));

// Fallback path se non troviamo l'id nel catalogo (glifo cerchio pieno)
const FALLBACK_PATH = 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z';

function StatusDot({ status }) {
  if (status === 'attivo') return <span style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: 'var(--success)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg></span>;
  if (status === 'scadenza') return <span style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: 'var(--danger)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>!</span>;
  return null;
}

export function ServiceIcon({ service, size = 56, status }) {
  const id = service?.id || service?.sid;
  const cat = CAT_BY_ID[id];
  const tint = cat?.tint || service?.bg || '#f1f0ee';
  const fg = cat?.fg || service?.color || '#666';
  const path = cat?.path || FALLBACK_PATH;
  const glyphSize = Math.round(size * 0.46);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: status === 'no' ? 0.75 : 1 }}>
        <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" style={{ display: 'block' }}>
          <path d={path} fill={fg} fillRule="evenodd" />
        </svg>
      </div>
      {status && status !== 'no' && <StatusDot status={status} />}
    </div>
  );
}

export function findServiceCatalog(id) {
  return CAT_BY_ID[id] || { id, label: id, tint: '#f5f5f5', fg: '#666', path: FALLBACK_PATH };
}
