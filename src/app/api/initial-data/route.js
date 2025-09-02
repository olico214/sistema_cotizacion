import { NextResponse } from "next/server";
import pool from "@/libs/mysql"; // Make sure this path to your DB connection is correct

export async function GET() {
    try {
        // We run all queries in parallel for better performance using Promise.all
        const [
            clientes,
            usuarios,
            productos,
            tiposProyecto,
            envios
        ] = await Promise.all([
            pool.query("SELECT * FROM clientes ORDER BY nombre ASC"),
            pool.query("SELECT id, fullname, type FROM users_data ORDER BY fullname ASC"), // Note: Select only non-sensitive data
            pool.query("SELECT * FROM productos ORDER BY nombre ASC"),
            pool.query("SELECT * FROM tipo_proyecto ORDER BY nombre ASC"),
            pool.query("SELECT * FROM envio ORDER BY descripcion ASC")
        ]);

        // The final data object combines the results from all queries
        const data = {
            clientes: clientes[0],
            usuarios: usuarios[0],
            productos: productos[0],
            tiposProyecto: tiposProyecto[0],
            envios: envios[0],
        };

        return NextResponse.json({ ok: true, data });

    } catch (error) {
        // Handle any errors during the database queries
        console.error("Error fetching initial data:", error);
        return NextResponse.json(
            { ok: false, error: "Failed to fetch initial data." },
            { status: 500 }
        );
    }
}