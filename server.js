const express = require('express');
const app = express();

app.get('/prueba', (req, res) => res.send('Hola'));

app.listen(3000, () => console.log('Server en 3000'));