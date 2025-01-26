import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/map');
  };

  return (
    <div className="App">
      <div className="background-overlay"></div>
      <Container className="home-container">
        <Row className="d-flex align-items-center justify-content-between">
          <Col md={12} className="content-section">
            <div className="title">
              <h1>Everyone deserves access to basic esources.</h1>
              <h2>Get the Help that you Deserve: Explore Below!</h2>
              <p>
                With climate disasters worsening and inadequate resources in times of
                crisis, many victims of wildfires and natural disasters are rendered in tough spots.
              </p>
              <Button variant="primary" className="get-started-btn" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
