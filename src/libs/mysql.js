import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.locale" });

let pool;

// 🔹 Función que crea un pool nuevo
function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    namedPlaceholders: true,
  });
}

// 🔹 Inicializa pool global para desarrollo (evita duplicar pools en hot reload)
if (!globalThis._mysqlPool) {
  globalThis._mysqlPool = createPool();
  console.log("✅ Pool MySQL inicializado");
}

pool = globalThis._mysqlPool;

// 🔹 Función para validar/recrear pool
async function ensurePool() {
  try {
    const conn = await pool.getConnection();
    conn.release();
  } catch (err) {
    console.warn("⚠️ Pool roto, recreando...", err.message);
    pool = createPool();
    globalThis._mysqlPool = pool;
  }
}

// 🔹 Wrapper seguro de query con retry automático
async function safeQuery(sql, values = [], retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await ensurePool(); // validar pool antes de ejecutar
      return await pool.query(sql, values); // devuelve [rows, fields]
    } catch (err) {
      const recoverable = ["PROTOCOL_CONNECTION_LOST", "ECONNRESET", "ETIMEDOUT"];
      if (recoverable.includes(err.code)) {
        console.warn(`⚠️ Query falló por ${err.code}, reintentando (${attempt + 1})`);
        attempt++;
        continue; // reintenta
      } else {
        throw err; // error no recuperable
      }
    }
  }
  throw new Error(`❌ Query falló después de ${retries} intentos: ${sql}`);
}

// 🔹 Exportamos pool original y safeQuery
export default pool;
export { safeQuery };
