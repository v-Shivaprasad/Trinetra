import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './aboutus.css'; // Ensure this CSS file exists

const AboutUs = () => {
  return (
    <div className="about-us py-5">
      <Container>
        <Row>
          <Col md={6}>
            <h2>About Us</h2>
            <p>
              Trinetra is a platform dedicated to fostering innovation and collaboration among developers, designers, and tech enthusiasts.
              We provide resources, tools, and a supportive community to help you bring your ideas to life.
            </p>
          </Col>
          <Col md={6}>
            <p>
              Our mission is to empower individuals to create impactful projects, participate in exciting hackathons, and connect with like-minded
              people. Whether you're a seasoned professional or just starting out, Trinetra is the perfect place to grow and contribute.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
