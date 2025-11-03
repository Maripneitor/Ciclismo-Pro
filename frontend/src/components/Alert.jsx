import React from 'react';
import './Alert.css';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';

const iconMap = {
  info: <FiInfo />,
  success: <FiCheckCircle />,
  warning: <FiAlertTriangle />,
  error: <FiXCircle />,
};

function Alert({ toast, onRemove }) {
  const { id, type, message } = toast;
  const Icon = iconMap[type] || <FiInfo />;

  return (
    <div className={`alert-card alert-${type}`}>
      <div className="alert-header">
        <span className="alert-icon">
          {Icon}
        </span>
        <p className="alert-title">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
        <button className="alert-close-btn" onClick={() => onRemove(id)}>
          <FiX />
        </button>
      </div>
      <p className="alert-message">
        {message}
      </p>
    </div>
  );
}

export default Alert;