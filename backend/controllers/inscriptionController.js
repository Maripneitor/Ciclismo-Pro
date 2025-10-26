const db = require('../db');

const getMyInscriptions = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    const result = await db.query(
      `SELECT 
        i.id_inscripcion,
        i.id_usuario,
        i.id_evento,
        i.id_categoria,
        i.id_talla_playera,
        i.id_equipo,
        i.numero_dorsal,
        i.alias_dorsal,
        i.estado,
        i.numero_telefono,
        i.fecha_nacimiento,
        i.genero,
        i.nombre_contacto_emergencia,
        i.telefono_contacto_emergencia,
        i.url_identificacion,
        i.tiempo_total,
        i.posicion_general,
        i.posicion_categoria,
        i.distancia_completada,
        i.ritmo_promedio,
        i.fecha_inscripcion,
        i.datos_seguimiento,
        i.ultima_actualizacion_gps,
        i.modo_emergencia_activado,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        e.ubicacion,
        e.distancia_km,
        e.dificultad,
        e.cuota_inscripcion,
        e.tipo,
        e.estado as estado_evento
       FROM inscripciones i 
       JOIN eventos e ON i.id_evento = e.id_evento 
       WHERE i.id_usuario = $1 
       ORDER BY e.fecha_inicio DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo inscripciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const createInscription = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id_usuario;
    const { 
      id_evento, 
      id_categoria, 
      id_talla_playera, 
      alias_dorsal, 
      id_equipo 
    } = req.body;

    console.log('=== CREATE INSCRIPTION DEBUG ===');
    console.log('User ID:', userId);
    console.log('Request body:', req.body);

    // 1. Verificar si ya está inscrito en este evento
    const existingInscription = await client.query(
      'SELECT * FROM inscripciones WHERE id_usuario = $1 AND id_evento = $2',
      [userId, id_evento]
    );

    if (existingInscription.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Ya estás inscrito en este evento'
      });
    }

    // 2. Generar número de dorsal único para este evento
    const maxDorsalResult = await client.query(
      'SELECT MAX(numero_dorsal) as max_dorsal FROM inscripciones WHERE id_evento = $1',
      [id_evento]
    );

    const maxDorsal = maxDorsalResult.rows[0].max_dorsal;
    const nuevoDorsal = (maxDorsal || 0) + 1;

    console.log('Max dorsal:', maxDorsal, 'New dorsal:', nuevoDorsal);

    // 3. Insertar la nueva inscripción
    const newInscription = await client.query(
      `INSERT INTO inscripciones 
       (id_usuario, id_evento, id_categoria, id_talla_playera, id_equipo, numero_dorsal, alias_dorsal, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendiente') 
       RETURNING *`,
      [
        userId, 
        id_evento, 
        id_categoria, 
        id_talla_playera, 
        id_equipo || null, 
        nuevoDorsal, 
        alias_dorsal || null
      ]
    );

    await client.query('COMMIT');

    console.log('Inscription created successfully:', newInscription.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Inscripción creada exitosamente',
      data: newInscription.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando inscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear la inscripción',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = { 
  getMyInscriptions,
  createInscription 
};