import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, descripcion, id } = data;
    let query, values;

    if (id > 0) {
      // Actualizar perfil existente
      query = `UPDATE admin_Permission_name SET name = ?, description = ? WHERE id = ?`;
      values = [name, descripcion, id];
    } else {
      // Insertar un nuevo perfil
      query = `INSERT INTO admin_Permission_name (name,description ) VALUES (?, ?)`;
      values = [name, descripcion];
    }

    const [result] = await pool.query(query, values);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

export async function GET(req) {
  try {
    // Actualizar perfil existente
    const query = `SELECT * FROM admin_Permission_name`;

    const [result] = await pool.query(query, []);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
