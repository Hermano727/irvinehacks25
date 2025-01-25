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
        <Row>
          <Col md={6} className="content-section">
            <div className="title">
              <h1>Get the Help You Deserve</h1>
              <h2>With our website, we will get you the help you need.</h2>
              <p>
                With climate disasters worsening and inadequate resources in times of
                crisis, many victims of wildfires are rendered in tough spots.
              </p>
              <Button variant="primary" className="get-started-btn" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <img src={heroImage} alt="Wildfire" className="hero-image" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;