import { NextResponse } from "next/server";
import pool from "@/libs/mysql";
export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const connection = await pool.getConnection();

    const query = `SELECT DISTINCT t1.* 
FROM admin_groups_users t0
LEFT JOIN admin_groups t1 ON t0.idGroup = t1.id;
`;

    const [result] = await connection.query(query, [id]);

    const [existingUsers] = await connection.query(
      `SELECT idGroup FROM admin_groups_perfiles WHERE idProfile = ?`,
      [id]
    );

    console.log(existingUsers);
    connection.release();
    return NextResponse.json({ ok: true, result, existingUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

export async function POST(req, { params }) {
  const data = await req.json();
  const { selected } = data; // `selected` es un array con los `idGroup` seleccionados
  const { id } = await params; // `id` es el idProfile

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Obtener los grupos actualmente asociados a este perfil (idProfile)
    const [existingUsers] = await connection.query(
      `SELECT idGroup FROM admin_groups_perfiles WHERE idProfile = ?`,
      [id]
    );

    const existingIds = new Set(existingUsers.map((user) => user.idGroup)); // Set de idGroup en BD
    const selectedIds = new Set(selected); // Set de idGroup en la petición

    // 2. Insertar solo los grupos que no existan en la BD
    for (const groupId of selectedIds) {
      if (!existingIds.has(groupId)) {
        await connection.query(
          `INSERT INTO admin_groups_perfiles (idProfile, idGroup) VALUES (?, ?)`,
          [id, groupId]
        );
      }
    }

    // 3. Eliminar los grupos que ya no están en la selección
    for (const user of existingUsers) {
      if (!selectedIds.has(user.idGroup)) {
        await connection.query(
          `DELETE FROM admin_groups_perfiles WHERE idProfile = ? AND idGroup = ?`,
          [id, user.idGroup]
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json({ ok: false, error: error.message });
  } finally {
    if (connection) connection.release(); // Liberar la conexión siempre
  }
}
