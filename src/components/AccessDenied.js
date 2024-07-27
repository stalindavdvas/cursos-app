import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const AccessDenied = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Alert variant="danger">
            <h4>Acceso Denegado</h4>
            <p>No tienes permiso para acceder a esta página.</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDenied;
