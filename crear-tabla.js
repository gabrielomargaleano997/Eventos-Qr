const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const crearTabla = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      name VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      location VARCHAR(200),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(sql);
    console.log('✅ Tabla "events" creada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Mensaje:', error.message);
    process.exit(1);
  }
};

crearTabla();