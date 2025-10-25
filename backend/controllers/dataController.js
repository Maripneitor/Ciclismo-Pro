const db = require('../db');

const getAllShirtSizes = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tallas_playera ORDER BY id_talla_playera'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo tallas de playera:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllShirtSizes
};