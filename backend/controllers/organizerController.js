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

const getEventParticipants = async (req, res) => {
  try {
    const organizerId = req.user.id_usuario;
    const eventId = req.params.id;

    console.log('=== GET EVENT PARTICIPANTS ===');
    console.log('Organizer ID:', organizerId);
    console.log('Event ID:', eventId);

    // Verificación de propiedad del evento
    const eventOwnershipCheck = await db.query(
      'SELECT id_organizador FROM eventos WHERE id_evento = $1',
      [eventId]
    );

    if (eventOwnershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const eventOwnerId = eventOwnershipCheck.rows[0].id_organizador;

    if (eventOwnerId !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este evento'
      });
    }

    // Obtener participantes del evento
    const participantsResult = await db.query(
      `SELECT 
        u.nombre_completo, 
        u.correo_electronico, 
        i.estado, 
        i.numero_dorsal, 
        i.alias_dorsal, 
        i.fecha_inscripcion
       FROM inscripciones i 
       JOIN usuarios u ON i.id_usuario = u.id_usuario 
       WHERE i.id_evento = $1 
       ORDER BY i.fecha_inscripcion ASC`,
      [eventId]
    );

    console.log('Participants found:', participantsResult.rows.length);

    res.json({
      success: true,
      data: {
        eventId: parseInt(eventId),
        totalParticipants: participantsResult.rows.length,
        participants: participantsResult.rows
      }
    });
  } catch (error) {
    console.error('Error obteniendo participantes del evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener participantes',
      error: error.message
    });
  }
};

module.exports = {
  getOrganizerData,
  getMyCreatedEvents,
  getEventParticipants
};