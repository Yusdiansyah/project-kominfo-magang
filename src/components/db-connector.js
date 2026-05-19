const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
require('dotenv').config({path: '../../.env'});
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  port : process.env.DB_PORT,
});

module.exports = pool;
