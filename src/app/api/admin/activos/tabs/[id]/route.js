import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function POST(req, { params }) {
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
      query = `INSERT INTO activos_status (name,icono,tab ) VALUES ( ?,?,?)`;
      values = [name, icono, tab];
    }

    const [result] = await pool.query(query, values);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const query = `delete from activos_tabs WHERE id = ?`;
    const values = [id];

    const [result] = await pool.query(query, values);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
