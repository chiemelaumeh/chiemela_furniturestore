import dotenv from 'dotenv';
import mysql from 'mysql2';
dotenv.config();

//Local Environment
// export const pool = mysql
//   .createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'localdb',
//   })
//   .promise();

//Production Environment

const DATABASE_URL = process.env.DATABASE_URL;
export const pool = mysql.createPool(DATABASE_URL).promise();
// console.log(pool)