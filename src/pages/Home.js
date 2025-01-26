import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import heroImage from '../assets/home-img.jpg';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/search');
  };

  return (
    <div className="App">
      <Container className="home-container">
        <Row className="d-flex align-items-center justify-content-between">
          {/* Text on the left */}
          <Col md={6} className="content-section">
            <div className="title">
              <h1>Everyone deserves access to basic resources</h1>
              <h2>Get the help that you deserve: explore below!</h2>
              <p>
                With climate disasters worsening and inadequate resources in times of
                crisis, many victims of wildfires are rendered in tough spots.
              </p>
              <Button variant="primary" className="get-started-btn" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </Col>

          {/* Image on the right */}
          <Col md={6} className="image-section">
            <img src={heroImage} alt="Wildfire" className="hero-image" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;