import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.locale' });
let pool;

try {
  pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD, // deja vacío si no pusiste contraseña
    database: process.env.DATABASE,
    multipleStatements: true,
    namedPlaceholders: true,
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default pool;
