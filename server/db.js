const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  user: 'wNMoHQ6vRPRqbSC.root',
  password: 'x7HFUsKrndP839u3',
  database: 'test',
  port: 4000,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed: ' + err.stack);
    return;
  }
  console.log('✅ Connected to database as id ' + connection.threadId);
});

module.exports = connection;