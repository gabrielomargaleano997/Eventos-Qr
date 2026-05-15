const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const eventsRoutes = require('./routes/events');
app.use('/api/events', eventsRoutes);

app.get('/api', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});