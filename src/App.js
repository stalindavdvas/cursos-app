import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { UserProvider, UserContext } from './components/UserContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NotasTable from './components/NotasTable';
import EstudiantesTable from './components/EstudiantesTable';
import CursosTable from './components/CursosTable';
import ProfesorTable from './components/ProfesorTable';
import AdministradoresTable from './components/AdministradoresTable';
import Inicio from './components/Inicio';
import AuditoriaTable from './components/AuditoriaTable';
import AgregarNotaForm from './components/AgregarNotaForm';
import AccessDenied from './components/AccessDenied';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL_LOG } from './var';

const ProtectedRoute = ({ element, roles }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/access-denied" />;
  }

  return element;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(API_URL_LOG+'verify', { token })
        .then(response => {
          if (response.status === 200) {
            const { user_id, role } = response.data;
            setUser({ correo: user_id, role });
          } else {
            localStorage.removeItem('token');
            navigate('/');
          }
        })
        .catch(error => {
          console.error("Token verification error:", error);
          localStorage.removeItem('token');
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate, setUser]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />}>
        <Route path="notas" element={<ProtectedRoute element={<NotasTable />} roles={['E','P', 'A']} />} />
        <Route path="estudiantes" element={<ProtectedRoute element={<EstudiantesTable />} roles={['P', 'A']} />} />
        <Route path="profesores" element={<ProtectedRoute element={<ProfesorTable />} roles={['A']} />} />
        <Route path="administradores" element={<ProtectedRoute element={<AdministradoresTable />} roles={['A']} />} />
        <Route path="cursos" element={<ProtectedRoute element={<CursosTable />} roles={['A']} />} />
        <Route path="auditoria" element={<ProtectedRoute element={<AuditoriaTable />} roles={['A']} />} />
        <Route path="inicio" element={<ProtectedRoute element={<Inicio />} />} />
        <Route path="agregar-nota" element={<ProtectedRoute element={<AgregarNotaForm />} roles={['P']} />} />
        <Route index element={<Navigate to="inicio" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
