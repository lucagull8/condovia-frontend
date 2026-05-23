import { Zap, Flame, Droplets, Leaf, Sparkles, ArrowUpDown, DoorOpen, Shield, Thermometer, Wrench, Bolt, ClipboardList, ShieldCheck, HardHat, Camera, Calculator } from 'lucide-react';

export const ICON_MAP = { Zap, Flame, Droplets, Leaf, Sparkles, ArrowUpDown, DoorOpen, Shield, Thermometer, Wrench, Bolt, ClipboardList, ShieldCheck, HardHat, Camera, Calculator };

export const SERVIZI_CATALOGO = [
  { id: 'energia', label: 'Energia', color: '#f5a623', bg: '#fef3e2', icon: 'Zap' },
  { id: 'gas', label: 'Gas', color: '#e8740c', bg: '#fde8d0', icon: 'Flame' },
  { id: 'acque', label: 'Acque potabili', color: '#3b82f6', bg: '#dbeafe', icon: 'Droplets' },
  { id: 'verde', label: 'Aree verdi', color: '#22c55e', bg: '#dcfce7', icon: 'Leaf' },
  { id: 'pulizie', label: 'Pulizie scale', color: '#8b5cf6', bg: '#ede9fe', icon: 'Sparkles' },
  { id: 'ascensore', label: 'Ascensore', color: '#92400e', bg: '#fef3c7', icon: 'ArrowUpDown' },
  { id: 'cancelli', label: 'Cancelli', color: '#ef4444', bg: '#fee2e2', icon: 'DoorOpen' },
  { id: 'antincendio', label: 'Antincendio', color: '#dc2626', bg: '#fde8d0', icon: 'Flame' },
  { id: 'privacy', label: 'Privacy', color: '#64748b', bg: '#f1f5f9', icon: 'Shield' },
  { id: 'termiche', label: 'Centrali termiche', color: '#f59e0b', bg: '#fef3c7', icon: 'Thermometer' },
  { id: 'idraulica', label: 'Idraulica', color: '#0ea5e9', bg: '#e0f2fe', icon: 'Wrench' },
  { id: 'elettrici', label: 'Impianti elettrici', color: '#eab308', bg: '#fefce8', icon: 'Bolt' },
  { id: 'ras', label: 'RAS Condominio', color: '#4ade80', bg: '#f0fdf4', icon: 'ClipboardList' },
  { id: 'assicurazione', label: 'Assicurazione', color: '#1e3a5f', bg: '#dde7ee', icon: 'ShieldCheck' },
  { id: 'edilizia', label: 'Edilizia minore', color: '#b87333', bg: '#fbf3ea', icon: 'HardHat' },
  { id: 'videosorveglianza', label: 'Videosorveglianza', color: '#6b7280', bg: '#f3f4f6', icon: 'Camera' },
  { id: 'contabilita', label: 'Contabilità', color: '#7c3aed', bg: '#ede9fe', icon: 'Calculator' },
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
      <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: service.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: status === 'no' ? 0.45 : 1 }}>
        <Icon size={Math.round(size * 0.45)} color={service.color} strokeWidth={1.6} />
      </div>
      {status && status !== 'no' && <StatusDot status={status} />}
    </div>
  );
}

export function findServiceCatalog(id) {
  return SERVIZI_CATALOGO.find(s => s.id === id) || { id, label: id, color: '#999', bg: '#f5f5f5', icon: 'Shield' };
}
