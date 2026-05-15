const pool = require('./src/db/connection');
require('dotenv').config();

const crear = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accesos (
        id SERIAL PRIMARY KEY,
        evento_id INTEGER NOT NULL,
        fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valido BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('✅ Tabla accesos creada');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

crear();