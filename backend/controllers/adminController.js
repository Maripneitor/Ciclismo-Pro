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
        e.es_destacado,
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

    // CORRECCIÓN: Cambiar 'activo' por 'en_curso' para coincidir con el esquema de la base de datos
    const allowedStatuses = ['proximo', 'en_curso', 'finalizado', 'cancelado'];
    if (!allowedStatuses.includes(nuevoEstado)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Estado no válido. Los estados permitidos son: proximo, en_curso, finalizado, cancelado'
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

// ========== GESTIÓN DE EVENTOS DESTACADOS ==========

const toggleFeaturedEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { es_destacado } = req.body;
    const adminId = req.user.id_usuario;

    console.log('=== TOGGLE FEATURED EVENT ===');
    console.log('Event ID:', eventId);
    console.log('Featured Status:', es_destacado);
    console.log('Admin ID:', adminId);
    console.log('Admin Role:', req.user.rol);
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);

    // Validaciones básicas
    if (es_destacado === undefined || es_destacado === null) {
      return res.status(400).json({
        success: false,
        message: 'El estado destacado es requerido'
      });
    }

    // Verificar que es_destacado es un booleano
    if (typeof es_destacado !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El estado destacado debe ser un valor booleano (true/false)'
      });
    }

    // Verificar que el evento existe
    const eventCheck = await db.query(
      `SELECT e.id_evento, e.nombre, e.es_destacado, u.nombre_completo as organizador 
       FROM eventos e 
       JOIN usuarios u ON e.id_organizador = u.id_usuario 
       WHERE e.id_evento = $1`,
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const event = eventCheck.rows[0];
    console.log('Evento existente encontrado:', event);

    // Actualizar el estado destacado del evento
    console.log('Ejecutando consulta UPDATE...');
    const updatedEvent = await db.query(
      `UPDATE eventos 
       SET es_destacado = $1 
       WHERE id_evento = $2 
       RETURNING *`,
      [es_destacado, eventId]
    );

    console.log('Resultado de la actualización:', updatedEvent.rows[0]);

    res.json({
      success: true,
      message: `Evento "${event.nombre}" ${es_destacado ? 'marcado como destacado' : 'quitado de destacados'}`,
      data: updatedEvent.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando estado destacado del evento:', error);
    console.error('Stack trace del error:', error.stack);
    console.error('Detalles del error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint
    });
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el estado destacado del evento',
      error: error.message
    });
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

const getDashboardData = async (req, res) => {
  const client = await db.pool.connect();
  try {
    console.log('=== GET ADMIN DASHBOARD DATA ===');
    console.log('Admin ID:', req.user.id_usuario);
    console.log('Admin Role:', req.user.rol);
    
    // 1. Estadísticas principales (en paralelo para mejor rendimiento)
    const statsPromises = [
      // Usuarios
      client.query("SELECT COUNT(*) as total_usuarios FROM usuarios"),
      client.query("SELECT COUNT(*) as usuarios_activos_hoy FROM usuarios WHERE fecha_creacion >= CURRENT_DATE"),
      client.query("SELECT rol, COUNT(*) as count FROM usuarios GROUP BY rol"),
      
      // Eventos
      client.query("SELECT COUNT(*) as eventos_proximos FROM eventos WHERE estado = 'proximo'"),
      client.query("SELECT COUNT(*) as eventos_en_curso FROM eventos WHERE estado = 'en_curso'"),
      client.query("SELECT COUNT(*) as eventos_finalizados FROM eventos WHERE estado = 'finalizado'"),
      client.query("SELECT COUNT(*) as eventos_cancelados FROM eventos WHERE estado = 'cancelado'"),
      client.query("SELECT AVG(cuota_inscripcion) as cuota_promedio FROM eventos WHERE cuota_inscripcion > 0"),
      
      // Pedidos
      client.query("SELECT COUNT(*) as pedidos_pendientes FROM pedidos_tienda WHERE estado = 'pendiente'"),
      client.query("SELECT COUNT(*) as pedidos_totales FROM pedidos_tienda"),
      client.query("SELECT COUNT(*) as pedidos_entregados FROM pedidos_tienda WHERE estado = 'entregado'"),
      client.query("SELECT COALESCE(SUM(total), 0) as ingresos_totales FROM pedidos_tienda WHERE estado = 'entregado' OR estado = 'confirmado'"),
      client.query("SELECT COALESCE(AVG(total), 0) as ticket_promedio FROM pedidos_tienda WHERE estado = 'entregado'"),
      
      // Productos
      client.query("SELECT COUNT(*) as productos_activos FROM productos_tienda WHERE activo = true"),
      client.query("SELECT COUNT(*) as productos_stock_bajo FROM productos_tienda WHERE inventario < 10 AND inventario > 0"),
      client.query("SELECT COUNT(*) as productos_sin_stock FROM productos_tienda WHERE inventario = 0"),
      
      // Inscripciones (con manejo de errores si la tabla no existe)
      client.query("SELECT COUNT(*) as total_inscripciones FROM inscripciones").catch(() => ({ rows: [{ total_inscripciones: 0 }] })),
      client.query("SELECT COUNT(*) as inscripciones_confirmadas FROM inscripciones WHERE estado = 'confirmada'").catch(() => ({ rows: [{ inscripciones_confirmadas: 0 }] }))
    ];
    
    console.log('Ejecutando consultas de estadísticas...');
    
    // 2. Actividad reciente (en paralelo)
    const recentUsersPromise = client.query(
      `SELECT id_usuario, nombre_completo, correo_electronico, fecha_creacion, rol
       FROM usuarios 
       ORDER BY fecha_creacion DESC 
       LIMIT 6`
    );
    
    const recentOrdersPromise = client.query(
      `SELECT p.id_pedido, p.total, p.estado, u.nombre_completo as cliente, p.fecha_pedido
       FROM pedidos_tienda p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       ORDER BY p.fecha_pedido DESC
       LIMIT 6`
    );

    const recentEventsPromise = client.query(
      `SELECT id_evento, nombre, estado, fecha_inicio, ubicacion, cuota_inscripcion
       FROM eventos 
       ORDER BY fecha_creacion DESC 
       LIMIT 6`
    );

    // Esperar todas las consultas
    const [statsResults, recentUsers, recentOrders, recentEvents] = await Promise.all([
      Promise.all(statsPromises),
      recentUsersPromise,
      recentOrdersPromise,
      recentEventsPromise
    ]);

    console.log('Consultas completadas exitosamente');

    // Procesar roles de usuarios
    const roles = statsResults[2].rows.reduce((acc, row) => {
      acc[row.rol] = parseInt(row.count, 10);
      return acc;
    }, { usuario: 0, organizador: 0, administrador: 0 });

    // Calcular totales y porcentajes
    const totalUsuarios = parseInt(statsResults[0].rows[0].total_usuarios, 10);
    const totalEventos = parseInt(statsResults[3].rows[0].eventos_proximos, 10) + 
                        parseInt(statsResults[4].rows[0].eventos_en_curso, 10) + 
                        parseInt(statsResults[5].rows[0].eventos_finalizados, 10) +
                        parseInt(statsResults[6].rows[0].eventos_cancelados, 10);
    
    const totalPedidos = parseInt(statsResults[9].rows[0].pedidos_totales, 10);
    const pedidosEntregados = parseInt(statsResults[10].rows[0].pedidos_entregados, 10);

    const stats = {
      // Usuarios
      usuarios: {
        total: totalUsuarios,
        activos_hoy: parseInt(statsResults[1].rows[0].usuarios_activos_hoy, 10),
        roles: roles,
        crecimiento: totalUsuarios > 0 ? Math.round((parseInt(statsResults[1].rows[0].usuarios_activos_hoy, 10) / totalUsuarios) * 100) : 0
      },
      
      // Eventos
      eventos: {
        total: totalEventos,
        proximos: parseInt(statsResults[3].rows[0].eventos_proximos, 10),
        en_curso: parseInt(statsResults[4].rows[0].eventos_en_curso, 10),
        finalizados: parseInt(statsResults[5].rows[0].eventos_finalizados, 10),
        cancelados: parseInt(statsResults[6].rows[0].eventos_cancelados, 10),
        cuota_promedio: parseFloat(statsResults[7].rows[0].cuota_promedio) || 0
      },
      
      // Pedidos
      pedidos: {
        total: totalPedidos,
        pendientes: parseInt(statsResults[8].rows[0].pedidos_pendientes, 10),
        entregados: pedidosEntregados,
        ingresos_totales: parseFloat(statsResults[11].rows[0].ingresos_totales),
        ticket_promedio: parseFloat(statsResults[12].rows[0].ticket_promedio) || 0,
        tasa_entrega: totalPedidos > 0 ? Math.round((pedidosEntregados / totalPedidos) * 100) : 0
      },
      
      // Productos
      productos: {
        activos: parseInt(statsResults[13].rows[0].productos_activos, 10),
        stock_bajo: parseInt(statsResults[14].rows[0].productos_stock_bajo, 10),
        sin_stock: parseInt(statsResults[15].rows[0].productos_sin_stock, 10)
      },
      
      // Inscripciones
      inscripciones: {
        total: parseInt(statsResults[16].rows[0].total_inscripciones, 10),
        confirmadas: parseInt(statsResults[17].rows[0].inscripciones_confirmadas, 10),
        tasa_confirmacion: parseInt(statsResults[16].rows[0].total_inscripciones, 10) > 0 ? 
          Math.round((parseInt(statsResults[17].rows[0].inscripciones_confirmadas, 10) / parseInt(statsResults[16].rows[0].total_inscripciones, 10)) * 100) : 0
      }
    };

    console.log('✅ Admin Dashboard Stats procesados:', stats);

    res.json({
      success: true,
      data: {
        stats: stats,
        recentUsers: recentUsers.rows,
        recentOrders: recentOrders.rows,
        recentEvents: recentEvents.rows,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ ERROR en getDashboardData:', error);
    console.error('Stack trace completo:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener datos del dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  } finally {
    client.release();
    console.log('🔓 Cliente de base de datos liberado');
  }
};
module.exports = {
  getDashboardData,
  getAllUsers,
  getAllEvents,
  updateUserRole,
  updateEventStatus,
  toggleFeaturedEvent,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getAllOrders,
  updateOrderStatus
};