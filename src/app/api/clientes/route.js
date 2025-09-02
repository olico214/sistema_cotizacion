import { NextResponse } from "next/server";
import pool from "@/libs/mysql"; // Asegúrate de que esta ruta sea correcta

export async function POST(req) {
    try {
        // 1. Obtener los datos del cliente desde el cuerpo de la petición
        const {
            nombre,
            telefono,
            email,
            domicilio,
            estado,
            ciudad,
            colonia,
            frecuente,
            selected_canal_venta
        } = await req.json();

        // 2. Validación básica de los datos (puedes añadir más validaciones)
        if (!nombre || !selected_canal_venta) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "El nombre y el canal de venta son campos requeridos."
                },
                { status: 400 } // Bad Request
            );
        }

        // 3. Crear la consulta SQL para insertar los datos en la tabla `clientes`
        const query = `
            INSERT INTO clientes (
                nombre, telefono, email, domicilio, estado,
                ciudad, colonia, frecuente, selected_canal_venta
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // 4. Crear el array de valores en el orden correcto
        const values = [
            nombre,
            telefono,
            email,
            domicilio,
            estado,
            ciudad,
            colonia,
            frecuente, // Esto será `true` o `false`
            selected_canal_venta
        ];

        // 5. Ejecutar la consulta en la base de datos
        const [result] = await pool.query(query, values);

        // 6. Devolver una respuesta exitosa con el ID del nuevo cliente
        return NextResponse.json({
            ok: true,
            message: "Cliente guardado exitosamente",
            data: {
                id: result.insertId, // ID autoincremental generado por MySQL
                nombre,
                email
            }
        });

    } catch (error) {
        // 7. Manejar cualquier error que ocurra durante el proceso
        console.error("Error en POST /api/clientes:", error);
        return NextResponse.json(
            {
                ok: false,
                error: "Ocurrió un error al guardar el cliente. Por favor, inténtalo de nuevo."
            },
            { status: 500 } // Internal Server Error
        );
    }
}



// --- OBTENER TODOS LOS CLIENTES ---
export async function GET(req) {
    try {
        // La consulta une las tablas clientes y canal_venta para obtener el nombre del canal
        const query = `
            SELECT 
                c.id,
                c.nombre,
                c.telefono,
                c.email,
                c.ciudad,
                c.frecuente,
                cv.nombre AS canal_venta_nombre
            FROM 
                clientes AS c
            LEFT JOIN 
                canal_venta AS cv ON c.selected_canal_venta = cv.id
            ORDER BY 
                c.nombre ASC;
        `;

        const [result] = await pool.query(query);

        return NextResponse.json({ ok: true, data: result });

    } catch (error) {
        console.error("Error en GET /api/clientes:", error);
        return NextResponse.json(
            { ok: false, error: "Error al obtener los clientes." },
            { status: 500 }
        );
    }
}
