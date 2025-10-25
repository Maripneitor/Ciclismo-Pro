const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = require('./db');

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error conectando a la base de datos',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
});