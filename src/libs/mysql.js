import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.locale' });
let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // deja vacío si no pusiste contraseña
    database: process.env.DB_NAME,
    multipleStatements: true,
    namedPlaceholders: true,
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default pool;
