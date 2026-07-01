const express = require('express');
const cors = require('cors');
const pool = require('./db.js');

const app = express();
app.use(cors());

app.get('/api/unemployment_rate', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM unemployment_rate");
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get('/api/gdp_datasets', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dataset WHERE topic = 'gdp' ORDER BY dataset_id ASC");
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get('/api/gdp_data', async (req, res) => {
  try {
    const { dataset_id } = req.query;
    let query = `
      SELECT 
        g.*, 
        d.topic, 
        d.var_label, 
        t.year, 
        t.quarter, 
        t.month, 
        t.period_label, 
        r.region_name, 
        r.region_code
      FROM gdp_data g
      JOIN dataset d ON g.dataset_id = d.dataset_id
      JOIN dim_time t ON g.time_id = t.time_id
      JOIN dim_region r ON g.region_id = r.region_id
    `;
    const params = [];
    if (dataset_id) {
      query += ` WHERE g.dataset_id = $1`;
      params.push(dataset_id);
    }
    query += ` ORDER BY g.component_code ASC`;
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Running on port ${PORT}`);
});
