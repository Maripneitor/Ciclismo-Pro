// frontend/src/components/StoreHeroCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Importa los estilos de Swiper y los estilos locales
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './StoreHeroCarousel.css';

// Importa imágenes de los assets (usaremos las existentes como placeholders)
import img1 from '../assets/Imagenes/ruta-carretera-peloton-01.png';
import img2 from '../assets/Imagenes/montana-bosque-descenso-01.png';
import img3 from '../assets/Imagenes/urbano-ciudad-noche-01.jpg';

const slides = [
  { 
    img: img3, 
    title: 'Ciclismo Urbano', 
    description: 'Disfruta hasta 40% OFF en productos seleccionados.', 
    link: '/store/urbano',
    badge: 'USXVENIUS'
  },
  { 
    img: img1, 
    title: 'Nuevos Equipamientos', 
    description: 'Descubre lo último en tecnología de ciclismo.', 
    link: '/store/equipamiento',
    badge: 'SportNexus'
  },
  { 
    img: img2, 
    title: 'Aventura de Montaña', 
    description: 'Todo lo que necesitas para tu próxima ruta MTB.', 
    link: '/store/montana',
    badge: 'SportNexus'
  },
];

function StoreHeroCarousel() {
  return (
    <div className="store-hero-carousel">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        navigation={true}
        speed={800}
        className="store-hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="store-hero-slide"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                {slide.badge && (
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {slide.badge}
                  </div>
                )}
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
                <Link to={slide.link} className="btn btn-primary">
                  Ver productos
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default StoreHeroCarousel;