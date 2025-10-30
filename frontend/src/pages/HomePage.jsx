import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import HeroCarousel from '../components/HeroCarousel';
import apiClient from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import EventCarousel from '../components/EventCarousel';
import './HomePage.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsProductsLoading(true);
        setError('');
        
        // Fetch events
        const [eventsResponse, featuredResponse, productsResponse] = await Promise.all([
          apiClient.get('/eventos'),
          apiClient.get('/eventos/featured'),
          apiClient.get('/products') // CORREGIDO: usar la misma ruta que tu API
        ]);

        setEvents(eventsResponse.data.data || []);
        setFeaturedEvents(featuredResponse.data.data || []);
        
        // CORREGIDO: Estructura específica de tu API
        console.log('Products API response:', productsResponse.data);
        
        if (productsResponse.data.success && productsResponse.data.data) {
          setProducts(productsResponse.data.data.products || []);
        } else {
          setProducts([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Manejo específico de errores
        if (error.response?.status === 404) {
          setError('Recurso no encontrado. Verifica las rutas de la API.');
        } else if (error.response?.status === 500) {
          setError('Error del servidor. Intenta nuevamente más tarde.');
        } else {
          setError('Error al cargar los datos. Verifica tu conexión.');
        }
        
        // En caso de error, usar productos de muestra
        setProducts(getFallbackProducts());
      } finally {
        setIsLoading(false);
        setIsProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Precio no disponible';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatProductPrice = (price) => {
    if (!price && price !== 0) return 'Consultar precio';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getEventTypeIcon = (tipo) => {
    switch (tipo) {
      case 'carrera': return '🏃‍♂️';
      case 'ciclismo': return '🚴‍♂️';
      case 'triatlon': return '🏊‍♂️';
      case 'senderismo': return '🥾';
      case 'aventura': return '🧗‍♂️';
      default: return '🎯';
    }
  };

  const getDifficultyBadge = (dificultad) => {
    const difficultyColors = {
      principiante: '#10b981',
      intermedio: '#f59e0b',
      avanzado: '#ef4444',
      experto: '#7c3aed'
    };

    return (
      <span 
        className="difficulty-badge"
        style={{ backgroundColor: difficultyColors[dificultad] || '#6b7280' }}
      >
        {dificultad || 'No especificada'}
      </span>
    );
  };

  const getProductCategoryIcon = (categoria) => {
    const icons = {
      'ropa': '👕',
      'accesorios': '🕶️',
      'equipamiento': '🚴',
      'nutricion': '💊',
      'electronica': '⌚',
      'otros': '🛍️'
    };
    return icons[categoria] || '🛍️';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'ropa': 'Ropa',
      'accesorios': 'Accesorios',
      'equipamiento': 'Equipamiento',
      'nutricion': 'Nutrición',
      'electronica': 'Electrónica',
      'otros': 'Otros'
    };
    return labels[category] || category;
  };

  const renderSkeletonCards = (count = 3, featured = false) => {
    return Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} featured={featured} />
    ));
  };

  const renderProductSkeletons = (count = 4) => {
    return Array.from({ length: count }, (_, index) => (
      <SwiperSlide key={index}>
        <div className="home-product-card skeleton">
          <div className="home-product-image skeleton-image"></div>
          <div className="home-product-content">
            <div className="home-product-name skeleton-text"></div>
            <div className="home-product-category skeleton-text"></div>
            <div className="home-product-price skeleton-text"></div>
          </div>
        </div>
      </SwiperSlide>
    ));
  };

  // Función para obtener productos de muestra si la API falla
  const getFallbackProducts = () => {
    return [
      {
        id_producto: 1,
        nombre: 'Bicicleta de Montaña Profesional',
        categoria: 'equipamiento',
        precio: 899.99,
        descripcion: 'Bicicleta de montaña de alta gama para terrenos difíciles',
        inventario: 5
      },
      {
        id_producto: 2,
        nombre: 'Casco de Ciclismo Aero',
        categoria: 'accesorios',
        precio: 89.99,
        descripcion: 'Casco aerodinámico con máxima ventilación y seguridad',
        inventario: 15
      },
      {
        id_producto: 3,
        nombre: 'Zapatillas de Ciclismo Carbon',
        categoria: 'ropa',
        precio: 199.99,
        descripcion: 'Zapatillas profesionales con suela de carbono',
        inventario: 8
      },
      {
        id_producto: 4,
        nombre: 'Sillón de Competición',
        categoria: 'equipamiento',
        precio: 129.99,
        descripcion: 'Sillón ergonómico para máximo rendimiento',
        inventario: 12
      },
      {
        id_producto: 5,
        nombre: 'Gafas Deportivas Polarizadas',
        categoria: 'accesorios',
        precio: 75.50,
        descripcion: 'Protección UV y visión clara en cualquier condición',
        inventario: 20
      },
      {
        id_producto: 6,
        nombre: 'Monitor de Ritmo Cardíaco',
        categoria: 'electronica',
        precio: 149.99,
        descripcion: 'Seguimiento preciso de tu rendimiento cardiaco',
        inventario: 7
      }
    ];
  };

  return (
    <div className="home-page">
      <HeroCarousel />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Featured Events Section */}
      <section className="featured-section">
        <div className="section-header">
          <Typewriter
            options={{
              strings: ['Descubre tu próxima aventura', 'Eventos Estelares', 'Experiencias Destacadas'],
              autoStart: true,
              loop: true,
            }}
          />
          <p className="section-subtitle">
            Los eventos más esperados de la temporada, seleccionados especialmente para ti
          </p>
        </div>

        {isLoading ? (
          <div className="featured-grid">
            {renderSkeletonCards(3, true)}
          </div>
        ) : featuredEvents.length > 0 ? (
          <EventCarousel events={featuredEvents} />
        ) : (
          <EmptyState
            icon="⭐"
            title="No hay eventos destacados"
            message="Pronto tendremos eventos especiales destacados para ti. Mientras tanto, explora nuestros próximos eventos."
            actionButton={
              <Link to="/eventos" className="btn btn-primary">
                Explorar Todos los Eventos
              </Link>
            }
            size="large"
          />
        )}
      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="section-header">
          <h2 className="section-title">
            Próximos Eventos
          </h2>
          <p className="section-subtitle">
            No te pierdas estas increíbles oportunidades deportivas
          </p>
        </div>

        {isLoading ? (
          <div className="events-grid">
            {renderSkeletonCards(6)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No hay eventos próximos"
            message="Actualmente no hay eventos programados. Vuelve pronto para descubrir nuevas aventuras deportivas."
            actionButton={
              <Link to="/eventos" className="btn btn-primary">
                Ver Todos los Eventos
              </Link>
            }
            size="large"
          />
        ) : (
          <>
            <div className="events-grid">
              {events.slice(0, 6).map(event => (
                <div key={event.id_evento} className="event-card">
                  <div className="card-header">
                    <div className="event-type">
                      {getEventTypeIcon(event.tipo)}
                      <span>{event.tipo || 'Evento'}</span>
                    </div>
                    {event.es_destacado && (
                      <div className="featured-indicator">
                        ⭐
                      </div>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <h3 className="event-title">{event.nombre || 'Evento sin nombre'}</h3>
                    <p className="event-description">
                      {event.descripcion || 'Únete a esta increíble experiencia deportiva...'}
                    </p>
                    
                    <div className="event-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(event.fecha_inicio)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>{event.ubicacion || 'Ubicación por confirmar'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="event-meta">
                      {getDifficultyBadge(event.dificultad)}
                      {event.cuota_inscripcion > 0 ? (
                        <span className="price-tag">
                          {formatPrice(event.cuota_inscripcion)}
                        </span>
                      ) : (
                        <span className="price-tag free">
                          Gratis
                        </span>
                      )}
                    </div>
                    <Link 
                      to={`/eventos/${event.id_evento}`}
                      className="btn btn-outline btn-small"
                    >
                      Más Info
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {events.length > 6 && (
              <div className="section-actions">
                <Link to="/eventos" className="btn btn-outline">
                  Ver Todos los Eventos ({events.length})
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Nueva Sección: Product Showcase */}
      <section className="product-showcase-section">
        <div className="section-header">
          <h2 className="section-title">
            Equípate para la Aventura
          </h2>
          <p className="section-subtitle">
            Descubre los productos esenciales para tu próximo desafío deportivo
          </p>
        </div>

        <div className="container">
          {isProductsLoading ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
            >
              {renderProductSkeletons(4)}
            </Swiper>
          ) : products.length > 0 ? (
            <>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 }
                }}
              >
                {products.slice(0, 8).map(product => (
                  <SwiperSlide key={product.id_producto}>
                    <Link to="/store" className="home-product-card">
                      <div className="home-product-image">
                        {getProductCategoryIcon(product.categoria)}
                      </div>
                      <div className="home-product-content">
                        <h3 className="home-product-name">
                          {product.nombre}
                        </h3>
                        <p className="home-product-category">
                          {getCategoryLabel(product.categoria)}
                        </p>
                        <div className="home-product-price">
                          {formatProductPrice(product.precio)}
                        </div>
                        {product.inventario !== undefined && (
                          <small style={{ 
                            color: product.inventario > 5 ? 'var(--color-success)' : 'var(--color-warning)', 
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                            fontWeight: '500'
                          }}>
                            {product.inventario > 10 ? '✅ En stock' : 
                             product.inventario > 5 ? `🟡 ${product.inventario} unidades` : 
                             `🔴 Solo ${product.inventario} left`}
                          </small>
                        )}
                      </div>
                      <div className="home-product-actions">
                        <span className="btn btn-outline btn-small">
                          Ver en Tienda
                        </span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <div className="section-actions">
                <Link to="/store" className="btn btn-primary">
                  Ver Todos los Productos ({products.length})
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              icon="🛍️"
              title="Próximamente en la tienda"
              message="Estamos preparando los mejores productos para tu aventura deportiva."
              actionButton={
                <Link to="/store" className="btn btn-primary">
                  Explorar Tienda
                </Link>
              }
              size="medium"
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            ¿Por qué unirte a nuestra comunidad?
          </h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Eventos Diversos</h3>
            <p className="feature-description">
              Desde carreras urbanas hasta aventuras en la naturaleza, 
              encuentra el evento perfecto para tus intereses.
            </p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Comunidad Activa</h3>
            <p className="feature-description">
              Conecta con otros entusiastas del deporte, comparte experiencias 
              y crea recuerdos inolvidables.
            </p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Logros y Reconocimiento</h3>
            <p className="feature-description">
              Gana medallas, mejora tus marcas personales y sé reconocido 
              por tus logros deportivos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;