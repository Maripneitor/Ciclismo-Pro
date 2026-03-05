import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/src/assets/Imagenes/ciclismo-group-principal-01.jpg',
    '/src/assets/Imagenes/ciclismo-group-principal-02.jpg',
    '/src/assets/Imagenes/ciclismo-group-principal-05.jpg',
    '/src/assets/Imagenes/ciclismo-group-principal-04.jpg',
    '/src/assets/Imagenes/ciclismo-group-principal-05.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="hero-carousel">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Cycling event ${index + 1}`}
          className={index === currentImageIndex ? 'active' : ''}
        />
      ))}
      
      <div className="overlay"></div>
      
      <div className="hero-text container">
        <h1 className="hero-title animate-fadeIn">
          Eleva tu pasión <br /> por el <span className="text-primary">pedal</span>
        </h1>
        <p className="hero-description animate-fadeIn">
          Únete a la comunidad de ciclismo más grande y encuentra tu próximo desafío épico.
        </p>
        <div className="hero-actions animate-fadeIn">
          <button className="btn btn-primary">
            Explorar Eventos
          </button>
          <button className="btn btn-outline text-white">
            Unirse a la Comunidad
          </button>
        </div>
      </div>

      <button className="carousel-btn prev" onClick={prevImage}>
        ‹
      </button>
      <button className="carousel-btn next" onClick={nextImage}>
        ›
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
