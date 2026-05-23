import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from './Shared';
export function RequireAdmin({ children }) {
  const { utente, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!utente || utente.ruolo !== 'amministratore') return <Navigate to="/login" replace />;
  return children;
}
export function RequireCommerciale({ children }) {
  const { utente, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!utente || utente.ruolo !== 'commerciale') return <Navigate to="/backoffice/login" replace />;
  return children;
}
