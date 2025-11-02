// components/SafeChartComponent.jsx
import React from 'react';

// Componente seguro para gráficos de dona
export const SafeDoughnutChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No hay datos para mostrar</p>
      </div>
    );
  }

  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  
  return (
    <div className="safe-chart-container">
      <div className="chart-data-list">
        <h4>Distribución:</h4>
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          const color = data.datasets[0].backgroundColor[index];
          
          return (
            <div key={index} className="chart-data-item">
              <div className="chart-color-indicator" style={{ backgroundColor: color }}></div>
              <div className="chart-label">{label}</div>
              <div className="chart-value">{value} ({percentage}%)</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente seguro para gráficos de barras
export const SafeBarChart = ({ data, title }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No hay datos para mostrar</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.datasets[0].data);
  
  return (
    <div className="safe-chart-container">
      <div className="bar-chart-data">
        <h4>{title}:</h4>
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const color = data.datasets[0].backgroundColor[index];
          
          return (
            <div key={index} className="bar-chart-item">
              <div className="bar-label">{label}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
                <div className="bar-value">{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};