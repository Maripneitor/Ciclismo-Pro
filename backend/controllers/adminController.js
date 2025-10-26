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

module.exports = {
  getAllUsers,
  getAllEvents,
  updateUserRole
};