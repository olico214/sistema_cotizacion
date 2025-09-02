import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, nombre, descripcion, status } = data;

    console.log(data);

    let query, values;

    if (id > 0) {
      // Actualizar perfil existente
      query = `UPDATE perfiles SET name = ?, descripcion = ?,status=? WHERE id = ?`;
      values = [nombre, descripcion, status, id];
    } else {
      // Insertar un nuevo perfil
      query = `INSERT INTO perfiles (name, descripcion,status) VALUES (?, ?, ?)`;
      values = [nombre, descripcion, status];
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
    const query = `SELECT * FROM perfiles`;

    const [result] = await pool.query(query, []);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
