const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/connection');
const QRCode = require('qrcode');

// POST /api/events - Crear evento
router.post('/', auth, async (req, res) => {
  try {
    const { name, date, location, description } = req.body;

    if (!name || !date) {
      return res.status(400).json({ error: 'Nombre y fecha son obligatorios' });
    }

    const result = await pool.query(
      'INSERT INTO events (user_id, name, date, location, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, name, date, location, description]
    );

    res.status(201).json({ message: 'Evento creado con éxito', evento: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/events - Traer eventos del usuario
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, COUNT(a.id) as accesos 
       FROM events e 
       LEFT JOIN accesos a ON e.id = a.evento_id 
       WHERE e.user_id = $1 
       GROUP BY e.id 
       ORDER BY e.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/events/:id/qr - Generar QR de un evento
router.get('/:id/qr', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const evento = result.rows[0];
    const qrData = `http://192.168.0.236:3000/validar.html?id=${evento.id}`;
    const qrImage = await QRCode.toDataURL(qrData);

    res.json({ qr: qrImage, evento });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar QR' });
  }
});
// POST /api/events/:id/validar - Validar acceso por QR
router.post('/:id/validar', async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await pool.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );

    if (evento.rows.length === 0) {
      return res.status(404).json({ valido: false, mensaje: 'Evento no encontrado' });
    }

    await pool.query(
      'INSERT INTO accesos (evento_id) VALUES ($1)',
      [id]
    );

    res.json({ valido: true, mensaje: 'Acceso válido', evento: evento.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ valido: false, mensaje: 'Error al validar' });
  }
});
// DELETE /api/events/:id - Eliminar evento
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento eliminado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});
module.exports = router;