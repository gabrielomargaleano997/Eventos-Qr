const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Raiz funciona');
});

app.get('/test', (req, res) => {
  res.send('Test funciona');
});

app.listen(4000, () => {
  console.log('Servidor en puerto 4000');
});