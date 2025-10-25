const db = require('../db');

const getAllEvents = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM eventos WHERE estado = 'proximo' ORDER BY fecha_inicio ASC"
    );
    res.json({
      success: true,
      data: result.rows
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

module.exports = {
  getAllEvents,
  getEventById
};