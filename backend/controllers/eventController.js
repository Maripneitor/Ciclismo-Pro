const db = require('../db');

const getAllEvents = async (req, res) => {
  try {
    // Obtener parámetros de consulta
    const { nombre, ubicacion, dificultad, tipo, categoria, fecha_inicio, fecha_fin } = req.query;
    
    // Construir consulta SQL dinámica
    let query = "SELECT * FROM eventos WHERE estado = 'proximo'";
    const queryParams = [];
    let paramCount = 0;

    // Filtro por nombre
    if (nombre) {
      paramCount++;
      query += ` AND nombre ILIKE $${paramCount}`;
      queryParams.push(`%${nombre}%`);
    }

    // Filtro por ubicación
    if (ubicacion) {
      paramCount++;
      query += ` AND ubicacion ILIKE $${paramCount}`;
      queryParams.push(`%${ubicacion}%`);
    }

    // Filtro por dificultad
    if (dificultad) {
      paramCount++;
      query += ` AND dificultad = $${paramCount}`;
      queryParams.push(dificultad);
    }

    // Filtro por tipo de evento
    if (tipo) {
      paramCount++;
      query += ` AND tipo = $${paramCount}`;
      queryParams.push(tipo);
    }

    // Filtro por fecha de inicio
    if (fecha_inicio) {
      paramCount++;
      query += ` AND fecha_inicio >= $${paramCount}`;
      queryParams.push(fecha_inicio);
    }

    // Filtro por fecha de fin
    if (fecha_fin) {
      paramCount++;
      query += ` AND fecha_inicio <= $${paramCount}`;
      queryParams.push(fecha_fin);
    }

    // Ordenar por fecha de inicio
    query += " ORDER BY fecha_inicio ASC";

    console.log('Query ejecutada:', query);
    console.log('Parámetros:', queryParams);

    const result = await db.query(query, queryParams);
    
    res.json({
      success: true,
      data: result.rows,
      filters: {
        nombre,
        ubicacion,
        dificultad,
        tipo,
        fecha_inicio,
        fecha_fin
      }
    });
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Las otras funciones (getEventById, getEventCategories) permanecen igual
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM eventos WHERE id_evento = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getEventCategories = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT c.id_categoria, c.nombre, c.descripcion 
       FROM categorias_evento ce 
       JOIN categorias c ON ce.id_categoria = c.id_categoria 
       WHERE ce.id_evento = $1`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo categorías del evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  getEventCategories
};