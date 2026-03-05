import { Link } from 'react-router-dom';

function OrderSuccessPage() {
  return (
    <div className="container">
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '2rem',
          color: 'var(--success)'
        }}>
          ✅
        </div>
        
        <h1 style={{ 
          color: 'var(--success)',
          marginBottom: '1rem'
        }}>
          ¡Pedido Confirmado!
        </h1>
        
        <p style={{ 
          color: 'var(--neutral-600)', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente y está siendo preparado.
          <br />
          Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>

        <div style={{ 
          backgroundColor: 'var(--success-50)',
          border: '1px solid var(--success-200)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            color: 'var(--success-700)',
            marginBottom: '1rem'
          }}>
            ¿Qué sigue?
          </h3>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: '0.5rem 0' }}>
              📧 <strong>Recibirás un email</strong> con la confirmación y detalles del envío
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              🚚 <strong>Tu pedido será enviado</strong> en un plazo de 2-3 días hábiles
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              📦 <strong>Recibirás notificación</strong> cuando tu pedido esté en camino
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/store">
            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              Seguir Comprando
            </button>
          </Link>
          
          <Link to="/dashboard">
            <button style={{
              padding: '1rem 2rem',
              backgroundColor: 'transparent',
              color: 'var(--primary-500)',
              border: '1px solid var(--primary-500)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              Mi Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
