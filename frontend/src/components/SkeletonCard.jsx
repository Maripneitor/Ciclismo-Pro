import './SkeletonCard.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {/* Imagen/Header del skeleton */}
      <div className="skeleton-image"></div>
      
      {/* Contenido del skeleton */}
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-badge"></div>
          <div className="skeleton-title"></div>
        </div>
        
        <div className="skeleton-details">
          <div className="skeleton-detail">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text short"></div>
          </div>
          <div className="skeleton-detail">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text medium"></div>
          </div>
          <div className="skeleton-detail">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text long"></div>
          </div>
          <div className="skeleton-detail">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text short"></div>
          </div>
        </div>
        
        <div className="skeleton-footer">
          <div className="skeleton-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;