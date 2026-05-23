export const BASE = import.meta.env.VITE_API_URL || 'https://condovia-backend.onrender.com';

function getToken() { return localStorage.getItem('condovia_token'); }

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Auth
export const login = (email, pw) => request('POST', '/api/auth/login', { email, password: pw }).then(d => { localStorage.setItem('condovia_token', d.token); return d; });
export const register = (p) => request('POST', '/api/auth/register', p);
export const getMe = () => request('GET', '/api/auth/me');
export const logout = () => localStorage.removeItem('condovia_token');

// Servizi
export const getServizi = () => request('GET', '/api/servizi');
export const getServizio = (id) => request('GET', `/api/servizi/${id}`);

// Condomini
export const getCondomini = () => request('GET', '/api/condomini');
export const getCondominio = (id) => request('GET', `/api/condomini/${id}`);
export const creaCondominio = (p) => request('POST', '/api/condomini', p);

// Wallet
export const getWallet = () => request('GET', '/api/wallet');
export const richiediPagamento = (importo) => request('POST', '/api/wallet/richiedi', { importo });

// Richieste (admin crea)
export const creaRichiesta = (p) => request('POST', '/api/richieste', p);

// ─── BACKOFFICE ──────────────────────────────────────────
export const boGetDashboard = () => request('GET', '/api/backoffice/dashboard');
export const boGetServizi = () => request('GET', '/api/backoffice/servizi');
export const boGetCondominiAdmin = (adminId) => request('GET', `/api/backoffice/condomini/${adminId}`);
export const boGetAmministratori = () => request('GET', '/api/backoffice/admin');
export const boGetAmministratore = (id) => request('GET', `/api/backoffice/admin/${id}`);

export const boGetContratti = () => request('GET', '/api/backoffice/contratti');
export async function boPostContratto(formData) {
  const token = getToken();
  const res = await fetch(`${BASE}/api/backoffice/contratti`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const boGetMargini = () => request('GET', '/api/backoffice/margini');
export const boGetRichieste = (stato) => request('GET', `/api/backoffice/richieste${stato ? `?stato=${stato}` : ''}`);
export const boPatchRichiesta = (id, p) => request('PATCH', `/api/backoffice/richieste/${id}`, p);

export const boGetIscrizioni = (stato) => request('GET', `/api/backoffice/iscrizioni?stato=${stato}`);
export const boApprovaIscrizione = (id) => request('PATCH', `/api/backoffice/iscrizioni/${id}/approva`, {});
export const boRifiutaIscrizione = (id) => request('PATCH', `/api/backoffice/iscrizioni/${id}/rifiuta`, {});

export const boGetFatturazione = (stato) => request('GET', `/api/backoffice/fatturazione${stato ? `?stato=${stato}` : ''}`);
export const boPatchFattura = (id, p) => request('PATCH', `/api/backoffice/fatturazione/${id}`, p);
