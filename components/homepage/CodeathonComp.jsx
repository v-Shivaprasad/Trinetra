import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import './CodeathonComp.css'; // Ensure this CSS file exists

const CodeathonComp = () => {
  const codeathons = [
    {
      id: 1,
      title: 'AI Innovation Challenge',
      description: 'Develop AI solutions for real-world problems and win exciting prizes.',
      imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      startDate: '2024-07-15',
      endDate: '2024-07-20',
    },
    {
      id: 2,
      title: 'Web Development Hackathon',
      description: 'Build innovative web applications and showcase your coding skills.',
      imageUrl: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      startDate: '2024-08-01',
      endDate: '2024-08-05',
    },
    {
      id: 3,
      title: 'Mobile App Challenge',
      description: 'Create cutting-edge mobile apps and compete for recognition.',
      imageUrl: 'https://images.pexels.com/photos/574107/pexels-photo-574107.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      startDate: '2024-08-15',
      endDate: '2024-08-20',
    },
  ];

  return (
    <div className="codeathon-comp py-5">
      <Container>
        <h2>Upcoming Codeathons</h2>
        <Row>
          {codeathons.map((codeathon) => (
            <Col md={4} key={codeathon.id}>
              <Card>
                <Card.Img variant="top" src={codeathon.imageUrl} alt={codeathon.title} />
                <Card.Body>
                  <Card.Title>{codeathon.title}</Card.Title>
                  <Card.Text>{codeathon.description}</Card.Text>
                  <Card.Text>
                    <strong>Start Date:</strong> {codeathon.startDate}
                    <br />
                    <strong>End Date:</strong> {codeathon.endDate}
                  </Card.Text>
                  <Button variant="primary">Register Now</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default CodeathonComp;
