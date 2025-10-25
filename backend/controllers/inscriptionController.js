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

module.exports = { getMyInscriptions };