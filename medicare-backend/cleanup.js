// cleanup.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'medicare',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const cleanupDatabase = async () => {
  try {
    console.log('🧹 Cleaning up duplicate data...');
    
    // Delete duplicate doctors
    await new Promise((resolve, reject) => {
      const cleanDoctors = `
        DELETE d1 FROM doctors d1
        INNER JOIN doctors d2 
        WHERE 
          d1.id > d2.id AND 
          d1.name = d2.name AND 
          d1.specialty = d2.specialty
      `;
      db.query(cleanDoctors, (err, result) => {
        if (err) reject(err);
        else {
          console.log(`✅ Removed duplicate doctors`);
          resolve();
        }
      });
    });

    // Delete duplicate services
    await new Promise((resolve, reject) => {
      const cleanServices = `
        DELETE s1 FROM services s1
        INNER JOIN services s2 
        WHERE 
          s1.id > s2.id AND 
          s1.name = s2.name
      `;
      db.query(cleanServices, (err, result) => {
        if (err) reject(err);
        else {
          console.log(`✅ Removed duplicate services`);
          resolve();
        }
      });
    });

    // Reset auto-increment counters
    await new Promise((resolve, reject) => {
      db.query('ALTER TABLE doctors AUTO_INCREMENT = 1', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Add to cleanup.js - Duplicate appointments cleanup
    await new Promise((resolve, reject) => {
      const cleanAppointments = `
        DELETE a1 FROM appointments a1
        INNER JOIN appointments a2 
        WHERE 
          a1.id > a2.id AND 
          a1.patient_name = a2.patient_name AND 
          a1.email = a2.email AND 
          a1.doctor = a2.doctor AND 
          a1.date = a2.date AND 
          a1.time = a2.time
      `;
      db.query(cleanAppointments, (err, result) => {
        if (err) reject(err);
        else {
          console.log(`✅ Removed duplicate appointments`);
          resolve();
        }
      });
    });
    console.log('🎉 Database cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
};

cleanupDatabase();