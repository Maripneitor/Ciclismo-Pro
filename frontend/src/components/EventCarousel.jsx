// frontend/src/components/EventCarousel.jsx
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import CountdownTimer from './CountdownTimer';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './EventCarousel.css';

function EventCarousel({ events }) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="event-carousel">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="event-swiper"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id_evento}>
            <Link to={`/eventos/${event.id_evento}`} className="carousel-slide">
              <div 
                className="slide-background"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                <div className="slide-content">
                  <h2 className="event-title">{event.nombre}</h2>
                  <CountdownTimer targetDate={event.fecha_inicio} />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default EventCarousel;