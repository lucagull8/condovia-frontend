import{HashRouter,Routes,Route,Navigate}from'react-router-dom';import{AuthProvider}from'./context/AuthContext';import{RequireAdmin,RequireCommerciale}from'./components/Guards';
import Landing from'./pages/Landing';import Login from'./pages/Login';import Register from'./pages/Register';
import Home from'./pages/Home';import Wallet from'./pages/Wallet';import Scadenze from'./pages/Scadenze';import ServizioDetail from'./pages/ServizioDetail';import Profilo from'./pages/Profilo';import Condomini from'./pages/Condomini';import CondominioDetail from'./pages/CondominioDetail';
import BackofficeLogin from'./pages/backoffice/BackofficeLogin';import BackofficeLayout from'./pages/backoffice/BackofficeLayout';import Dashboard from'./pages/backoffice/Dashboard';import Amministratori from'./pages/backoffice/Amministratori';import Contratti from'./pages/backoffice/Contratti';import Margini from'./pages/backoffice/Margini';import Richieste from'./pages/backoffice/Richieste';import Fatturazione from'./pages/backoffice/Fatturazione';import Iscrizioni from'./pages/backoffice/Iscrizioni';
export default function App(){return<AuthProvider><HashRouter><Routes>
<Route path="/" element={<Landing/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/registrati" element={<Register/>}/>
<Route path="/backoffice/login" element={<BackofficeLogin/>}/>
<Route path="/home" element={<RequireAdmin><Home/></RequireAdmin>}/>
<Route path="/wallet" element={<RequireAdmin><Wallet/></RequireAdmin>}/>
<Route path="/scadenze" element={<RequireAdmin><Scadenze/></RequireAdmin>}/>
<Route path="/profilo" element={<RequireAdmin><Profilo/></RequireAdmin>}/>
<Route path="/condomini" element={<RequireAdmin><Condomini/></RequireAdmin>}/>
<Route path="/condomini/:id" element={<RequireAdmin><CondominioDetail/></RequireAdmin>}/>
<Route path="/servizio/:id" element={<RequireAdmin><ServizioDetail/></RequireAdmin>}/>
<Route path="/backoffice" element={<RequireCommerciale><BackofficeLayout><Dashboard/></BackofficeLayout></RequireCommerciale>}/>
<Route path="/backoffice/amministratori" element={<RequireCommerciale><BackofficeLayout><Amministratori/></BackofficeLayout></RequireCommerciale>}/>
<Route path="/backoffice/contratti" element={<RequireCommerciale><BackofficeLayout><Contratti/></BackofficeLayout></RequireCommerciale>}/>
<Route path="/backoffice/margini" element={<RequireCommerciale><BackofficeLayout><Margini/></BackofficeLayout></RequireCommerciale>}/>
<Route path="/backoffice/richieste" element={<RequireCommerciale><BackofficeLayout><Richieste/></BackofficeLayout></RequireCommerciale>}/>
<Route path="/backoffice/fatturazione" element={<RequireCommerciale><BackofficeLayout><Fatturazione/></BackofficeLayout></RequireCommerciale>}/>
<Route path="/backoffice/iscrizioni" element={<RequireCommerciale><BackofficeLayout><Iscrizioni/></BackofficeLayout></RequireCommerciale>}/>
<Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></HashRouter></AuthProvider>;}
