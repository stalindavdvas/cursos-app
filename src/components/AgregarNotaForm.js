import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../var';

const AgregarNotaForm = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [nota, setNota] = useState('');
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedCurso, setSelectedCurso] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEstudiantes();
    fetchCursos();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(API_URL+'usuarios');
      setEstudiantes(response.data.filter(u => u.rol === 'E'));
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await axios.get(API_URL+'cursos');
      setCursos(response.data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL+'notas', {
        nota: parseFloat(nota),
        idusuario: parseInt(selectedEstudiante),
        idcurso: parseInt(selectedCurso)
      });
      setMessage('Nota agregada exitosamente');
      setNota('');
      setSelectedEstudiante('');
      setSelectedCurso('');
    } catch (error) {
      console.error('Error adding nota:', error);
      setMessage('Error al agregar la nota');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Estudiante</Form.Label>
        <Form.Control 
          as="select" 
          value={selectedEstudiante} 
          onChange={(e) => setSelectedEstudiante(e.target.value)}
          required
        >
          <option value="">Seleccione un estudiante</option>
          {estudiantes.map(estudiante => (
            <option key={estudiante.id} value={estudiante.id}>
              {estudiante.nombre} {estudiante.apellido}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Curso</Form.Label>
        <Form.Control 
          as="select" 
          value={selectedCurso} 
          onChange={(e) => setSelectedCurso(e.target.value)}
          required
        >
          <option value="">Seleccione un curso</option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>{curso.nombre}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Nota</Form.Label>
        <Form.Control 
          type="number" 
          step="0.01" 
          min="0" 
          max="20" 
          value={nota} 
          onChange={(e) => setNota(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit">Agregar Nota</Button>
      {message && <Alert variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}
    </Form>
  );
};

export default AgregarNotaForm;