import {
  HardHat, Lightbulb, Flame, DoorOpen, Droplets, ArrowUpDown,
  Shield, ShieldCheck, Zap, Building2, Wrench, Camera, Sparkles, Leaf, Bolt, ClipboardList, Thermometer, Calculator,
} from 'lucide-react';

export const ICON_MAP = {
  HardHat, Lightbulb, Flame, DoorOpen, Droplets, ArrowUpDown,
  Shield, ShieldCheck, Zap, Building2, Wrench, Camera, Sparkles, Leaf, Bolt, ClipboardList, Thermometer, Calculator,
};

// Catalogo servizi ufficiali (allineato con SERVIZI_REALI del backend).
export const SERVIZI_CATALOGO = [
  { id: 'edilizia',       label: 'Lavori edili e manutenzione',         color: '#b87333', bg: '#fbf3ea', icon: 'HardHat' },
  { id: 'elettrici',      label: 'Impianti elettrici (luce)',           color: '#eab308', bg: '#fefce8', icon: 'Lightbulb' },
  { id: 'gas',            label: 'Impianti gas',                        color: '#e8740c', bg: '#fde8d0', icon: 'Flame' },
  { id: 'cancelli',       label: 'Cancelli automatici',                 color: '#dc2626', bg: '#fee2e2', icon: 'DoorOpen' },
  { id: 'acque',          label: 'Acque potabili',                      color: '#3b82f6', bg: '#dbeafe', icon: 'Droplets' },
  { id: 'ascensori',      label: 'Ascensori',                           color: '#92400e', bg: '#fef3c7', icon: 'ArrowUpDown' },
  { id: 'privacy',        label: 'Privacy (GDPR)',                      color: '#64748b', bg: '#f1f5f9', icon: 'Shield' },
  { id: 'messa-a-terra',  label: 'Messa a terra',                       color: '#f5a623', bg: '#fef3e2', icon: 'Zap' },
  { id: 'immobiliari',    label: 'Servizi immobiliari',                 color: '#7c3aed', bg: '#ede9fe', icon: 'Building2' },
  { id: 'assicurazione',  label: 'Assicurazione fabbricato',            color: '#1e3a5f', bg: '#dde7ee', icon: 'ShieldCheck' },
];

function StatusDot({ status }) {
  if (status === 'attivo') return <span style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: 'var(--success)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg></span>;
  if (status === 'scadenza') return <span style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: 'var(--danger)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>!</span>;
  return null;
}

export function ServiceIcon({ service, size = 56, status }) {
  const Icon = ICON_MAP[service.icon] || Shield;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: service.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: status === 'no' ? 0.55 : 1 }}>
        <Icon size={Math.round(size * 0.48)} color={service.color} strokeWidth={2.1} />
      </div>
      {status && status !== 'no' && <StatusDot status={status} />}
    </div>
  );
}

export function findServiceCatalog(id) {
  return SERVIZI_CATALOGO.find(s => s.id === id) || { id, label: id, color: '#999', bg: '#f5f5f5', icon: 'Shield' };
}
