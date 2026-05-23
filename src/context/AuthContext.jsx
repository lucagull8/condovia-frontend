import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe, logout as apiLogout } from '../api';
const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMe().then(u => setUtente(u)).catch(() => setUtente(null)).finally(() => setLoading(false)); }, []);
  const login = async (email, pw) => { const d = await apiLogin(email, pw); setUtente({ ...d.utente, ruolo: d.ruolo }); return d; };
  const logout = () => { apiLogout(); setUtente(null); };
  return <AuthCtx.Provider value={{ utente, loading, login, logout }}>{children}</AuthCtx.Provider>;
}
export function useAuth() { return useContext(AuthCtx); }
