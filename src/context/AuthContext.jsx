import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe, logout as apiLogout } from '../api';
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('condovia_token');
    if (!token) { setLoading(false); return; }

    // Retry fino a 3 volte con 3s di attesa (copre il risveglio di Render free)
    const tryGetMe = async (retries = 3) => {
      try {
        const u = await getMe();
        setUtente(u);
        setLoading(false);
      } catch (err) {
        const isAuthError = err.message.includes('401') || err.message.includes('403');
        if (!isAuthError && retries > 0) {
          // Errore di rete (backend in sleep) → riprova dopo 3s
          await new Promise(r => setTimeout(r, 3000));
          return tryGetMe(retries - 1);
        }
        if (isAuthError) apiLogout(); // token scaduto → pulisci
        setUtente(null);
        setLoading(false);
      }
    };

    tryGetMe();
  }, []);

  const login = async (email, pw) => {
    const d = await apiLogin(email, pw);
    setUtente({ ...d.utente, ruolo: d.ruolo });
    return d;
  };
  const logout = () => { apiLogout(); setUtente(null); };

  return <AuthCtx.Provider value={{ utente, loading, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
