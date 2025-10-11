// setupDatabase.js
const mysql = require('mysql2');
require('dotenv').config();

// Create connection without specifying database first
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    connection.query('CREATE DATABASE IF NOT EXISTS medicare', (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('✅ Database "medicare" created or already exists');
      resolve();
    });
  });
};

const setupDatabase = async () => {
  try {
    await createDatabase();
    
    // Switch to medicare database for table creation
    const db = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'medicare',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create tables in CORRECT ORDER
    console.log('🗃️ Creating tables...');
    
    // 1. Create users table first
    await new Promise((resolve, reject) => {
      const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          role ENUM('patient', 'admin') DEFAULT 'patient',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      db.query(usersTable, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Users table created');
          resolve();
        }
      });
    });

    // 2. Create doctors table
    await new Promise((resolve, reject) => {
      const doctorsTable = `
        CREATE TABLE IF NOT EXISTS doctors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          specialty VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      db.query(doctorsTable, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Doctors table created');
          resolve();
        }
      });
    });

    // 3. Create services table
    await new Promise((resolve, reject) => {
      const servicesTable = `
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      db.query(servicesTable, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Services table created');
          resolve();
        }
      });
    });

    // 4. Create appointments table LAST
    await new Promise((resolve, reject) => {
      const appointmentsTable = `
        CREATE TABLE IF NOT EXISTS appointments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          doctor VARCHAR(100) NOT NULL,
          date DATE NOT NULL,
          time TIME NOT NULL,
          status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
          user_id INT NULL,
          doctor_id INT NULL,
          reason TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
        )`;
      db.query(appointmentsTable, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Appointments table created');
          resolve();
        }
      });
    });

    // Insert sample data
    console.log('📥 Inserting sample data...');
    
    // Check if data already exists to avoid duplicates
    const checkTableCount = (tableName) => {
      return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) as count FROM ${tableName}`, (err, results) => {
          if (err) reject(err);
          else resolve(results[0].count);
        });
      });
    };

    const doctorsCount = await checkTableCount('doctors');
    const servicesCount = await checkTableCount('services');
    const usersCount = await checkTableCount('users');

    // Insert doctors only if table is empty
    if (doctorsCount === 0) {
      await new Promise((resolve, reject) => {
        const insertDoctors = `
          INSERT INTO doctors (name, specialty, email, phone) VALUES 
          ('Dr. Mohamed Ali', 'Cardiology', 'dr.mohamed@medicare.com', '+252-61-1234567'),
          ('Dr. Aisha Hassan', 'Pediatrics', 'dr.aisha@medicare.com', '+252-61-2345678'),
          ('Dr. Omar Ahmed', 'Dermatology', 'dr.omar@medicare.com', '+252-61-3456789'),
          ('Dr. Fatima Abdi', 'Orthopedics', 'dr.fatima@medicare.com', '+252-61-4567890')`;
        db.query(insertDoctors, (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Sample doctors inserted');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Doctors already exist, skipping insertion');
    }

    // Insert services only if table is empty
    if (servicesCount === 0) {
      await new Promise((resolve, reject) => {
        const insertServices = `
          INSERT INTO services (name, description) VALUES 
          ('General Check-up', 'Comprehensive health examination'),
          ('Cardiology Consultation', 'Heart and cardiovascular care'),
          ('Pediatric Care', 'Child healthcare services'),
          ('Dermatology Treatment', 'Skin condition diagnosis and treatment')`;
        db.query(insertServices, (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Sample services inserted');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Services already exist, skipping insertion');
    }

    // Insert admin user only if not exists
    if (usersCount === 0) {
      await new Promise((resolve, reject) => {
        const insertAdmin = `
          INSERT INTO users (name, email, password, role) VALUES 
          ('Admin User', 'admin@medicare.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')`;
        db.query(insertAdmin, (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Admin user inserted');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Users already exist, skipping admin insertion');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 All tables are ready with unique data');
    console.log('👤 Default admin: admin@medicare.com / password: password123');
    
    connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();