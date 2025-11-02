const db = require('../db');

// Función de utilidad para crear eventos
const createEvent = async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    const organizerId = req.user.id_usuario;
    const { 
      nombre, 
      descripcion,
      fecha_inicio, 
      fecha_fin, 
      ubicacion, 
      distancia_km, 
      dificultad, 
      tipo, 
      cuota_inscripcion, 
      maximo_participantes 
    } = req.body;

    console.log('=== CREATE EVENT DEBUG ===');
    console.log('Organizer ID:', organizerId);
    console.log('Event Name:', nombre);

    // Validación básica
    if (!nombre || !fecha_inicio || !ubicacion || !distancia_km || !dificultad || !tipo || cuota_inscripcion === undefined) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: nombre, fecha_inicio, ubicacion, distancia_km, dificultad, tipo y cuota_inscripcion.'
      });
    }

    // Insertar el nuevo evento
    const newEvent = await client.query(
      `INSERT INTO eventos (
        id_organizador, nombre, descripcion, estado, fecha_inicio, fecha_fin, ubicacion, 
        distancia_km, dificultad, tipo, cuota_inscripcion, maximo_participantes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        organizerId, 
        nombre, 
        descripcion || null, 
        'proximo', // Estado inicial
        fecha_inicio, 
        fecha_fin || null, 
        ubicacion, 
        distancia_km, 
        dificultad, 
        tipo, 
        cuota_inscripcion, 
        maximo_participantes || null
      ]
    );

    await client.query('COMMIT');
    
    console.log('Event created successfully:', newEvent.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: newEvent.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear el evento',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const getOrganizerData = async (req, res) => {
  const client = await db.pool.connect();
  try {
    console.log('=== ORGANIZER DASHBOARD ACCESS ===');
    console.log('User ID:', req.user.id_usuario);
    console.log('User Role:', req.user.rol);

    const organizerId = req.user.id_usuario;

    // 1. Estadísticas de Eventos (CORREGIDO: 'activo' por 'en_curso')
    const eventsStats = await client.query(
      `SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN estado = 'proximo' THEN 1 END) as upcoming_events,
        COUNT(CASE WHEN estado = 'en_curso' THEN 1 END) as active_events,
        COUNT(CASE WHEN estado = 'finalizado' THEN 1 END) as completed_events
       FROM eventos 
       WHERE id_organizador = $1`,
      [organizerId]
    );

    // 2. Estadísticas de Participantes (Esta consulta estaba bien)
    const participantsStats = await client.query(
      `SELECT 
        COUNT(DISTINCT i.id_usuario) as total_participants,
        COUNT(CASE WHEN i.estado = 'pendiente' THEN 1 END) as pending_registrations,
        COUNT(CASE WHEN i.estado = 'confirmada' THEN 1 END) as confirmed_participants
       FROM inscripciones i
       JOIN eventos e ON i.id_evento = e.id_evento
       WHERE e.id_organizador = $1`,
      [organizerId]
    );

    // 3. Estadísticas de Ingresos (CORREGIDO: Se obtiene 'cuota_inscripcion' de 'eventos' y se une con 'pagos')
    const revenueStats = await client.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN p.estado = 'aprobado' THEN e.cuota_inscripcion ELSE 0 END), 0) as total_revenue,
        COUNT(CASE WHEN p.estado = 'pendiente' THEN 1 END) as pending_payments
       FROM inscripciones i
       JOIN eventos e ON i.id_evento = e.id_evento
       LEFT JOIN pagos p ON i.id_inscripcion = p.id_inscripcion
       WHERE e.id_organizador = $1`,
      [organizerId]
    );

    // 4. Próximos eventos (Esta consulta estaba bien)
    const upcomingEvents = await client.query(
      `SELECT id_evento, nombre, fecha_inicio, ubicacion
       FROM eventos 
       WHERE id_organizador = $1 AND estado = 'proximo' 
       ORDER BY fecha_inicio ASC 
       LIMIT 3`,
      [organizerId]
    );

    const stats = eventsStats.rows[0];
    const participantStats = participantsStats.rows[0];
    const revenue = revenueStats.rows[0];

    res.json({
      success: true,
      message: `Bienvenido a tu panel, ${req.user.rol}`,
      data: {
        user: {
          id: req.user.id_usuario,
          rol: req.user.rol,
          nombre: req.user.nombre_completo || req.user.correo_electronico
        },
        stats: {
          totalEvents: parseInt(stats.total_events) || 0,
          upcomingEvents: parseInt(stats.upcoming_events) || 0,
          activeEvents: parseInt(stats.active_events) || 0,
          completedEvents: parseInt(stats.completed_events) || 0,
          totalParticipants: parseInt(participantStats.total_participants) || 0,
          pendingRegistrations: parseInt(participantStats.pending_registrations) || 0,
          confirmedParticipants: parseInt(participantStats.confirmed_participants) || 0,
          totalRevenue: parseFloat(revenue.total_revenue) || 0,
          pendingPayments: parseInt(revenue.pending_payments) || 0
        },
        upcomingEvents: upcomingEvents.rows,
        features: [
          'Gestión de eventos',
          'Aprobación de inscripciones',
          'Estadísticas de participación'
        ],
        quickActions: [
          { label: 'Crear Evento', path: '/organizer/events/create', icon: 'FiPlus' },
          { label: 'Ver Inscripciones', path: '/organizer/participants', icon: 'FiUsers' },
          { label: 'Generar Reporte', path: '/organizer/reports', icon: 'FiTrendingUp' }
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
  } finally {
    client.release();
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
  getEventParticipants,
  createEvent 
};