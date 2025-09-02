import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req) {
  try {
    const data = await req.json();
    const { nombre, url, app, icon } = data;
    const visible = 1;
    const queryAll = `select * from  views where apps = ?`;
    const [resultAll] = await pool.query(queryAll, [app]);
    const position = parseInt(resultAll.length) + 1;
    let query, values;
    query = `INSERT INTO views (page,url,apps,icon,visible,position ) VALUES (?, ?, ?,?,?,?)`;
    values = [nombre, url, app, icon, visible, position];
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
