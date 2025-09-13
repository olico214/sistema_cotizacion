import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe"; // Asegúrate que la ruta a tu conexión sea correcta

// OBTENER TODOS los usuarios
export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM users_data ORDER BY fullname ASC");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// CREAR un nuevo usuario
export async function POST(req) {
    try {
        const { fullname, type, inmobiliaria, ciudad, comision } = await req.json();
        if (!fullname || !type) {
            return NextResponse.json({ ok: false, error: "El nombre y el tipo son requeridos" }, { status: 400 });
        }

        // Si el tipo no es 'Agente', la inmobiliaria es null
        const finalInmobiliaria = type === 'Agente' ? inmobiliaria : null;

        const query = "INSERT INTO users_data (fullname, type, inmobiliaria, ciudad, comision) VALUES (?, ?, ?, ?, ?)";
        const values = [fullname, type, finalInmobiliaria, ciudad, comision || null];

        const [result] = await pool.query(query, values);
        return NextResponse.json({ ok: true, id: result.insertId });

    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// ACTUALIZAR un usuario existente
export async function PUT(req) {
    try {
        const { id, fullname, type, inmobiliaria, ciudad, comision } = await req.json();
        if (!id || !fullname || !type) {
            return NextResponse.json({ ok: false, error: "El ID, nombre y tipo son requeridos" }, { status: 400 });
        }

        const finalInmobiliaria = type === 'Agente' ? inmobiliaria : null;

        const query = "UPDATE users_data SET fullname = ?, type = ?, inmobiliaria = ?, ciudad = ?, comision = ? WHERE id = ?";
        const values = [fullname, type, finalInmobiliaria, ciudad, comision || null, id];

        await pool.query(query, values);
        return NextResponse.json({ ok: true, message: "Usuario actualizado correctamente" });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}