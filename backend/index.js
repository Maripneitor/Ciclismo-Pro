const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inscriptionRoutes = require('./routes/inscriptionRoutes');
const teamRoutes = require('./routes/teamRoutes');
const dataRoutes = require('./routes/dataRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const inscriptionAdminRoutes = require('./routes/inscriptionAdminRoutes'); // NUEVA IMPORTACIÓN

app.use('/api/eventos', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inscripciones', inscriptionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin/inscripciones', inscriptionAdminRoutes); // NUEVA RUTA

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
});