import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function POST(req, { params }) {
  const { id } = await params; // id del modelo
  try {
    const data = await req.json(); // Datos enviados desde el frontend
    console.log(data);
    const connection = await pool.getConnection();

    // Obtener las descripciones actuales de la base de datos
    const [currentDescriptions] = await connection.query(
      "SELECT id, opciones FROM activos_status_opciones WHERE idestatus = ?",
      [id]
    );

    // Crear un mapa de las descripciones actuales para facilitar la búsqueda
    const currentDescriptionsMap = new Map(
      currentDescriptions.map((desc) => [desc.id, desc.opciones])
    );

    // Procesar cada descripción en los datos enviados
    for (const item of data) {
      if (item.id === null) {
        // Insertar nueva descripción si no tiene id
        const insertQuery = `INSERT INTO activos_status_opciones (idestatus, opciones) VALUES (?, ?)`;
        await connection.query(insertQuery, [id, item.opciones]);
      } else if (currentDescriptionsMap.has(item.id)) {
        // Actualizar descripción si ya existe
        const updateQuery = `UPDATE activos_status_opciones SET opciones = ? WHERE id = ?`;
        await connection.query(updateQuery, [item.opciones, item.id]);
        // Eliminar del mapa para no borrarlo después
        currentDescriptionsMap.delete(item.id);
      }
    }

    // Borrar descripciones que ya no están en los datos enviados
    for (const [idToDelete] of currentDescriptionsMap) {
      const deleteQuery = `DELETE FROM activos_status_opciones WHERE id = ?`;
      await connection.query(deleteQuery, [idToDelete]);
    }

    connection.release();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const connection = await pool.getConnection();

    // Insertar el nodo principal en la base de datos
    const query = `select * from  activos_status_opciones   where idestatus=?`;
    const [result] = await connection.query(query, [id]);

    connection.release();

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const connection = await pool.getConnection();

    // Insertar el nodo principal en la base de datos
    const query = `DELETE FROM  activos_status_opciones  WHERE id = ?`;
    const [result] = await connection.query(query, [id]);
    const newNodeId = result.insertId;

    connection.release();

    return NextResponse.json({ ok: true, id: newNodeId });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
