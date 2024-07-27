import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../var';

const ProfesoresTable = () => {
  const [profesores, setProfesores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProfesor, setCurrentProfesor] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    fetchProfesores();
  }, []);

  const fetchProfesores = async () => {
    try {
      const response = await axios.get(API_URL+'usuarios');
      setProfesores(response.data.filter(u => u.rol === 'P'));
    } catch (error) {
      console.error('Error fetching profesores:', error);
    }
  };

  const handleEdit = (profesor) => {
    setCurrentProfesor(profesor);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL+`usuarios/${id}`);
      fetchProfesores();
    } catch (error) {
      console.error('Error deleting profesor:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de DNI y celular
    const errors = {};
    const numero = /^[0-9]*$/;
    if (currentProfesor.dni.length !== 10 || !currentProfesor.dni.match(numero)) {
      errors.dni = 'El DNI debe tener 10 números';
    }
    if (currentProfesor.celular.length !== 10 || !currentProfesor.celular.match(numero)) {
      errors.celular = 'El celular debe tener 10 números.';
    }

    // Validación de nombre y apellido
    const lettersRegex = /^[A-Za-z]+$/;
    if (!currentProfesor.nombre.match(lettersRegex)) {
      errors.nombre = 'El nombre solo debe contener letras.';
    }
    if (!currentProfesor.apellido.match(lettersRegex)) {
      errors.apellido = 'El apellido solo debe contener letras.';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      // Limpiar mensajes de error después de 5 segundos
      setTimeout(() => {
        setErrorMessages({});
      }, 3000); // 3000 milisegundos = 3 segundos
      return;
    }

    try {
      if (currentProfesor.id) {
        await axios.put(API_URL+`usuarios/${currentProfesor.id}`, currentProfesor);
      } else {
        await axios.post(API_URL+'usuarios', { ...currentProfesor, rol: 'P' });
      }
      setShowModal(false);
      fetchProfesores();
    } catch (error) {
      console.error('Error submitting profesor:', error);
    }
  };

  return (
    <>
      <Button onClick={() => { setCurrentProfesor({}); setShowModal(true); }}>Agregar Profesor</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dni</th>
            <th>Correo</th>
            <th>Celular</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.id}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.apellido}</td>
              <td>{profesor.dni}</td>
              <td>{profesor.correo}</td>
              <td>{profesor.celular}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(profesor)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(profesor.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProfesor.id ? 'Editar' : 'Agregar'} Profesor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                value={currentProfesor.nombre || ''} 
                onChange={(e) => setCurrentProfesor({...currentProfesor, nombre: e.target.value})}
                required
              />
              {errorMessages.nombre && <Alert variant="danger">{errorMessages.nombre}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control 
                type="text" 
                value={currentProfesor.apellido || ''} 
                onChange={(e) => setCurrentProfesor({...currentProfesor, apellido: e.target.value})}
                required
              />
              {errorMessages.apellido && <Alert variant="danger">{errorMessages.apellido}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>DNI</Form.Label>
              <Form.Control 
                type="text" 
                value={currentProfesor.dni || ''} 
                onChange={(e) => setCurrentProfesor({...currentProfesor, dni: e.target.value})}
                required
              />
              {errorMessages.dni && <Alert variant="danger">{errorMessages.dni}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control 
                type="email" 
                value={currentProfesor.correo || ''} 
                onChange={(e) => setCurrentProfesor({...currentProfesor, correo: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={currentProfesor.passwd || ''} 
                onChange={(e) => setCurrentProfesor({...currentProfesor, passwd: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Celular</Form.Label>
              <Form.Control 
                type="text" 
                value={currentProfesor.celular || ''} 
                onChange={(e) => setCurrentProfesor({...currentProfesor, celular: e.target.value})}
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

export default ProfesoresTable;
