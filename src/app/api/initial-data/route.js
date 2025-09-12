import { NextResponse } from "next/server";
import pool from "@/libs/mysql"; // Asegúrate de que la ruta sea correcta

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    // Es una buena práctica validar que los parámetros necesarios existen
    if (!userId) {
        return NextResponse.json(
            { ok: false, error: "El parámetro 'user' es requerido." },
            { status: 400 } // 400 Bad Request
        );
    }

    try {
        // Las consultas se ejecutan en paralelo para un mejor rendimiento
        const [
            clientesResult,
            usuariosResult,
            productosResult,
            tiposProyectoResult,
            enviosResult,
            descuentoResult,
            instalacionResult,
            externoResult,
        ] = await Promise.all([
            pool.query("SELECT * FROM clientes ORDER BY nombre ASC"),
            pool.query("SELECT * FROM users_data ORDER BY fullname ASC"),
            pool.query("SELECT * FROM productos ORDER BY nombre ASC"),
            pool.query("SELECT * FROM tipo_proyecto ORDER BY nombre ASC"),
            pool.query("SELECT * FROM envio ORDER BY descripcion ASC"),
            pool.query("SELECT * FROM descuento"),
            pool.query("SELECT * FROM instalacion"),
            // ⚠️ CORREGIDO: Se utiliza una consulta parametrizada para prevenir SQL Injection
            pool.query("SELECT externo FROM users WHERE userID = ?", [userId]),
        ]);

        // Extraemos las filas de resultados. mysql2 devuelve [rows, fields]
        const clientes = clientesResult[0];
        const usuarios = usuariosResult[0];
        const productos = productosResult[0];
        const tiposProyecto = tiposProyectoResult[0];
        const envios = enviosResult[0];
        const descuento = descuentoResult[0];
        const instalacion = instalacionResult[0];
        const externoInfo = externoResult[0];

        // ✅ MEJORA: Se comprueba si el usuario existe antes de acceder a sus propiedades
        const esExterno = externoInfo.length > 0 ? externoInfo[0].externo : null;
        // El objeto final combina los resultados de todas las consultas
        const data = {
            clientes,
            usuarios,
            productos,
            tiposProyecto,
            envios,
            descuento,
            instalacion,
            esExterno, // Se añade la información del usuario externo a la respuesta
        };

        return NextResponse.json({ ok: true, data });

    } catch (error) {
        // Manejo de errores durante las consultas a la base de datos
        console.error("Error al obtener los datos iniciales:", error);
        return NextResponse.json(
            { ok: false, error: "No se pudieron obtener los datos iniciales." },
            { status: 500 }
        );
    }
}