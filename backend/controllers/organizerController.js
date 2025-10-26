const db = require('../db');

const getOrganizerData = async (req, res) => {
  try {
    console.log('=== ORGANIZER DASHBOARD ACCESS ===');
    console.log('User ID:', req.user.id_usuario);
    console.log('User Role:', req.user.rol);

    res.json({
      success: true,
      message: `Bienvenido a tu panel, ${req.user.rol}`,
      data: {
        user: {
          id: req.user.id_usuario,
          rol: req.user.rol
        },
        stats: {
          totalEvents: 0,
          pendingRegistrations: 0,
          activeParticipants: 0
        },
        features: [
          'Gestión de eventos',
          'Aprobación de inscripciones',
          'Estadísticas de participación',
          'Gestión de equipos'
        ]
      }
    });
  } catch (error) {
    console.error('Error en panel de organizador:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getMyCreatedEvents = async (req, res) => {
  try {
    const organizerId = req.user.id_usuario;

    console.log('=== GET MY CREATED EVENTS ===');
    console.log('Organizer ID:', organizerId);

    const result = await db.query(
      `SELECT 
        id_evento, 
        nombre, 
        descripcion,
        estado, 
        fecha_inicio, 
        fecha_fin,
        ubicacion,
        distancia_km,
        dificultad,
        cuota_inscripcion,
        tipo,
        maximo_participantes,
        fecha_creacion
       FROM eventos 
       WHERE id_organizador = $1 
       ORDER BY fecha_inicio DESC`,
      [organizerId]
    );

    console.log('Events found:', result.rows.length);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo eventos del organizador:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener eventos',
      error: error.message
    });
  }
};

module.exports = {
  getOrganizerData,
  getMyCreatedEvents
};