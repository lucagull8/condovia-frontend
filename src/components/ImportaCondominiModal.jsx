import { useState } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, Download, Check, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { boBulkCreaCondomini } from '../api';

// Normalizza header per matching case/accent-insensitive
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// Sinonimi accettati per ogni campo
const MAPPA = {
  nome: ['nome', 'denominazione', 'nomecondominio'],
  via: ['indirizzo', 'via', 'viaecivico'],
  citta: ['citta', 'comune'],
  unita: ['numeroui', 'unita', 'nunita', 'numerounita', 'ui'],
  codiceFiscale: ['codicefiscale', 'cf', 'partitaiva', 'piva'],
};

const trovaHeaderRow = (rows) => {
  for (let i = 0; i < Math.min(30, rows.length); i++) {
    const cells = (rows[i] || []).map(norm);
    if (cells.includes('nome') && (cells.includes('codicefiscale') || cells.includes('cf'))) return i;
  }
  return -1;
};

const splitIndirizzo = (str) => {
  const s = String(str || '').trim().replace(/\s+/g, ' ');
  const m = s.match(/^(.+?)[,\s]+(\d{5})\s+(.+?)(?:\s+([A-Z]{2}))?\s*$/);
  if (m) return { via: m[1].trim().replace(/,\s*$/, ''), citta: m[3].trim() };
  return { via: s, citta: '' };
};

const parseWorkbook = (data) => {
  const wb = XLSX.read(data, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const headerIdx = trovaHeaderRow(rows);
  if (headerIdx === -1) throw new Error('File non riconosciuto. Assicurati che ci sia una riga con almeno le colonne "Nome" e "Codice Fiscale".');
  const headers = (rows[headerIdx] || []).map(norm);
  const mapping = {};
  for (const [campo, sinonimi] of Object.entries(MAPPA)) {
    const idx = headers.findIndex(h => sinonimi.includes(h));
    if (idx !== -1) mapping[campo] = idx;
  }
  const result = [];
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => String(c || '').trim() === '')) continue;
    const nome = mapping.nome !== undefined ? String(row[mapping.nome] || '').trim() : '';
    if (!nome) continue;
    let via = mapping.via !== undefined ? String(row[mapping.via] || '').trim() : '';
    let citta = mapping.citta !== undefined ? String(row[mapping.citta] || '').trim() : '';
    if (via && !citta) {
      const p = splitIndirizzo(via);
      via = p.via;
      citta = p.citta;
    }
    const unita = mapping.unita !== undefined ? String(row[mapping.unita] || '').trim() : '';
    const cf = mapping.codiceFiscale !== undefined ? String(row[mapping.codiceFiscale] || '').trim() : '';
    result.push({ nome, via, citta, unita, codiceFiscale: cf });
  }
  return result;
};

const scaricaTemplate = () => {
  const data = [
    ['Nome', 'Indirizzo', 'Città', 'Numero U.I', 'Codice Fiscale'],
    ['Residence Aventino', 'Via di San Saba, 24', 'Roma', 32, '97012345678'],
    ['Condominio Verde', 'Via delle Magnolie 62 00058 SANTA MARINELLA RM', '', 13, '91016670589'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Condomini');
  XLSX.writeFile(wb, 'template-condomini.xlsx');
};

export function ImportaCondominiModal({ adminId, onClose, onDone }) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [err, setErr] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(''); setResult(null); setFileName(f.name);
    try {
      const buf = await f.arrayBuffer();
      const parsed = parseWorkbook(buf);
      if (parsed.length === 0) { setErr('Il file non contiene condomini validi (righe con Nome).'); setRows([]); return; }
      setRows(parsed);
    } catch (e) {
      setErr(e.message);
      setRows([]);
    }
  };

  const handleImport = async () => {
    if (rows.length === 0) return;
    setImporting(true); setErr('');
    try {
      const r = await boBulkCreaCondomini(adminId, rows);
      setResult(r);
      onDone?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setImporting(false);
    }
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg)' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,20,17,.55)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 720, maxHeight: '90vh', background: 'var(--surface)', borderRadius: 20, padding: '28px 24px', position: 'relative', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
        <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, margin: '0 0 6px' }}>Importa condomini da Excel</h2>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--ink-soft)' }}>Carica il file esportato dal gestionale dell'amministratore.</p>

        {!result && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={scaricaTemplate} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <Download size={14} /> Scarica template
            </button>
            <button onClick={() => setShowInfo(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--copper-dark)' }}>
              <AlertCircle size={14} /> {showInfo ? 'Nascondi istruzioni' : 'Istruzioni per il cliente'}
            </button>
          </div>
        )}

        {showInfo && !result && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Da inviare al cliente amministratore:</div>
            <div style={{ color: 'var(--ink-soft)' }}>
              <p style={{ margin: '0 0 8px' }}>Per importare i tuoi condomini su Condovia:</p>
              <p style={{ margin: '0 0 8px' }}><strong>1.</strong> Esporta l'elenco condomini dal tuo gestionale in formato <strong>Excel (.xlsx o .xls)</strong>. Non è necessario riformattarlo — accettiamo l'export originale.</p>
              <p style={{ margin: '0 0 8px' }}><strong>2.</strong> Il file deve contenere una tabella con almeno queste colonne (in qualsiasi ordine):</p>
              <ul style={{ margin: '0 0 8px 20px' }}>
                <li><strong>Nome</strong> (obbligatoria) — es. "Residence Aventino"</li>
                <li><strong>Indirizzo</strong> — es. "Via di San Saba, 24" oppure il formato del gestionale "Via COL SANTO, 1 00058 SANTA MARINELLA RM" (splittiamo noi)</li>
                <li><strong>Città</strong> — opzionale, la ricaviamo dall'indirizzo se assente</li>
                <li><strong>Numero U.I</strong> — numero unità immobiliari</li>
                <li><strong>Codice Fiscale</strong> — CF del condominio (necessario per riconoscere aggiornamenti sullo stesso condominio)</li>
              </ul>
              <p style={{ margin: '0 0 8px' }}><strong>3.</strong> Altre colonne (Codice, Banca, Ultimo Esercizio, ecc.) vengono ignorate automaticamente. Non serve rimuoverle.</p>
              <p style={{ margin: 0 }}><strong>4.</strong> Se un condominio con lo stesso Codice Fiscale è già caricato, i suoi dati vengono aggiornati (non duplicato).</p>
            </div>
          </div>
        )}

        {!result && (
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', minHeight: 60, borderRadius: 12, border: '2px dashed var(--border)', background: 'var(--bg)', fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer', marginBottom: 16 }}>
            <Upload size={16} /> {fileName || 'Seleziona file Excel (.xlsx / .xls)'}
            <input type="file" accept=".xlsx,.xls" onChange={onFile} style={{ display: 'none' }} />
          </label>
        )}

        {err && (
          <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(220,80,60,.08)', border: '1px solid rgba(220,80,60,.25)', color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>
            {err}
          </div>
        )}

        {rows.length > 0 && !result && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                <FileSpreadsheet size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                <strong style={{ color: 'var(--ink)' }}>{rows.length}</strong> condomini rilevati
              </div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', flex: 1, minHeight: 200, maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ background: 'var(--bg)', position: 'sticky', top: 0 }}>
                  {['Nome', 'Indirizzo', 'Città', 'U.I', 'CF'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {rows.slice(0, 100).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 500 }}>{r.nome}</td>
                      <td style={{ padding: '6px 10px' }}>{r.via || '—'}</td>
                      <td style={{ padding: '6px 10px' }}>{r.citta || '—'}</td>
                      <td style={{ padding: '6px 10px' }}>{r.unita || '—'}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--ink-soft)' }}>{r.codiceFiscale || '—'}</td>
                    </tr>
                  ))}
                  {rows.length > 100 && (
                    <tr><td colSpan={5} style={{ padding: '8px 10px', textAlign: 'center', fontStyle: 'italic', color: 'var(--ink-soft)' }}>… e altri {rows.length - 100} condomini</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <button onClick={handleImport} disabled={importing} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 46, borderRadius: 12, border: 0, background: 'linear-gradient(180deg,#c8843f,#a06525)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: importing ? 0.6 : 1 }}>
              <Check size={15} /> {importing ? 'Importazione in corso…' : `Importa ${rows.length} condomini`}
            </button>
          </>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 20, borderRadius: 12, background: 'rgba(40,160,80,.08)', border: '1px solid rgba(40,160,80,.25)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>✅ Importazione completata</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                <div><strong style={{ color: 'var(--success)' }}>{result.creati}</strong> condomini creati</div>
                <div><strong style={{ color: 'var(--copper-dark)' }}>{result.aggiornati}</strong> condomini aggiornati (già presenti con lo stesso CF)</div>
                {result.saltati > 0 && <div><strong>{result.saltati}</strong> righe saltate (nome mancante)</div>}
                {result.errori?.length > 0 && <div><strong style={{ color: 'var(--danger)' }}>{result.errori.length}</strong> errori</div>}
              </div>
            </div>
            {result.errori?.length > 0 && (
              <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: 12 }}>
                {result.errori.map((e, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>Riga {e.riga} — {e.nome || '(no nome)'}: <span style={{ color: 'var(--danger)' }}>{e.err}</span></div>
                ))}
              </div>
            )}
            <button onClick={onClose} style={{ height: 44, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Chiudi</button>
          </div>
        )}
      </div>
    </div>
  );
}
