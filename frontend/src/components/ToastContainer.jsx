import { useToast } from '../context/ToastContext';
import Alert from './Alert'; // <-- Importa tu nuevo componente
import './Toast.css'; // <-- Este es el .css del *contenedor*
import './Alert.css'; // <-- Importa los estilos de la tarjeta de alerta

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

export default ToastContainer;