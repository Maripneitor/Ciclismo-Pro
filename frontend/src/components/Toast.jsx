import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;