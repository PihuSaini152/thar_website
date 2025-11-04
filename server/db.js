const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12805966',
  password: "q8NiZBNaLp",
  database: 'sql12805966',
  port: 3306, 
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to database as id ' + connection.threadId);
});

module.exports = connection;