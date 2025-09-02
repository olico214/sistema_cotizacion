import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req, { params }) {
  const { id } = await params;
  try {
    const data = await req.json();
    const { nombre, url, app, icon } = data;
    let query, values;
    // Actualizar perfil existente
    query = `UPDATE views SET page = ?, url = ?,apps=?,icon =? WHERE id = ?`;
    values = [nombre, url, app, icon, id];

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
    const query = `SELECT * FROM views`;

    const [result] = await pool.query(query, []);
    console.log(result);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
