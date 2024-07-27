// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import '../customStyle.css'; // Importa el archivo CSS

const Sidebar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="sidebar">
    <Nav className="flex-column">
      {user.role === 'E' && (
        <>
        <Nav.Link as={Link} to="/dashboard/inicio">Inicio</Nav.Link>
        <Nav.Link as={Link} to="/dashboard/notas">Mis Notas</Nav.Link></>
      )}
      {user.role === 'P' && (
        <>
        <Nav.Link as={Link} to="/dashboard/inicio">Inicio</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/estudiantes">Estudiantes</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/agregar-nota">Agregar Nota</Nav.Link>
        </>
      )}
      {user.role === 'A' && (
        <>
        <Nav.Link as={Link} to="/dashboard/inicio">Inicio</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/estudiantes">Estudiantes</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/profesores">Profesores</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/administradores">Administradores</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/cursos">Cursos</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/notas">Notas</Nav.Link>
          <Nav.Link as={Link} to="/dashboard/auditoria">Auditoría</Nav.Link>
        </>
      )}
    </Nav>
    </div>
  );
};

export default Sidebar;