const db = require('../db');

const createOrder = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id_usuario;
    const { items } = req.body;

    console.log('=== CREATE ORDER DEBUG ===');
    console.log('User ID:', userId);
    console.log('Items received:', items);

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El carrito está vacío'
      });
    }

    // Calcular total en el servidor (seguridad)
    let total = 0;
    for (const item of items) {
      if (!item.id_producto || !item.cantidad || !item.precio) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Datos de producto inválidos'
        });
      }

      // Validar que la cantidad sea un número positivo
      if (item.cantidad < 1 || !Number.isInteger(item.cantidad)) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Cantidad inválida para el producto: ${item.nombre}`
        });
      }

      // Validar que el precio sea un número positivo
      if (item.precio < 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Precio inválido para el producto: ${item.nombre}`
        });
      }

      total += item.precio * item.cantidad;
    }

    console.log('Total calculated:', total);

    // Crear el pedido principal
    const orderResult = await client.query(
      `INSERT INTO pedidos_tienda (id_usuario, total, estado) 
       VALUES ($1, $2, 'pendiente') 
       RETURNING id_pedido, fecha_creacion`,
      [userId, total]
    );

    const orderId = orderResult.rows[0].id_pedido;
    console.log('Order created with ID:', orderId);

    // Insertar items del pedido
    for (const item of items) {
      console.log('Inserting item:', {
        orderId,
        productId: item.id_producto,
        quantity: item.cantidad,
        unitPrice: item.precio
      });

      await client.query(
        `INSERT INTO items_pedido (id_pedido, id_producto, cantidad, precio_unitario) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id_producto, item.cantidad, item.precio]
      );

      // Actualizar inventario (reducir stock)
      await client.query(
        `UPDATE productos_tienda 
         SET inventario = inventario - $1 
         WHERE id_producto = $2 AND inventario >= $1`,
        [item.cantidad, item.id_producto]
      );
    }

    await client.query('COMMIT');

    console.log('Order created successfully');

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        id_pedido: orderId,
        total: total,
        fecha_creacion: orderResult.rows[0].fecha_creacion,
        items_count: items.length
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    
    let errorMessage = 'Error interno del servidor al crear el pedido';
    
    if (error.code === '23503') { // Foreign key violation
      errorMessage = 'Uno o más productos no existen';
    } else if (error.code === '23514') { // Check violation
      errorMessage = 'Datos de pedido inválidos';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Función para obtener los pedidos del usuario
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    console.log('=== GET MY ORDERS ===');
    console.log('User ID:', userId);

    const ordersResult = await db.query(
      `SELECT 
        id_pedido,
        total,
        estado,
        fecha_creacion,
        fecha_actualizacion
       FROM pedidos_tienda 
       WHERE id_usuario = $1 
       ORDER BY fecha_creacion DESC`,
      [userId]
    );

    console.log('Orders found:', ordersResult.rows.length);

    // Obtener detalles de items para cada pedido
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await db.query(
          `SELECT 
            ip.id_producto,
            ip.cantidad,
            ip.precio_unitario,
            p.nombre as nombre_producto,
            p.categoria
           FROM items_pedido ip
           JOIN productos_tienda p ON ip.id_producto = p.id_producto
           WHERE ip.id_pedido = $1`,
          [order.id_pedido]
        );

        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: {
        orders: ordersWithItems
      }
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener los pedidos',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders
};