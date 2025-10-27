import { useState } from 'react';
import './ResponsiveTable.css';

function ResponsiveTable({ 
  columns, 
  data, 
  keyExtractor, 
  renderMobileCard,
  emptyMessage = "No hay datos disponibles",
  loading = false
}) {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de escritorio */}
      <div className="responsive-table-container desktop-only">
        <table className="responsive-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? 'sortable' : ''}
                >
                  <div className="th-content">
                    {column.title}
                    {column.sortable && (
                      <span className={`sort-indicator ${sortField === column.key ? sortDirection : ''}`}>
                        ↕️
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={keyExtractor(item)}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="mobile-only">
        {sortedData.map((item) => (
          <div key={keyExtractor(item)} className="table-mobile-card">
            {renderMobileCard ? renderMobileCard(item) : (
              <>
                {columns.map((column) => (
                  <div key={column.key} className="card-row">
                    <span className="card-label">{column.title}</span>
                    <span className="card-value">
                      {column.render ? column.render(item) : item[column.key]}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ResponsiveTable;