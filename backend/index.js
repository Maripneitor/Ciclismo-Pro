// backend/index.js (actualización)
const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inscriptionRoutes = require('./routes/inscriptionRoutes');
const teamRoutes = require('./routes/teamRoutes');
const dataRoutes = require('./routes/dataRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const inscriptionAdminRoutes = require('./routes/inscriptionAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

app.use('/api/eventos', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inscripciones', inscriptionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin/inscripciones', inscriptionAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', passwordRoutes);

// Middleware de error debe ir AL FINAL
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
});