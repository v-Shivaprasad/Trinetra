import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import './CarouselCard.css'; // Ensure this CSS file exists

const CarouselCard = () => {
  const carouselItems = [
    {
      id: 1,
      title: 'Project Showcase',
      description: 'Explore innovative projects created by our community members.',
      imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: 2,
      title: 'Hackathon Highlights',
      description: 'Relive the excitement and creativity from our past hackathons.',
      imageUrl: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: 3,
      title: 'Community Events',
      description: 'Stay updated on upcoming workshops, meetups, and online events.',
      imageUrl: 'https://images.pexels.com/photos/716375/pexels-photo-716375.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
  ];

  return (
    <div className="carousel-card py-5">
      <Container>
        <Carousel>
          {carouselItems.map((item) => (
            <Carousel.Item key={item.id}>
              <img className="d-block w-100" src={item.imageUrl} alt={item.title} />
              <Carousel.Caption>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default CarouselCard;
