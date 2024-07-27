import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { UserContext } from './UserContext';
import "../customStyle.css";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <Container >
      <Row>
        <Col md={3}>
          <Sidebar userRole={user.role} />
        </Col>
        <Col md={9}>
          <Navbar />
          <main style={{top:"7%"}}>
            <Outlet />
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;