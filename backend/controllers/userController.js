const db = require('../db');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    const result = await db.query(
      `SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo_electronico,
        u.rol,
        u.fecha_creacion,
        dc.id_ciclista,
        dc.fecha_nacimiento,
        dc.genero,
        dc.contacto_emergencia,
        dc.telefono_emergencia,
        dc.talla_playera,
        dc.tipo_bicicleta,
        dc.nivel_experiencia,
        dc.alergias,
        dc.condiciones_medicas,
        dc.direccion,
        dc.ciudad,
        dc.pais,
        dc.codigo_postal,
        dc.marca_bicicleta,
        dc.modelo_bicicleta,
        dc.ano_bicicleta,
        dc.talla_bicicleta,
        dc.fecha_actualizacion
       FROM usuarios u
       LEFT JOIN datos_ciclista dc ON u.id_usuario = dc.id_usuario
       WHERE u.id_usuario = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const updateUserProfile = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    const userId = req.user.id_usuario;

    const {
      nombre_completo,
      fecha_nacimiento,
      genero,
      contacto_emergencia,
      telefono_emergencia,
      talla_playera,
      tipo_bicicleta,
      nivel_experiencia,
      alergias,
      condiciones_medicas,
      direccion,
      ciudad,
      pais,
      codigo_postal,
      marca_bicicleta,
      modelo_bicicleta,
      ano_bicicleta,
      talla_bicicleta
    } = req.body;

    await client.query(
      'UPDATE usuarios SET nombre_completo = $1 WHERE id_usuario = $2',
      [nombre_completo, userId]
    );

    await client.query(
      `INSERT INTO datos_ciclista (
        id_usuario, fecha_nacimiento, genero, contacto_emergencia, telefono_emergencia,
        talla_playera, tipo_bicicleta, nivel_experiencia, alergias, condiciones_medicas,
        direccion, ciudad, pais, codigo_postal, marca_bicicleta, modelo_bicicleta,
        ano_bicicleta, talla_bicicleta, fecha_actualizacion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP)
      ON CONFLICT (id_usuario) DO UPDATE SET
        fecha_nacimiento = EXCLUDED.fecha_nacimiento,
        genero = EXCLUDED.genero,
        contacto_emergencia = EXCLUDED.contacto_emergencia,
        telefono_emergencia = EXCLUDED.telefono_emergencia,
        talla_playera = EXCLUDED.talla_playera,
        tipo_bicicleta = EXCLUDED.tipo_bicicleta,
        nivel_experiencia = EXCLUDED.nivel_experiencia,
        alergias = EXCLUDED.alergias,
        condiciones_medicas = EXCLUDED.condiciones_medicas,
        direccion = EXCLUDED.direccion,
        ciudad = EXCLUDED.ciudad,
        pais = EXCLUDED.pais,
        codigo_postal = EXCLUDED.codigo_postal,
        marca_bicicleta = EXCLUDED.marca_bicicleta,
        modelo_bicicleta = EXCLUDED.modelo_bicicleta,
        ano_bicicleta = EXCLUDED.ano_bicicleta,
        talla_bicicleta = EXCLUDED.talla_bicicleta,
        fecha_actualizacion = EXCLUDED.fecha_actualizacion`,
      [
        userId, fecha_nacimiento, genero, contacto_emergencia, telefono_emergencia,
        talla_playera, tipo_bicicleta, nivel_experiencia, alergias, condiciones_medicas,
        direccion, ciudad, pais, codigo_postal, marca_bicicleta, modelo_bicicleta,
        ano_bicicleta, talla_bicicleta
      ]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = { getUserProfile, updateUserProfile };