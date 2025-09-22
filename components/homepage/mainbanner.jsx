import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './mainbanner.css'; // Ensure this CSS file exists

const Mainbanner = () => {
  return (
    <div className="main-banner bg-primary text-white py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h1>Welcome to Trinetra</h1>
            <p>Your gateway to innovation and collaboration. Explore projects, participate in hackathons, and join our community.</p>
            <Button variant="light">Learn More</Button>
          </Col>
          <Col md={6}>
            {/* Replace with an actual image or illustration */}
            <img
              src="https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Trinetra Illustration"
              className="img-fluid rounded"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Mainbanner;
