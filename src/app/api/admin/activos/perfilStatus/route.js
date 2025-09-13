import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function POST(req) {
  try {
    const data = await req.json();
    const { number, id } = data;

    // Obtener los registros actuales en la BD para el idPerfil
    const [existing] = await pool.query(
      "SELECT idStatus FROM activos_perfiles_status WHERE idPerfil = ?",
      [id]
    );

    const existingStatuses = new Set(existing.map((row) => row.idStatus));
    const newStatuses = new Set(number);

    // Insertar los que están en `number` pero no en la BD
    for (const status of newStatuses) {
      if (!existingStatuses.has(status)) {
        await pool.query(
          "INSERT INTO activos_perfiles_status (idPerfil, idStatus) VALUES (?, ?)",
          [id, status]
        );
      }
    }

    // Eliminar los que están en la BD pero no en `number`
    for (const status of existingStatuses) {
      if (!newStatuses.has(status)) {
        await pool.query(
          "DELETE FROM activos_perfiles_status WHERE idPerfil = ? AND idStatus = ?",
          [id, status]
        );
      }
    }

    return NextResponse.json({ ok: true, message: "Actualización exitosa" });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
export async function GET(req) {
  try {
    // Actualizar perfil existente
    const query = `SELECT * FROM activos_status`;

    const [result] = await pool.query(query, []);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
