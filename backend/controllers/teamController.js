const db = require('../db');
const crypto = require('crypto');

const getMyTeams = async (req, res) => {
  // ... código existente sin cambios
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

    // Obtener detalles del equipo - CORREGIDO: usar id_captian (con 't')
    const teamResult = await db.query(
      `SELECT 
        e.id_equipo,
        e.nombre,
        e.descripcion,
        e.id_captian,  // CORREGIDO: id_captian con 't'
        e.fecha_creacion,
        e.enlace_invitacion,
        u.nombre_completo as nombre_capitan
       FROM equipos e
       INNER JOIN usuarios u ON e.id_captian = u.id_usuario  // CORREGIDO: id_captian con 't'
       WHERE e.id_equipo = $1`,
      [teamId]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    // Obtener miembros del equipo - CORREGIDO: usar id_captian (con 't')
    const membersResult = await db.query(
      `SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo_electronico,
        me.fecha_union,
        (u.id_usuario = e.id_captian) as es_capitan  // CORREGIDO: id_captian con 't'
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
    const id_captian = req.user.id_usuario;  // CORREGIDO: id_captian con 't'

    console.log('Creating team:', { nombre, descripcion, id_captian });

    // Crear el equipo - CORREGIDO: usar id_captian (con 't')
    const teamResult = await client.query(
      `INSERT INTO equipos (nombre, descripcion, id_captian)  // CORREGIDO: id_captian con 't'
       VALUES ($1, $2, $3) 
       RETURNING id_equipo, nombre, descripcion, id_captian, fecha_creacion`,  // CORREGIDO: id_captian con 't'
      [nombre, descripcion, id_captian]
    );

    const newTeam = teamResult.rows[0];

    // Agregar al capitán como miembro del equipo
    await client.query(
      `INSERT INTO miembros_equipo (id_equipo, id_usuario) 
       VALUES ($1, $2)`,
      [newTeam.id_equipo, id_captian]
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

const generateInviteLink = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id_usuario;

    console.log('=== GENERATE INVITE LINK DEBUG ===');
    console.log('Team ID from params:', teamId);
    console.log('User ID from token:', userId);

    // Verificar que el usuario es el capitán del equipo - CORREGIDO: usar id_captian (con 't')
    const teamResult = await db.query(
      'SELECT id_captian FROM equipos WHERE id_equipo = $1',  // CORREGIDO: id_captian con 't'
      [teamId]
    );

    if (teamResult.rows.length === 0) {
      console.log('Team not found for ID:', teamId);
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado'
      });
    }

    const captainId = teamResult.rows[0].id_captian;  // CORREGIDO: id_captian con 't'
    console.log('Team captain ID:', captainId);
    console.log('Is user captain?', captainId === userId);

    if (captainId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado - Solo el capitán puede generar enlaces de invitación'
      });
    }

    // Generar token único
    const token = crypto.randomUUID();
    console.log('Generated token:', token);

    // Guardar el token en la base de datos
    await db.query(
      'UPDATE equipos SET enlace_invitacion = $1 WHERE id_equipo = $2',
      [token, teamId]
    );

    console.log('Token saved successfully');

    res.json({
      success: true,
      message: 'Enlace de invitación generado exitosamente',
      data: {
        enlace_invitacion: token
      }
    });
  } catch (error) {
    console.error('Error generando enlace de invitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const joinTeam = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { enlace_invitacion } = req.body;
    const userId = req.user.id_usuario;

    console.log('Joining team with invite link:', enlace_invitacion, 'by user:', userId);

    if (!enlace_invitacion) {
      return res.status(400).json({
        success: false,
        message: 'Enlace de invitación requerido'
      });
    }

    // Buscar el equipo por el enlace de invitación
    const teamResult = await client.query(
      'SELECT id_equipo FROM equipos WHERE enlace_invitacion = $1',
      [enlace_invitacion]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enlace de invitación no válido'
      });
    }

    const teamId = teamResult.rows[0].id_equipo;

    // Verificar si el usuario ya es miembro del equipo
    const memberCheck = await client.query(
      'SELECT * FROM miembros_equipo WHERE id_equipo = $1 AND id_usuario = $2',
      [teamId, userId]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya eres miembro de este equipo'
      });
    }

    // Insertar al nuevo miembro
    await client.query(
      'INSERT INTO miembros_equipo (id_equipo, id_usuario) VALUES ($1, $2)',
      [teamId, userId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Te has unido al equipo exitosamente'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error uniéndose al equipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = { 
  getMyTeams, 
  getTeamById, 
  createTeam,
  generateInviteLink,
  joinTeam
};