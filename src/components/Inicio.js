import React, { useContext, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import YouTube from 'react-youtube';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const videoOptions = {
    height: '300',
    width: '400'
  };
  const videoId = 'Mb37ily9WuY';
  const videoId1 = 'nKPbfIU442g';
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige si el usuario no está autenticado o no tiene un rol válido
    if (!user || (user.role !== 'E' && user.role !== 'P' && user.role !== 'A')) {
      navigate('/');  // Redirige a la página de inicio de sesión o cualquier otra página
    }
  }, [user, navigate]);

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Cantidad de Usuarios</Card.Title>
              <Card.Text>
                50
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Cantidad de Cursos</Card.Title>
              <Card.Text>
                100
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className='col-6'>
          <YouTube videoId={videoId} opts={videoOptions} />
        </Col>
        <Col className='col-6'>
          <YouTube videoId={videoId1} opts={videoOptions} />
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
