const pool = require('./db.js');

async function testConnection() {
  try {
    console.log('Menghubungkan ke PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Koneksi ke PostgreSQL berhasil!');

    const sampleDataset1 = await client.query(`
      SELECT g.id, g.component_code, g.component_name, g.growth_type, g.growth_rate, t.period_label, r.region_name
      FROM gdp_data g
      JOIN dim_time t ON g.time_id = t.time_id
      JOIN dim_region r ON g.region_id = r.region_id
      WHERE g.dataset_id = 1
      LIMIT 5
    `);
    console.log('📊 Dataset 1 Sample:', sampleDataset1.rows);

    const sampleDataset3 = await client.query(`
      SELECT g.id, g.component_code, g.component_name, g.growth_type, g.growth_rate, t.period_label, r.region_name, g.value_constant_price, g.value_current_price
      FROM gdp_data g
      JOIN dim_time t ON g.time_id = t.time_id
      JOIN dim_region r ON g.region_id = r.region_id
      WHERE g.dataset_id = 3
      LIMIT 5
    `);
    console.log('📊 Dataset 3 Sample:', sampleDataset3.rows);

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Gagal koneksi atau query:', err.message);
  }
}

testConnection();
