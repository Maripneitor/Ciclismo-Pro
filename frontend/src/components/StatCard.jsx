import './StatCard.css';

function StatCard({ title, value, subtitle, icon, color, trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__content">
        <div className="stat-card__info">
          <h3 className="stat-card__value">{value}</h3>
          <p className="stat-card__title">{title}</p>
          {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
          {trend && (
            <div className={`stat-card__trend stat-card__trend--${trend.direction}`}>
              {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
            </div>
          )}
        </div>
        <div className="stat-card__icon">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;