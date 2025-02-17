// test-db.js
const { Pool } = require('pg');  // Import the pg module

// Test PostgreSQL connection
const pool = new Pool({
  user: 'myappuser',         // Database username
  host: 'localhost',        // Database server
  database: 'myappdb', // Database name
  password: 'mypassword',// Database password
  port: 5432,               // Default PostgreSQL port
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Error connecting to PostgreSQL:', err);
  } else {
    console.log('PostgreSQL connection test successful:', res.rows);
  }
  pool.end();
});

