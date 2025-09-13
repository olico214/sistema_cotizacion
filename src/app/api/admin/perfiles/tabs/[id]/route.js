import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, opciones } = data;

    if (!id || !Array.isArray(opciones)) {
      return NextResponse.json(
        { ok: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }


    // Obtener los registros actuales en la BD para este perfil
    const [rows] = await pool.query(
      `SELECT idTabs FROM activos_tabs_perfil WHERE idPerfil = ?`,
      [id]
    );

    // Convertir resultados en un array de IDs
    const idsEnBD = rows.map((row) => row.idTabs);

    // Determinar qué registros agregar y cuáles eliminar
    const idsAAgregar = opciones.filter((opcion) => !idsEnBD.includes(opcion));
    const idsAEliminar = idsEnBD.filter((idTabs) => !opciones.includes(idTabs));

    // Agregar nuevas opciones
    if (idsAAgregar.length > 0) {
      const placeholders = idsAAgregar.map(() => "(?, ?)").join(", ");
      const values = idsAAgregar.flatMap((opcion) => [opcion, id]);

      await pool.query(
        `INSERT INTO activos_tabs_perfil (idTabs, idPerfil) VALUES ${placeholders}`,
        values
      );
    }

    // Eliminar opciones que ya no están
    if (idsAEliminar.length > 0) {
      await pool.query(
        `DELETE FROM activos_tabs_perfil WHERE idPerfil = ? AND idTabs IN (${idsAEliminar
          .map(() => "?")
          .join(", ")})`,
        [id, ...idsAEliminar]
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
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
