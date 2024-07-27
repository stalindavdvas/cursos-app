import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../var';

const CursosTable = () => {
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCurso, setCurrentCurso] = useState({});

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await axios.get(API_URL+'cursos');
      setCursos(response.data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }
  };

  const handleEdit = (curso) => {
    setCurrentCurso(curso);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL+`cursos/${id}`);
      fetchCursos();
    } catch (error) {
      console.error('Error deleting curso:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCurso.id) {
        await axios.put(API_URL+`cursos/${currentCurso.id}`, currentCurso);
      } else {
        await axios.post(API_URL+'cursos', currentCurso);
      }
      setShowModal(false);
      fetchCursos();
    } catch (error) {
      console.error('Error submitting curso:', error);
    }
  };

  return (
    <>
      <Button onClick={() => { setCurrentCurso({}); setShowModal(true); }}>Agregar Curso</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.id}</td>
              <td>{curso.nombre}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(curso)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(curso.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentCurso.id ? 'Editar' : 'Agregar'} Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                value={currentCurso.nombre || ''} 
                onChange={(e) => setCurrentCurso({...currentCurso, nombre: e.target.value})}
              />
            </Form.Group>
            <Button type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CursosTable;