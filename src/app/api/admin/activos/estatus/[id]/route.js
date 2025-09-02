import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req, { params }) {
  try {
    const data = await req.json();
    const { name, id } = data;
    let query, values;

    if (id > 0) {
      query = `UPDATE activos_status SET name = ? WHERE id = ?`;
      values = [name, id];
    } else {
      // Insertar un nuevo perfil
      query = `INSERT INTO activos_status (name ) VALUES ( ?)`;
      values = [name];
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
    const query = `delete from activos_status WHERE id = ?`;
    const values = [id];

    const [result] = await pool.query(query, values);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
