import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../var';

const AdministradoresTable = () => {
  const [administradores, setAdministradores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAdministrador, setCurrentAdministrador] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    fetchAdministradores();
  }, []);

  const fetchAdministradores = async () => {
    try {
      const response = await axios.get(API_URL+'usuarios?rol=A');
      setAdministradores(response.data.filter(u => u.rol === 'A'));
    } catch (error) {
      console.error('Error fetching administradores:', error);
    }
  };

  const handleEdit = (administrador) => {
    setCurrentAdministrador(administrador);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL+`usuarios/${id}`);
      fetchAdministradores();
    } catch (error) {
      console.error('Error deleting administrador:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de DNI y celular
    const errors = {};
    const numero = /^[0-9]*$/;
    if (currentAdministrador.dni.length !== 10 || !currentAdministrador.dni.match(numero)) {
      errors.dni = 'El DNI debe tener 10 números';
    }
    if (currentAdministrador.celular.length !== 10 || !currentAdministrador.celular.match(numero)) {
      errors.celular = 'El celular debe tener 10 números.';
    }

    // Validación de nombre y apellido
    const lettersRegex = /^[A-Za-z]+$/;
    if (!currentAdministrador.nombre.match(lettersRegex)) {
      errors.nombre = 'El nombre solo debe contener letras.';
    }
    if (!currentAdministrador.apellido.match(lettersRegex)) {
      errors.apellido = 'El apellido solo debe contener letras.';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      // Limpiar mensajes de error después de 5 segundos
      setTimeout(() => {
        setErrorMessages({});
      }, 5000); // 5000 milisegundos = 5 segundos
      return;
    }

    try {
      if (currentAdministrador.id) {
        await axios.put(API_URL+`usuarios/${currentAdministrador.id}`, currentAdministrador);
      } else {
        await axios.post(API_URL+'usuarios', { ...currentAdministrador, rol: 'A' });
      }
      setShowModal(false);
      fetchAdministradores();
    } catch (error) {
      console.error('Error submitting administrador:', error);
    }
  };

  return (
    <>
      <Button onClick={() => { setCurrentAdministrador({}); setShowModal(true); }}>Agregar Administrador</Button>
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
          {administradores.map((administrador) => (
            <tr key={administrador.id}>
              <td>{administrador.id}</td>
              <td>{administrador.nombre}</td>
              <td>{administrador.apellido}</td>
              <td>{administrador.dni}</td>
              <td>{administrador.correo}</td>
              <td>{administrador.celular}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(administrador)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(administrador.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAdministrador.id ? 'Editar' : 'Agregar'} Administrador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                value={currentAdministrador.nombre || ''} 
                onChange={(e) => setCurrentAdministrador({...currentAdministrador, nombre: e.target.value})}
                required
              />
              {errorMessages.nombre && <Alert variant="danger">{errorMessages.nombre}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control 
                type="text" 
                value={currentAdministrador.apellido || ''} 
                onChange={(e) => setCurrentAdministrador({...currentAdministrador, apellido: e.target.value})}
                required
              />
              {errorMessages.apellido && <Alert variant="danger">{errorMessages.apellido}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>DNI</Form.Label>
              <Form.Control 
                type="text" 
                value={currentAdministrador.dni || ''} 
                onChange={(e) => setCurrentAdministrador({...currentAdministrador, dni: e.target.value})}
                required
              />
              {errorMessages.dni && <Alert variant="danger">{errorMessages.dni}</Alert>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo</Form.Label>
              <Form.Control 
                type="email" 
                value={currentAdministrador.correo || ''} 
                onChange={(e) => setCurrentAdministrador({...currentAdministrador, correo: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={currentAdministrador.passwd || ''} 
                onChange={(e) => setCurrentAdministrador({...currentAdministrador, passwd: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Celular</Form.Label>
              <Form.Control 
                type="text" 
                value={currentAdministrador.celular || ''} 
                onChange={(e) => setCurrentAdministrador({...currentAdministrador, celular: e.target.value})}
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

export default AdministradoresTable;
