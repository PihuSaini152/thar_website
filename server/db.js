const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // XAMPP default (empty)
  database: 'thar_website'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to database as id ' + connection.threadId);
});

module.exports = connection;