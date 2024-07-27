import React, { useState, useEffect, useContext } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_URL } from '../var';

const NotasTable = () => {
  const [notas, setNotas] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        let response;
        if (user.role === 'E') {
          response = await axios.get(API_URL+`notas?idusuario=${user.id}`);
        } else {
          response = await axios.get(API_URL+'notas');
        }
        setNotas(response.data);
      } catch (error) {
        console.error('Error fetching notas:', error);
      }
    };
    fetchNotas();
  }, [user]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nota</th>
          <th>ID Usuario</th>
          <th>ID Curso</th>
        </tr>
      </thead>
      <tbody>
        {notas.map((nota) => (
          <tr key={nota.id}>
            <td>{nota.id}</td>
            <td>{nota.nota}</td>
            <td>{nota.idusuario}</td>
            <td>{nota.idcurso}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default NotasTable;