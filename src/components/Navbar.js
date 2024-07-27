import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from 'react-bootstrap/Container';
import study from '../study.png';

const NavbarComponent = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <Navbar bg="dark" expand="lg" fixed="top" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={study}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Cursos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user && (
              <NavDropdown title={user.correo} id="collapsible-nav-dropdown">
                <NavDropdown.Item as="button" onClick={handleLogout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
