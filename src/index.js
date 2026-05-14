const express = require('express');
const path = require('path');
const pool = require('./db/connection');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});