import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, opciones } = data;


    // Obtener los registros actuales en la BD para este perfil
    const [rows] = await pool.query(
      `SELECT idPage FROM perfil_view WHERE idPerfil = ?`,
      [id]
    );

    // Convertir resultados en un array de IDs
    const idsEnBD = rows.map((row) => row.idPage);

    // Determinar qué registros agregar y cuáles eliminar
    const idsAAgregar = opciones.filter((opcion) => !idsEnBD.includes(opcion));
    const idsAEliminar = idsEnBD.filter((idPage) => !opciones.includes(idPage));

    // Agregar nuevas opciones
    if (idsAAgregar.length > 0) {
      const values = idsAAgregar.map((opcion) => [opcion, id]);
      await pool.query(`INSERT INTO perfil_view (idPage, idPerfil) VALUES ?`, [
        values,
      ]);
    }

    // Eliminar opciones que ya no están
    if (idsAEliminar.length > 0) {
      await pool.query(
        `DELETE FROM perfil_view WHERE idPerfil = ? AND idPage IN (?)`,
        [id, idsAEliminar]
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Operación completada correctamente",
      added: idsAAgregar,
      removed: idsAEliminar,
    });
  } catch (error) {
    console.error("Error en POST /api/perfiles:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
