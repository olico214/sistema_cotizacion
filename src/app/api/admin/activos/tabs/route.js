import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, icono, tab, id } = data;
    let query, values;

    if (id > 0) {
      // Actualizar perfil existente
      query = `UPDATE activos_tabs SET name = ?, icono=?,tab=? WHERE id = ?`;
      values = [name, icono, id];
    } else {
      // Insertar un nuevo perfil
      query = `INSERT INTO activos_tabs (name,icono,tab ) VALUES ( ?,?,?)`;
      values = [name, icono, tab];
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
    const query = `SELECT * FROM activos_tabs`;

    const [result] = await pool.query(query, []);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
