import './OrganizerCommon.css';

function OrganizerParticipantsPage() {
  return (
    <div className="organizer-page">
      <div className="page-header">
        <h1>Gestión de Participantes</h1>
        <p>Administra los participantes de tus eventos</p>
      </div>
      
      <div className="content-section">
        <div className="section-info">
          <h3>Funcionalidad en desarrollo</h3>
          <p>Próximamente podrás:</p>
          <ul>
            <li>Ver todos los participantes de tus eventos</li>
            <li>Filtrar participantes por evento</li>
            <li>Exportar listas de participantes</li>
            <li>Gestionar estados de inscripción</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrganizerParticipantsPage;