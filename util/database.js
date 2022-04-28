const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.NODE_DB_HOST || '192.168.0.1',
  user: process.env.NODE_DB_USERNAME || 'auto',
  database: process.env.NODE_DB_DATABASE || 'auto_bank',
  password: process.env.NODE_DB_PASSWORD || 'Q1w2e3qwe'
});

module.exports = pool.promise();