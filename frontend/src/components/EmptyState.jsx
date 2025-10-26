import './EmptyState.css';

function EmptyState({ 
  icon = "📋", 
  title, 
  message, 
  actionButton,
  size = "medium" 
}) {
  return (
    <div className={`empty-state empty-state--${size}`}>
      <div className="empty-state__icon">
        {icon}
      </div>
      
      <div className="empty-state__content">
        {title && (
          <h3 className="empty-state__title">{title}</h3>
        )}
        
        <p className="empty-state__message">{message}</p>
        
        {actionButton && (
          <div className="empty-state__actions">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;