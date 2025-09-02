import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, color, id } = data;
    let query, values;
    console.log(data);

    if (id > 0) {
      // Actualizar perfil existente
      query = `UPDATE activos_status SET name = ?, color=? WHERE id = ?`;
      values = [name, color, id];
    } else {
      // Insertar un nuevo perfil
      query = `INSERT INTO activos_status (name,color ) VALUES ( ?,?)`;
      values = [name, color];
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
    const query = `SELECT * FROM activos_status order by name asc`;

    const [result] = await pool.query(query, []);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
