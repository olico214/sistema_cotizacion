import { NextResponse } from "next/server";
import pool from "@/libs/mysql"; // Asegúrate de que la ruta a tu conexión de BD sea correcta

/**
 * @description Obtiene todas las condiciones generales, ordenadas por el campo 'orden'.
 */
export async function GET() {
    try {
        const connection = await pool.getConnection();
        const query = "SELECT * FROM condiciones_generales ORDER BY orden ASC";
        const [results] = await connection.query(query);
        connection.release();

        return NextResponse.json(results);

    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener las condiciones: " + error.message },
            { status: 500 }
        );
    }
}

// ... imports

export async function POST(req) {
    const connection = await pool.getConnection();

    try {
        const condiciones = await req.json();

        if (!Array.isArray(condiciones)) {
            return NextResponse.json(
                { message: "El cuerpo de la solicitud debe ser un arreglo de condiciones." },
                { status: 400 }
            );
        }

        await connection.beginTransaction();
        await connection.query("DELETE FROM condiciones_generales");

        if (condiciones.length > 0) {
            const query = `
                INSERT INTO condiciones_generales (texto_condicion, orden) VALUES ?
            `;
            const values = condiciones.map(c => [c.texto_condicion, c.orden]);
            await connection.query(query, [values]);
        }

        await connection.commit();

        // ✨ CORRECCIÓN AQUÍ ✨
        // Después de guardar, vuelve a consultar los datos para obtener los IDs correctos
        // y devuélvelos al cliente para que sincronice su estado.
        const [updatedCondiciones] = await connection.query("SELECT * FROM condiciones_generales ORDER BY orden ASC");

        return NextResponse.json(updatedCondiciones); // Devolver el arreglo actualizado

    } catch (error) {
        if (connection) await connection.rollback();
        return NextResponse.json(
            { error: "Error al guardar las condiciones: " + error.message },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}

// ... GET function remains the same