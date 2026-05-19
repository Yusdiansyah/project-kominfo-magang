// test-db.js
require('dotenv').config({ path: '../../.env' }); // sesuaikan path
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Koneksi ke PostgreSQL berhasil!');
    
    // Coba baca data dari tabel yang diinginkan
    const res = await client.query('SELECT * FROM unemployment_rate LIMIT 5');
    console.log('📊 Contoh data:', res.rows);
    
    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Gagal koneksi atau query:', err.message);
  }
}

testConnection();
