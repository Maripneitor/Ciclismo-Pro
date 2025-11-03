const db = require('../db');
const crypto = require('crypto');

// Constantes para mensajes y códigos de error
const ERROR_MESSAGES = {
  TEAM_NOT_FOUND: 'Equipo no encontrado',
  ACCESS_DENIED: 'No tienes acceso a este equipo',
  UNAUTHORIZED: 'No autorizado',
  ALREADY_MEMBER: 'Ya eres miembro de este equipo',
  INVALID_INVITE: 'Enlace de invitación no válido',
  TEAM_NAME_EXISTS: 'Ya existe un equipo con este nombre. Por favor, elige otro.',
  NO_PERMISSION_CREATE: 'No tienes permiso para crear un equipo. Contacta a un administrador.',
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_INACTIVE: 'Tu cuenta no está activa. No puedes crear equipos.'
};

const SUCCESS_MESSAGES = {
  TEAM_CREATED: 'Equipo creado exitosamente',
  INVITE_GENERATED: 'Enlace de invitación generado exitosamente',
  JOINED_TEAM: 'Te has unido al equipo exitosamente',
  TEAM_RETRIEVED: 'Equipo obtenido exitosamente',
  TEAMS_RETRIEVED: 'Equipos obtenidos exitosamente'
};

// Límites de equipos por rol
const TEAM_LIMITS = {
  usuario: 5,
  organizador: 20,
  administrador: 50
};

// Helper para manejar errores de forma consistente
const handleError = (res, error, context) => {
  console.error(`Error en ${context}:`, error);
  
  // Manejar errores específicos de PostgreSQL
  if (error.code === '23505') { // Unique violation
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.TEAM_NAME_EXISTS
    });
  }

  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.USER_NOT_FOUND
    });
  }

  if (error.code === '22001') { // String data right truncation
    return res.status(400).json({
      success: false,
      message: 'El nombre o descripción es demasiado largo.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    error_code: error.code
  });
};

// Helper para verificar membresía
const verifyMembership = async (teamId, userId) => {
  try {
    const result = await db.query(
      'SELECT 1 FROM miembros_equipo WHERE id_equipo = $1 AND id_usuario = $2',
      [teamId, userId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error verificando membresía:', error);
    return false;
  }
};

// Helper para verificar si es capitán
const verifyCaptain = async (teamId, userId) => {
  try {
    const result = await db.query(
      'SELECT id_capitan FROM equipos WHERE id_equipo = $1',
      [teamId]
    );
    return result.rows.length > 0 && result.rows[0].id_capitan === userId;
  } catch (error) {
    console.error('Error verificando capitán:', error);
    return false;
  }
};

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    const result = await db.query(
      `SELECT 
        e.id_equipo,
        e.nombre,
        e.descripcion,
        e.id_capitan,
        e.fecha_creacion,
        e.enlace_invitacion,
        u.nombre_completo as nombre_capitan,
        (SELECT COUNT(*) FROM miembros_equipo me WHERE me.id_equipo = e.id_equipo) as total_miembros,
        (e.id_capitan = $1) as es_capitan
       FROM equipos e
       INNER JOIN usuarios u ON e.id_capitan = u.id_usuario
       WHERE e.id_equipo IN (
         SELECT id_equipo FROM miembros_equipo WHERE id_usuario = $1
       )
       ORDER BY e.fecha_creacion DESC`,
      [userId]
    );

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.TEAMS_RETRIEVED,
      data: result.rows
    });
  } catch (error) {
    handleError(res, error, 'getMyTeams');
  }
};

const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id_usuario;

    console.log('Team ID:', teamId, 'User ID:', userId);

    // Verificar que el usuario es miembro del equipo
    const isMember = await verifyMembership(teamId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.ACCESS_DENIED
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
        e.enlace_invitacion,
        u.nombre_completo as nombre_capitan,
        (e.id_capitan = $2) as es_capitan
       FROM equipos e
       INNER JOIN usuarios u ON e.id_capitan = u.id_usuario
       WHERE e.id_equipo = $1`,
      [teamId, userId]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.TEAM_NOT_FOUND
      });
    }

    // Obtener miembros del equipo
    const membersResult = await db.query(
      `SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo_electronico,
        u.url_imagen_perfil,
        me.fecha_union,
        (u.id_usuario = e.id_capitan) as es_capitan
       FROM miembros_equipo me
       INNER JOIN usuarios u ON me.id_usuario = u.id_usuario
       INNER JOIN equipos e ON me.id_equipo = e.id_equipo
       WHERE me.id_equipo = $1
       ORDER BY es_capitan DESC, me.fecha_union ASC`,
      [teamId]
    );

    const teamData = {
      ...teamResult.rows[0],
      miembros: membersResult.rows,
      total_miembros: membersResult.rows.length
    };

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.TEAM_RETRIEVED,
      data: teamData
    });
  } catch (error) {
    handleError(res, error, 'getTeamById');
  }
};

const createTeam = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { nombre, descripcion } = req.body;
    const id_capitan = req.user.id_usuario;
    const user_rol = req.user.rol;

    // ------ VALIDACIONES MEJORADAS ------
    // 1. Validación de campos requeridos
    if (!nombre || nombre.trim().length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El nombre del equipo es requerido'
      });
    }

    // 2. Validación de longitud del nombre
    if (nombre.trim().length < 3) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El nombre del equipo debe tener al menos 3 caracteres'
      });
    }

    // 3. Validación de longitud de descripción
    if (descripcion && descripcion.length > 500) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'La descripción no puede exceder los 500 caracteres'
      });
    }

    // 4. Verificar que el usuario existe y tiene permisos
    const userCheck = await client.query(
      `SELECT puede_crear_equipo, estado, nombre_completo 
       FROM usuarios WHERE id_usuario = $1`,
      [id_capitan]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    // 5. Verificar estado del usuario
    if (userCheck.rows[0].estado !== 'activo') {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.USER_INACTIVE
      });
    }

    // 6. Verificación de permisos (Lógica de Roles)
    const puedeCrearEquipo = userCheck.rows[0].puede_crear_equipo;
    if (user_rol === 'usuario' && !puedeCrearEquipo) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.NO_PERMISSION_CREATE
      });
    }

    // 7. Verificar límite de equipos por usuario (prevención de abuso)
    const teamCount = await client.query(
      'SELECT COUNT(*) FROM equipos WHERE id_capitan = $1',
      [id_capitan]
    );

    const maxTeams = TEAM_LIMITS[user_rol] || TEAM_LIMITS.usuario;
    
    if (parseInt(teamCount.rows[0].count) >= maxTeams) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: `Has alcanzado el límite máximo de equipos (${maxTeams}).`
      });
    }

    console.log('Creating team:', { 
      nombre: nombre.trim(), 
      descripcion: descripcion?.trim(), 
      id_capitan,
      user_rol,
      puede_crear_equipo: puedeCrearEquipo
    });

    // Crear equipo con valores sanitizados
    const teamResult = await client.query(
      `INSERT INTO equipos (nombre, descripcion, id_capitan)
       VALUES ($1, $2, $3) 
       RETURNING id_equipo, nombre, descripcion, id_capitan, fecha_creacion, enlace_invitacion`,
      [nombre.trim(), descripcion?.trim() || null, id_capitan]
    );
    
    const newTeam = teamResult.rows[0];

    // Agregar capitán como miembro
    await client.query(
      `INSERT INTO miembros_equipo (id_equipo, id_usuario) 
       VALUES ($1, $2)`,
      [newTeam.id_equipo, id_capitan]
    );
    
    await client.query('COMMIT');

    // Log de creación exitosa
    console.log(`Equipo creado exitosamente: ${newTeam.nombre} (ID: ${newTeam.id_equipo}) por usuario ${id_capitan}`);

    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.TEAM_CREATED,
      data: {
        ...newTeam,
        total_miembros: 1,
        es_capitan: true
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creando equipo:', error);

    // ------ MANEJO DE ERRORES ESPECÍFICOS ------
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.TEAM_NAME_EXISTS
      });
    }

    if (error.code === '23503') { // Foreign key violation
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    if (error.code === '22001') { // String data right truncation
      return res.status(400).json({
        success: false,
        message: 'El nombre o descripción es demasiado largo.'
      });
    }

    // Error genérico
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear el equipo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      error_code: error.code
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

    // Verificar que el usuario es el capitán del equipo
    const isCaptain = await verifyCaptain(teamId, userId);
    if (!isCaptain) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
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
      message: SUCCESS_MESSAGES.INVITE_GENERATED,
      data: {
        enlace_invitacion: token,
        equipo_id: teamId
      }
    });
  } catch (error) {
    handleError(res, error, 'generateInviteLink');
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
      `SELECT e.id_equipo, e.nombre, e.activo 
       FROM equipos e 
       WHERE e.enlace_invitacion = $1`,
      [enlace_invitacion]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_INVITE
      });
    }

    const teamId = teamResult.rows[0].id_equipo;
    const teamName = teamResult.rows[0].nombre;
    const teamActive = teamResult.rows[0].activo;

    // Verificar que el equipo esté activo
    if (!teamActive) {
      return res.status(400).json({
        success: false,
        message: 'Este equipo no está activo'
      });
    }

    // Verificar si el usuario ya es miembro del equipo
    const isMember = await verifyMembership(teamId, userId);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.ALREADY_MEMBER
      });
    }

    // Insertar al nuevo miembro
    await client.query(
      'INSERT INTO miembros_equipo (id_equipo, id_usuario) VALUES ($1, $2)',
      [teamId, userId]
    );

    await client.query('COMMIT');

    console.log(`Usuario ${userId} se unió al equipo ${teamName} (ID: ${teamId})`);

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.JOINED_TEAM,
      data: {
        equipo_id: teamId,
        equipo_nombre: teamName
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    handleError(res, error, 'joinTeam');
  } finally {
    client.release();
  }
};

// Función adicional: Eliminar equipo (solo capitán)
const deleteTeam = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const teamId = req.params.id;
    const userId = req.user.id_usuario;

    // Verificar que el usuario es el capitán del equipo
    const isCaptain = await verifyCaptain(teamId, userId);
    if (!isCaptain) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Solo el capitán puede eliminar el equipo'
      });
    }

    // Eliminar miembros del equipo primero
    await client.query(
      'DELETE FROM miembros_equipo WHERE id_equipo = $1',
      [teamId]
    );

    // Eliminar el equipo
    const result = await client.query(
      'DELETE FROM equipos WHERE id_equipo = $1 RETURNING nombre',
      [teamId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.TEAM_NOT_FOUND
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Equipo "${result.rows[0].nombre}" eliminado exitosamente`
    });
  } catch (error) {
    await client.query('ROLLBACK');
    handleError(res, error, 'deleteTeam');
  } finally {
    client.release();
  }
};

// Función adicional: Actualizar equipo (solo capitán)
const updateTeam = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const teamId = req.params.id;
    const userId = req.user.id_usuario;
    const { nombre, descripcion } = req.body;

    // Verificar que el usuario es el capitán del equipo
    const isCaptain = await verifyCaptain(teamId, userId);
    if (!isCaptain) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Solo el capitán puede actualizar el equipo'
      });
    }

    // Validaciones
    if (nombre && nombre.trim().length < 3) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El nombre del equipo debe tener al menos 3 caracteres'
      });
    }

    // Actualizar equipo
    const result = await client.query(
      `UPDATE equipos 
       SET nombre = COALESCE($1, nombre), 
           descripcion = COALESCE($2, descripcion),
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_equipo = $3
       RETURNING id_equipo, nombre, descripcion, id_capitan, fecha_creacion, fecha_actualizacion`,
      [nombre?.trim(), descripcion?.trim(), teamId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.TEAM_NOT_FOUND
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Equipo actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    handleError(res, error, 'updateTeam');
  } finally {
    client.release();
  }
};

module.exports = { 
  getMyTeams, 
  getTeamById, 
  createTeam,
  generateInviteLink,
  joinTeam,
  deleteTeam,
  updateTeam
};