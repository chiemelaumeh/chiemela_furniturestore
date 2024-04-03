import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

export const pool = mysql.createPool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,

  }).promise();
  



