const db = require('../db');

const getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id_usuario;

    console.log('=== GET ALL USERS ===');
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    const result = await db.query(
      `SELECT 
        id_usuario, 
        nombre_completo, 
        correo_electronico, 
        rol, 
        telefono,
        fecha_creacion
       FROM usuarios 
       ORDER BY fecha_creacion DESC`
    );

    console.log('Total users found:', result.rows.length);

    res.json({
      success: true,
      data: {
        totalUsers: result.rows.length,
        users: result.rows
      }
    });
  } catch (error) {
    console.error('Error obteniendo todos los usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener usuarios',
      error: error.message
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const adminId = req.user.id_usuario;

    console.log('=== GET ALL EVENTS ===');
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    const result = await db.query(
      `SELECT 
        e.id_evento, 
        e.nombre, 
        e.descripcion,
        e.estado, 
        e.fecha_inicio, 
        e.fecha_fin,
        e.ubicacion,
        e.distancia_km,
        e.dificultad,
        e.cuota_inscripcion,
        e.tipo,
        e.maximo_participantes,
        e.fecha_creacion,
        u.nombre_completo as organizador,
        u.id_usuario as id_organizador
       FROM eventos e 
       JOIN usuarios u ON e.id_organizador = u.id_usuario 
       ORDER BY e.fecha_inicio DESC`
    );

    console.log('Total events found:', result.rows.length);

    res.json({
      success: true,
      data: {
        totalEvents: result.rows.length,
        events: result.rows
      }
    });
  } catch (error) {
    console.error('Error obteniendo todos los eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener eventos',
      error: error.message
    });
  }
};

const updateUserRole = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const targetUserId = req.params.id;
    const { nuevoRol } = req.body;
    const adminId = req.user.id_usuario;

    console.log('=== UPDATE USER ROLE ===');
    console.log('Target User ID:', targetUserId);
    console.log('New Role:', nuevoRol);
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    // Validaciones básicas
    if (!nuevoRol) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El nuevo rol es requerido'
      });
    }

    // Validar que el rol sea uno de los permitidos
    const allowedRoles = ['usuario', 'organizador', 'administrador'];
    if (!allowedRoles.includes(nuevoRol)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Rol no válido. Los roles permitidos son: usuario, organizador, administrador'
      });
    }

    // Verificar que el usuario objetivo existe
    const userCheck = await client.query(
      'SELECT id_usuario, nombre_completo, rol FROM usuarios WHERE id_usuario = $1',
      [targetUserId]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const targetUser = userCheck.rows[0];

    // Verificar que no se está intentando modificar a sí mismo (opcional, pero buena práctica)
    if (parseInt(targetUserId) === adminId) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'No puedes modificar tu propio rol'
      });
    }

    // Actualizar el rol del usuario
    const updatedUser = await client.query(
      `UPDATE usuarios 
       SET rol = $1 
       WHERE id_usuario = $2 
       RETURNING id_usuario, nombre_completo, correo_electronico, rol, fecha_creacion`,
      [nuevoRol, targetUserId]
    );

    await client.query('COMMIT');

    console.log('User role updated successfully:', updatedUser.rows[0]);

    res.json({
      success: true,
      message: `Rol de ${targetUser.nombre_completo} actualizado a: ${nuevoRol}`,
      data: updatedUser.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando rol de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el rol',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const updateEventStatus = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const eventId = req.params.id;
    const { nuevoEstado } = req.body;
    const adminId = req.user.id_usuario;

    console.log('=== UPDATE EVENT STATUS ===');
    console.log('Event ID:', eventId);
    console.log('New Status:', nuevoEstado);
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    // Validaciones básicas
    if (!nuevoEstado) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es requerido'
      });
    }

    // Validar que el estado sea uno de los permitidos
    const allowedStatuses = ['proximo', 'activo', 'finalizado', 'cancelado'];
    if (!allowedStatuses.includes(nuevoEstado)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Estado no válido. Los estados permitidos son: proximo, activo, finalizado, cancelado'
      });
    }

    // Verificar que el evento existe
    const eventCheck = await client.query(
      `SELECT e.id_evento, e.nombre, e.estado, u.nombre_completo as organizador 
       FROM eventos e 
       JOIN usuarios u ON e.id_organizador = u.id_usuario 
       WHERE e.id_evento = $1`,
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const event = eventCheck.rows[0];

    // Actualizar el estado del evento
    const updatedEvent = await client.query(
      `UPDATE eventos 
       SET estado = $1 
       WHERE id_evento = $2 
       RETURNING *`,
      [nuevoEstado, eventId]
    );

    await client.query('COMMIT');

    console.log('Event status updated successfully:', updatedEvent.rows[0]);

    res.json({
      success: true,
      message: `Estado del evento "${event.nombre}" actualizado a: ${nuevoEstado}`,
      data: updatedEvent.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando estado del evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el estado del evento',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// ========== GESTIÓN DE PRODUCTOS ==========

const getAllProducts = async (req, res) => {
  try {
    const adminId = req.user.id_usuario;

    console.log('=== GET ALL PRODUCTS ===');
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    const result = await db.query(
      `SELECT * FROM productos_tienda ORDER BY id_producto DESC`
    );

    console.log('Total products found:', result.rows.length);

    res.json({
      success: true,
      data: {
        totalProducts: result.rows.length,
        products: result.rows
      }
    });
  } catch (error) {
    console.error('Error obteniendo todos los productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener productos',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const adminId = req.user.id_usuario;

    console.log('=== GET PRODUCT BY ID ===');
    console.log('Product ID:', productId);
    console.log('Admin ID:', adminId);

    const result = await db.query(
      'SELECT * FROM productos_tienda WHERE id_producto = $1',
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    console.log('Product found:', result.rows[0]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener el producto',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { nombre, descripcion, precio, categoria, inventario } = req.body;
    const adminId = req.user.id_usuario;

    console.log('=== CREATE PRODUCT ===');
    console.log('Admin ID:', adminId);
    console.log('Request body:', req.body);

    // Validaciones básicas
    if (!nombre || !precio || !categoria || inventario === undefined) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Nombre, precio, categoría e inventario son campos obligatorios'
      });
    }

    // Validar que el precio sea un número positivo
    if (precio < 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número positivo'
      });
    }

    // Validar que el inventario sea un número entero no negativo
    if (inventario < 0 || !Number.isInteger(inventario)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El inventario debe ser un número entero no negativo'
      });
    }

    // Insertar el nuevo producto
    const newProduct = await client.query(
      `INSERT INTO productos_tienda 
       (nombre, descripcion, precio, categoria, inventario, activo) 
       VALUES ($1, $2, $3, $4, $5, true) 
       RETURNING *`,
      [nombre, descripcion || null, precio, categoria, inventario]
    );

    await client.query('COMMIT');

    console.log('Product created successfully:', newProduct.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear el producto',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const updateProduct = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const productId = req.params.id;
    const { nombre, descripcion, precio, categoria, inventario, activo } = req.body;
    const adminId = req.user.id_usuario;

    console.log('=== UPDATE PRODUCT ===');
    console.log('Product ID:', productId);
    console.log('Admin ID:', adminId);
    console.log('Request body:', req.body);

    // Validaciones básicas
    if (!nombre || !precio || !categoria || inventario === undefined) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Nombre, precio, categoría e inventario son campos obligatorios'
      });
    }

    // Validar que el precio sea un número positivo
    if (precio < 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número positivo'
      });
    }

    // Validar que el inventario sea un número entero no negativo
    if (inventario < 0 || !Number.isInteger(inventario)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El inventario debe ser un número entero no negativo'
      });
    }

    // Verificar que el producto existe
    const productCheck = await client.query(
      'SELECT id_producto, nombre FROM productos_tienda WHERE id_producto = $1',
      [productId]
    );

    if (productCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Actualizar el producto
    const updatedProduct = await client.query(
      `UPDATE productos_tienda 
       SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, inventario = $5, activo = $6
       WHERE id_producto = $7 
       RETURNING *`,
      [nombre, descripcion || null, precio, categoria, inventario, activo !== false, productId]
    );

    await client.query('COMMIT');

    console.log('Product updated successfully:', updatedProduct.rows[0]);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el producto',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// ========== GESTIÓN DE PEDIDOS ==========

const getAllOrders = async (req, res) => {
  try {
    const adminId = req.user.id_usuario;

    console.log('=== GET ALL ORDERS ===');
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    const result = await db.query(
      `SELECT 
        p.id_pedido, 
        p.total, 
        p.estado, 
        p.fecha_creacion,
        p.fecha_actualizacion,
        u.id_usuario,
        u.nombre_completo as cliente,
        u.correo_electronico
       FROM pedidos_tienda p 
       JOIN usuarios u ON p.id_usuario = u.id_usuario 
       ORDER BY p.fecha_creacion DESC`
    );

    console.log('Total orders found:', result.rows.length);

    // Obtener items para cada pedido
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
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
          items: itemsResult.rows,
          items_count: itemsResult.rows.length
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalOrders: ordersWithItems.length,
        orders: ordersWithItems
      }
    });
  } catch (error) {
    console.error('Error obteniendo todos los pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener pedidos',
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const orderId = req.params.id;
    const { nuevoEstado } = req.body;
    const adminId = req.user.id_usuario;

    console.log('=== UPDATE ORDER STATUS ===');
    console.log('Order ID:', orderId);
    console.log('New Status:', nuevoEstado);
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);

    // Validaciones básicas
    if (!nuevoEstado) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es requerido'
      });
    }

    // Validar que el estado sea uno de los permitidos
    const allowedStatuses = ['pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!allowedStatuses.includes(nuevoEstado)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Estado no válido. Los estados permitidos son: pendiente, confirmado, procesando, enviado, entregado, cancelado'
      });
    }

    // Verificar que el pedido existe
    const orderCheck = await client.query(
      `SELECT p.id_pedido, p.estado, u.nombre_completo as cliente 
       FROM pedidos_tienda p 
       JOIN usuarios u ON p.id_usuario = u.id_usuario 
       WHERE p.id_pedido = $1`,
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    const order = orderCheck.rows[0];

    // Actualizar el estado del pedido
    const updatedOrder = await client.query(
      `UPDATE pedidos_tienda 
       SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_pedido = $2 
       RETURNING *`,
      [nuevoEstado, orderId]
    );

    await client.query('COMMIT');

    console.log('Order status updated successfully:', updatedOrder.rows[0]);

    res.json({
      success: true,
      message: `Estado del pedido #${orderId} actualizado a: ${nuevoEstado}`,
      data: {
        ...updatedOrder.rows[0],
        cliente: order.cliente
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando estado del pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el estado del pedido',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllUsers,
  getAllEvents,
  updateUserRole,
  updateEventStatus,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getAllOrders,
  updateOrderStatus
};