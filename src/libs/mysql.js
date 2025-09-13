import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.locale" });

let pool;

if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    waitForConnections: true,
    connectionLimit: 10, // máximo de conexiones abiertas
    queueLimit: 0,
    multipleStatements: true,
    namedPlaceholders: true,
  });

  console.log("✅ Pool de MySQL creado");
}

pool = global._mysqlPool;

export default pool;
