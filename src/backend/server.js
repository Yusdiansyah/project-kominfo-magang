const express = require('express');
const pool = require('../components/db-connector.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.get('/api/unemployment_rate',async (req,res) => {
  try {
    const result = await pool.query("SELECT * from unemployment_rate")
    res.json({data: result.rows});
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
});

app.listen(3001,'0.0.0.0', () => console.log("Server Running on port 3001"));
