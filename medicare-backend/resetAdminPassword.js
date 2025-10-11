// resetAdminPassword.js
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'medicare',
});

const resetAdminPassword = async () => {
  try {
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = "UPDATE users SET password = ? WHERE email = 'admin@medicare.com'";
    
    db.query(query, [hashedPassword], (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      
      if (result.affectedRows > 0) {
        console.log('✅ Admin password reset successfully!');
        console.log('📧 Email: admin@medicare.com');
        console.log('🔑 Password: password123');
      } else {
        console.log('❌ Admin user not found');
      }
      
      process.exit(0);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();