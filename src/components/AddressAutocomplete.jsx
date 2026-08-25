import { useState, useEffect, useRef, useCallback } from 'react';

// Autocomplete indirizzo via OpenStreetMap Nominatim (gratis, no API key).
// Uso: <AddressAutocomplete value={form.via} onChange={v => setForm(f=>({...f,via:v}))} onSelect={a => setForm(f=>({...f,via:a.via,citta:a.citta}))} style={inp} />
export function AddressAutocomplete({ value, onChange, onSelect, placeholder = 'Via, città', style = {}, minChars = 3, debounceMs = 350 }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const suppressRef = useRef(false);

  const closeOnOutside = useCallback((e) => {
    if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, [closeOnOutside]);

  useEffect(() => {
    if (suppressRef.current) { suppressRef.current = false; return; }
    if (!value || value.trim().length < minChars) { setSuggestions([]); setOpen(false); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&countrycodes=it&limit=6&accept-language=it`;
        const r = await fetch(url, { signal: abortRef.current.signal, headers: { 'Accept': 'application/json' } });
        if (!r.ok) throw new Error(String(r.status));
        const rows = await r.json();
        const parsed = rows.map(row => {
          const a = row.address || {};
          const road = a.road || a.pedestrian || a.footway || a.residential || '';
          const house = a.house_number || '';
          const via = [road, house].filter(Boolean).join(', ');
          const citta = a.city || a.town || a.village || a.municipality || a.county || '';
          const cap = a.postcode || '';
          const provincia = a.state_district || a.province || a.county || '';
          return { display: row.display_name, via, citta, cap, provincia };
        }).filter(x => x.via || x.citta);
        setSuggestions(parsed);
        setOpen(parsed.length > 0);
        setHighlight(-1);
      } catch (e) {
        if (e.name !== 'AbortError') { setSuggestions([]); setOpen(false); }
      } finally {
        setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [value, minChars, debounceMs]);

  const pick = (s) => {
    suppressRef.current = true;
    onChange(s.via || value);
    onSelect?.(s);
    setOpen(false);
    setSuggestions([]);
  };

  const onKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); pick(suggestions[highlight]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        placeholder={placeholder}
        autoComplete="off"
        style={style}
      />
      {loading && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--ink-soft)', pointerEvents: 'none' }}>…</span>}
      {open && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.08)', zIndex: 100, maxHeight: 260, overflowY: 'auto' }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={e => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setHighlight(i)}
              style={{ padding: '10px 12px', fontSize: 13, cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 0, background: highlight === i ? 'var(--copper-50)' : 'transparent' }}
            >
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.via || s.display}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{[s.citta, s.cap].filter(Boolean).join(' · ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
