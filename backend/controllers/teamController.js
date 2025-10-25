const db = require('../db');

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    console.log('User ID:', userId);

    const result = await db.query(
      `SELECT 
        e.id_equipo,
        e.nombre,
        e.descripcion,
        e.id_capitan,
        e.fecha_creacion,
        u.nombre_completo as nombre_capitan
       FROM equipos e 
       INNER JOIN miembros_equipo me ON e.id_equipo = me.id_equipo 
       INNER JOIN usuarios u ON e.id_capitan = u.id_usuario
       WHERE me.id_usuario = $1 
       ORDER BY e.fecha_creacion DESC`,
      [userId]
    );

    console.log('Teams found:', result.rows.length);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo equipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id_usuario;

    console.log('Team ID:', teamId, 'User ID:', userId);

    // Verificar que el usuario es miembro del equipo
    const memberCheck = await db.query(
      'SELECT 1 FROM miembros_equipo WHERE id_equipo = $1 AND id_usuario = $2',
      [teamId, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este equipo'
      });
    }

    // Obtener detalles del equipo
    const teamResult = await db.query(
      `SELECT 
        e.id_equipo,
        e.nombre,
        e.descripcion,
        e.id_capitan,
        e.fecha_creacion,
        u.nombre_completo as nombre_capitan
       FROM equipos e
       INNER JOIN usuarios u ON e.id_capitan = u.id_usuario
       WHERE e.id_equipo = $1`,
      [teamId]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Obtener miembros del equipo
    const membersResult = await db.query(
      `SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo_electronico,
        me.fecha_union,
        (u.id_usuario = e.id_capitan) as es_capitan
       FROM miembros_equipo me
       INNER JOIN usuarios u ON me.id_usuario = u.id_usuario
       INNER JOIN equipos e ON me.id_equipo = e.id_equipo
       WHERE me.id_equipo = $1
       ORDER BY es_capitan DESC, me.fecha_union ASC`,
      [teamId]
    );

    res.json({
      success: true,
      data: {
        ...teamResult.rows[0],
        miembros: membersResult.rows
      }
    });
  } catch (error) {
    console.error('Error obteniendo equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const createTeam = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { nombre, descripcion } = req.body;
    const id_capitan = req.user.id_usuario;

    console.log('Creating team:', { nombre, descripcion, id_capitan });

    // Crear el equipo - usando 'descripcion' que es el nombre real en la BD
    const teamResult = await client.query(
      `INSERT INTO equipos (nombre, descripcion, id_capitan) 
       VALUES ($1, $2, $3) 
       RETURNING id_equipo, nombre, descripcion, id_capitan, fecha_creacion`,
      [nombre, descripcion, id_capitan]
    );

    const newTeam = teamResult.rows[0];

    // Agregar al capitán como miembro del equipo
    await client.query(
      `INSERT INTO miembros_equipo (id_equipo, id_usuario) 
       VALUES ($1, $2)`,
      [newTeam.id_equipo, id_capitan]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Equipo creado exitosamente',
      data: newTeam
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = { getMyTeams, getTeamById, createTeam };