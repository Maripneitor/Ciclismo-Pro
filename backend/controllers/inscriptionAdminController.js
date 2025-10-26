const db = require('../db');

const updateInscriptionStatus = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const inscriptionId = req.params.id;
    const { estado } = req.body;
    const organizerId = req.user.id_usuario;

    console.log('=== UPDATE INSCRIPTION STATUS ===');
    console.log('Inscription ID:', inscriptionId);
    console.log('New status:', estado);
    console.log('Organizer ID:', organizerId);

    // Validaciones básicas
    if (!estado) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'El estado es requerido'
      });
    }

    // Verificación de propiedad (Doble seguridad)
    const ownershipCheck = await client.query(
      `SELECT e.id_organizador 
       FROM inscripciones i 
       JOIN eventos e ON i.id_evento = e.id_evento 
       WHERE i.id_inscripcion = $1`,
      [inscriptionId]
    );

    if (ownershipCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Inscripción no encontrada'
      });
    }

    const eventOwnerId = ownershipCheck.rows[0].id_organizador;

    if (eventOwnerId !== organizerId) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta inscripción'
      });
    }

    // Actualizar el estado
    const updatedInscription = await client.query(
      `UPDATE inscripciones 
       SET estado = $1, 
           ultima_actualizacion_gps = CURRENT_TIMESTAMP
       WHERE id_inscripcion = $2 
       RETURNING *`,
      [estado, inscriptionId]
    );

    await client.query('COMMIT');

    console.log('Inscription status updated successfully:', updatedInscription.rows[0]);

    res.json({
      success: true,
      message: `Estado de inscripción actualizado a: ${estado}`,
      data: updatedInscription.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error actualizando estado de inscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el estado',
      error: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  updateInscriptionStatus
};