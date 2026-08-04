export const BASE = import.meta.env.VITE_API_URL;

function getToken() { return localStorage.getItem('condovia_token'); }

async function request(method, path, body) {
  const token = getToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function upload(method, path, formData) {
  const token = getToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      signal: controller.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export const login = (email, pw) =>
  request('POST', '/api/auth/login', { email, password: pw }).then(d => {
    localStorage.setItem('condovia_token', d.token);
    return d;
  });
export const register = (p) => request('POST', '/api/auth/register', p);
export const getMe = () => request('GET', '/api/auth/me');
export const logout = () => localStorage.removeItem('condovia_token');

export const getServizi = () => request('GET', '/api/servizi');
export const getServizio = (id) => request('GET', `/api/servizi/${id}`);

export const getCondomini = () => request('GET', '/api/condomini');
export const getCondominio = (id) => request('GET', `/api/condomini/${id}`);
export const creaCondominio = (p) => request('POST', '/api/condomini', p);

export const getWallet = () => request('GET', '/api/wallet');
export const richiediPagamento = (importo) => request('POST', '/api/wallet/richiedi', { importo });
export const getWalletRichieste = () => request('GET', '/api/wallet/richieste');
export const getWalletRicevutaUrl = (id) => `${BASE}/api/wallet/ricevuta/${id}?token=${getToken()}`;

export const creaRichiesta = (p) => request('POST', '/api/richieste', p);

export const boGetDashboard = () => request('GET', '/api/backoffice/dashboard');
export const boGetServizi = () => request('GET', '/api/backoffice/servizi');
export const boGetCondominiAdmin = (adminId) => request('GET', `/api/backoffice/condomini/${adminId}`);
export const boCreaCondo = (adminId, p) => request('POST', `/api/backoffice/condomini/${adminId}`, p);
export const boGetAmministratori = () => request('GET', '/api/backoffice/admin');
export const boGetAmministratore = (id) => request('GET', `/api/backoffice/admin/${id}`);
export const boGetDocumentiAdmin = (id) => request('GET', `/api/backoffice/admin/${id}/documenti`);
export const boUploadDocumento = (adminId, fd) => upload('POST', `/api/backoffice/admin/${adminId}/documenti`, fd);
export const boGetDocumentoFileUrl = (adminId, tipo) => `${BASE}/api/backoffice/admin/${adminId}/documento/${tipo}/file?token=${getToken()}`;
export const boGetAdminWallet = (id) => request('GET', `/api/backoffice/admin/${id}/wallet`);
export const boAzzeraWallet = (id) => request('POST', `/api/backoffice/admin/${id}/wallet/azzera`, {});
export const boPagaWallet = (adminId, fd) => upload('POST', `/api/backoffice/admin/${adminId}/wallet/paga`, fd);
export const boGetRichiesteWallet = () => request('GET', '/api/backoffice/richieste-wallet');
export const boGetRicevutaWalletUrl = (id) => `${BASE}/api/backoffice/richieste-wallet/${id}/ricevuta?token=${getToken()}`;
export const boGetContratti = (adminId) => request('GET', `/api/backoffice/contratti${adminId ? `?adminId=${adminId}` : ''}`);
export const boPostContratto = (fd) => upload('POST', '/api/backoffice/contratti', fd);
export const boGetContrattoFileUrl = (id) => `${BASE}/api/backoffice/contratti/${id}/pdf?token=${getToken()}`;
export const boGetRichieste = (stato, adminId) => {
  const params = [];
  if (stato) params.push(`stato=${stato}`);
  if (adminId) params.push(`adminId=${adminId}`);
  return request('GET', `/api/backoffice/richieste${params.length ? '?' + params.join('&') : ''}`);
};
export const boPatchRichiesta = (id, p) => request('PATCH', `/api/backoffice/richieste/${id}`, p);
export const boGetMargini = () => request('GET', '/api/backoffice/margini');
export const boGetIscrizioni = (stato) => request('GET', `/api/backoffice/iscrizioni?stato=${stato}`);
export const boApprovaIscrizione = (id) => request('PATCH', `/api/backoffice/iscrizioni/${id}/approva`, {});
export const boRifiutaIscrizione = (id) => request('PATCH', `/api/backoffice/iscrizioni/${id}/rifiuta`, {});
export const boResetPassword = (id) => request('POST', `/api/backoffice/admin/${id}/reset-password`, {});
export const forgotPassword = (email) => request('POST', '/api/auth/forgot-password', { email });
export const changePassword = (currentPassword, newPassword) => request('POST', '/api/auth/change-password', { currentPassword, newPassword });
export const boGetFatturazione = (stato) => request('GET', `/api/backoffice/fatturazione${stato ? `?stato=${stato}` : ''}`);
export const boPatchFattura = (id, p) => request('PATCH', `/api/backoffice/fatturazione/${id}`, p);
