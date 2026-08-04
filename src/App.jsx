import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAdmin, RequireCommerciale } from './components/Guards';
import { LoadingScreen } from './components/Shared';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Scadenze = lazy(() => import('./pages/Scadenze'));
const ServizioDetail = lazy(() => import('./pages/ServizioDetail'));
const Profilo = lazy(() => import('./pages/Profilo'));
const Condomini = lazy(() => import('./pages/Condomini'));
const CondominioDetail = lazy(() => import('./pages/CondominioDetail'));
const BackofficeLogin = lazy(() => import('./pages/backoffice/BackofficeLogin'));
const Dashboard = lazy(() => import('./pages/backoffice/Dashboard'));
const Amministratori = lazy(() => import('./pages/backoffice/Amministratori'));
const Contratti = lazy(() => import('./pages/backoffice/Contratti'));
const Margini = lazy(() => import('./pages/backoffice/Margini'));
const Richieste = lazy(() => import('./pages/backoffice/Richieste'));
const Fatturazione = lazy(() => import('./pages/backoffice/Fatturazione'));
const Iscrizioni = lazy(() => import('./pages/backoffice/Iscrizioni'));
const BackofficeProfilo = lazy(() => import('./pages/backoffice/BackofficeProfilo'));
import BackofficeLayout from './pages/backoffice/BackofficeLayout';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrati" element={<Register />} />
            <Route path="/backoffice/login" element={<BackofficeLogin />} />
            <Route path="/home" element={<RequireAdmin><Home /></RequireAdmin>} />
            <Route path="/wallet" element={<RequireAdmin><Wallet /></RequireAdmin>} />
            <Route path="/scadenze" element={<RequireAdmin><Scadenze /></RequireAdmin>} />
            <Route path="/profilo" element={<RequireAdmin><Profilo /></RequireAdmin>} />
            <Route path="/condomini" element={<RequireAdmin><Condomini /></RequireAdmin>} />
            <Route path="/condomini/:id" element={<RequireAdmin><CondominioDetail /></RequireAdmin>} />
            <Route path="/servizio/:id" element={<RequireAdmin><ServizioDetail /></RequireAdmin>} />
            <Route path="/backoffice" element={<RequireCommerciale><BackofficeLayout><Dashboard /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/amministratori" element={<RequireCommerciale><BackofficeLayout><Amministratori /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/contratti" element={<RequireCommerciale><BackofficeLayout><Contratti /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/margini" element={<RequireCommerciale><BackofficeLayout><Margini /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/richieste" element={<RequireCommerciale><BackofficeLayout><Richieste /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/fatturazione" element={<RequireCommerciale><BackofficeLayout><Fatturazione /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/iscrizioni" element={<RequireCommerciale><BackofficeLayout><Iscrizioni /></BackofficeLayout></RequireCommerciale>} />
            <Route path="/backoffice/profilo" element={<RequireCommerciale><BackofficeLayout><BackofficeProfilo /></BackofficeLayout></RequireCommerciale>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  );
}
