import { NextResponse } from "next/server";
import pool from "@/libs/mysql";
export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const connection = await pool.getConnection();

    const query = `
     SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT('id', t0.id, 'Father_Name', t0.Father_Name, 'Mother_Name', t0.Mother_Name, 'Name', t0.Name)
    ) AS profiles,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', p.id, 'Father_Name', p.Father_Name, 'Mother_Name', p.Mother_Name, 'Name', p.Name)
        )
        FROM Profile p
        LEFT JOIN admin_groups_users agu ON p.id = agu.idProfile
        WHERE agu.idGroup = ?
    ) AS selecteds
FROM Profile t0;

    `;

    const [result] = await connection.query(query, [id]);


    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

export async function POST(req, { params }) {
  const data = await req.json();
  const { selectedUsers } = data;
  const { id } = await params;

  try {
    const connection = await pool.getConnection();

    // 1. Obtener los usuarios actualmente en la BD para este grupo
    const [existingUsers] = await connection.query(
      `SELECT idProfile FROM admin_groups_users WHERE idGroup = ?`,
      [id]
    );

    const existingIds = new Set(existingUsers.map((user) => user.idProfile)); // IDs en la BD
    const selectedIds = new Set(selectedUsers.map((user) => user.id)); // IDs en la petición

    // 2. Insertar solo los que no existan en la BD
    for (let user of selectedUsers) {
      if (!existingIds.has(user.id)) {
        await connection.query(
          `INSERT INTO admin_groups_users (idGroup, idProfile) VALUES (?, ?)`,
          [id, user.id]
        );
      }
    }

    // 3. Eliminar los que están en la BD pero no en `selectedUsers`
    for (let user of existingUsers) {
      if (!selectedIds.has(user.idProfile)) {
        await connection.query(
          `DELETE FROM admin_groups_users WHERE idGroup = ? AND idProfile = ?`,
          [id, user.idProfile]
        );
      }
    }


    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
