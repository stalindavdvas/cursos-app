import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../var';

const EstudiantesTable = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(API_URL + 'usuarios');
      setEstudiantes(response.data.filter(u => u.rol === 'E'));
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  const handleEdit = (estudiante) => {
    setCurrentEstudiante(estudiante);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL + `usuarios/${id}`);
      fetchEstudiantes();
    } catch (error) {
      console.error('Error deleting estudiante:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de DNI y celular
    const errors = {};
    const numero = /^[0-9]*$/;
    if (currentEstudiante.dni.length !== 10 || !currentEstudiante.dni.match(numero)) {
      errors.dni = 'El DNI debe tener 10 números';
    }
    if (currentEstudiante.celular.length !== 10 || !currentEstudiante.celular.match(numero)) {
      errors.celular = 'El celular debe tener 10 números.';
    }

    // Validación de nombre y apellido
    const lettersRegex = /^[A-Za-z]+$/;
    if (!currentEstudiante.nombre.match(lettersRegex)) {
      errors.nombre = 'El nombre solo debe contener letras.';
    }
    if (!currentEstudiante.apellido.match(lettersRegex)) {
      errors.apellido = 'El apellido solo debe contener letras.';
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!currentEstudiante.correo.match(emailRegex)) {
      errors.correo = 'El correo electrónico no es válido.';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      // Limpiar mensajes de error después de 3 segundos
      setTimeout(() => {
        setErrorMessages({});
      }, 3000);
      return;
    }

    try {
      if (currentEstudiante.id) {
        await axios.put(API_URL + `usuarios/${currentEstudiante.id}`, currentEstudiante);
      } else {
        await axios.post(API_URL + 'usuarios', { ...currentEstudiante, rol: 'E' });
      }
      setShowModal(false);
      fetchEstudiantes();
    } catch (error) {
      console.error('Error submitting estudiante:', error);
    }
  };

  return (
    <>
      <Button onClick={() => { setCurrentEstudiante({}); setShowModal(true); }}>Agregar Estudiante</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Correo</th>
            <th>Celular</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td>{estudiante.id}</td>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.apellido}</td>
              <td>{estudiante.dni}</td>
              <td>{estudiante.correo}</td>
              <td>{estudiante.celular}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(estudiante)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(estudiante.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEstudiante.id ? 'Editar' : 'Agregar'} Estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentEstudiante.nombre || ''}
                onChange={(e) => setCurrentEstudiante({ ...currentEstudiante, nombre: e.target.value })}
                required
              />
              {errorMessages.nombre && <Alert variant="danger">{errorMessages.nombre}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={currentEstudiante.apellido || ''}
                onChange={(e) => setCurrentEstudiante({ ...currentEstudiante, apellido: e.target.value })}
                required
              />
              {errorMessages.apellido && <Alert variant="danger">{errorMessages.apellido}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                name='dniEstudiante'
                value={currentEstudiante.dni || ''}
                onChange={(e) => setCurrentEstudiante({ ...currentEstudiante, dni: e.target.value })}
                required
              />
              {errorMessages.dni && <Alert variant="danger">{errorMessages.dni}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                value={currentEstudiante.correo || ''}
                onChange={(e) => setCurrentEstudiante({ ...currentEstudiante, correo: e.target.value })}
                required
              />
              {errorMessages.correo && <Alert variant="danger">{errorMessages.correo}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={currentEstudiante.passwd || ''}
                onChange={(e) => setCurrentEstudiante({ ...currentEstudiante, passwd: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                value={currentEstudiante.celular || ''}
                onChange={(e) => setCurrentEstudiante({ ...currentEstudiante, celular: e.target.value })}
                required
              />
              {errorMessages.celular && <Alert variant="danger">{errorMessages.celular}</Alert>}
            </Form.Group>
            <Button type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EstudiantesTable;
