const pool = require('../db/connection');

const createEvent = async (req, res) => {
  const { name, date, location, description } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO events (user_id, name, date, location, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, date, location, description]
    );
    res.status(201).json({ message: 'Evento creado', event: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

const getEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM events WHERE user_id = $1 ORDER BY date ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

module.exports = { createEvent, getEvents };