import './OrganizerCommon.css';

function OrganizerReportsPage() {
  return (
    <div className="organizer-page">
      <div className="page-header">
        <h1>Reportes y Estadísticas</h1>
        <p>Analiza el rendimiento de tus eventos</p>
      </div>
      
      <div className="content-section">
        <div className="section-info">
          <h3>Funcionalidad en desarrollo</h3>
          <p>Próximamente podrás:</p>
          <ul>
            <li>Ver reportes de asistencia</li>
            <li>Analizar ingresos por evento</li>
            <li>Estadísticas de participación</li>
            <li>Exportar reportes en PDF/Excel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrganizerReportsPage;