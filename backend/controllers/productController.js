const db = require('../db');

const getPublicProducts = async (req, res) => {
  try {
    console.log('=== GET PUBLIC PRODUCTS ===');
    console.log('Fetching active products with inventory...');

    const result = await db.query(
      `SELECT 
        id_producto, 
        nombre, 
        descripcion, 
        precio, 
        categoria,
        inventario
       FROM productos_tienda 
       WHERE activo = true AND inventario > 0
       ORDER BY id_producto DESC`
    );

    console.log('Public products found:', result.rows.length);

    res.json({
      success: true,
      data: {
        totalProducts: result.rows.length,
        products: result.rows
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener productos',
      error: error.message
    });
  }
};

module.exports = {
  getPublicProducts
};