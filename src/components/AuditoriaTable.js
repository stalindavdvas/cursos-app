import React, { useState, useEffect } from 'react';
import { Table, Container, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../var';

const AuditoriaTable = () => {
  const [registros, setRegistros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchAuditoriaCombinada();
  }, []);

  const fetchAuditoriaCombinada = async () => {
    try {
      const response = await axios.get(API_URL + `auditoria-combinada`);
      setRegistros(response.data.registros_combinados);
    } catch (error) {
      console.error('Error fetching combined auditoria:', error);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = registros.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(registros.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container>
      <h1>Tabla de Logs de Auditoria de login Usuarios</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>DNI</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Método de Autenticación</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((registro, index) => (
            <tr key={index}>
              <td>{registro.usuario}</td>
              <td>{registro.dni}</td>
              <td>{registro.fecha}</td>
              <td>{registro.estado}</td>
              <td>{registro.metodoAutenticacion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => paginate(1)} />
        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
        {pageNumbers.map((number) => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(registros.length / recordsPerPage)} />
        <Pagination.Last onClick={() => paginate(Math.ceil(registros.length / recordsPerPage))} />
      </Pagination>
    </Container>
  );
};

export default AuditoriaTable;
