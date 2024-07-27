import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "../login.css";
import { API_URL } from "../var";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [passwd, setPasswd] = useState("");
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const navigate = useNavigate();
  const { user, login, error } = useContext(UserContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get('token');

    if (tokenFromUrl) {
      // Si hay un token en la URL, autenticar con el token SSO
      authenticateWithToken(tokenFromUrl);
    } else if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const authenticateWithToken = async (token) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}login`, { sso_token: token });
      console.log("Respuesta del servidor:", response.data);

      if (response.data.token) {
        login(response.data.token); // Usa el contexto para manejar el login
        navigate("/dashboard"); // Redirigir al dashboard después del login
      } else {
        alert("Token SSO inválido.");
      }
    } catch (err) {
      console.error("Error en el login con SSO:", err);
      alert("Error en el servidor. Por favor, intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { correo, passwd };

    try {
      const response = await axios.post(`${API_URL}login`, payload);
      console.log("Respuesta del servidor:", response.data);

      if (response.data.token) {
        login(response.data.token); // Usa el contexto para manejar el login
        navigate("/dashboard"); // Redirigir al dashboard después del login
      } else {
        alert("Credenciales incorrectas.");
      }
    } catch (err) {
      console.error("Error en el login:", err);
      alert("Error en el servidor. Por favor, intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundImage: `url(${process.env.PUBLIC_URL}/logoCursos.png)`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "20px", borderRadius: "10px" }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={passwd}
                  onChange={(e) => setPasswd(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button type="submit" disabled={loading} className="w-100">
                {loading ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
