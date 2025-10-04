// app.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const doctorsRouter = require('./routes/doctors');
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/doctors', doctorsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/appointments', appointmentsRouter);

// basic health
app.get('/', (req, res) => res.send('MediCare API running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
