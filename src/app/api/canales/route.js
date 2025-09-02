import { NextResponse } from "next/server";
import pool from "@/libs/mysql"; // Asegúrate que la ruta a tu conexión sea correcta

// OBTENER TODOS los canales de venta
export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM canal_venta ORDER BY nombre ASC");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// CREAR un nuevo canal de venta
export async function POST(req) {
    try {
        const { nombre } = await req.json();
        if (!nombre) {
            return NextResponse.json({ ok: false, error: "El nombre es requerido" }, { status: 400 });
        }
        const [result] = await pool.query("INSERT INTO canal_venta (nombre) VALUES (?)", [nombre]);
        return NextResponse.json({ ok: true, id: result.insertId, nombre });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// ACTUALIZAR un canal de venta existente
export async function PUT(req) {
    try {
        const { id, nombre } = await req.json();
        if (!id || !nombre) {
            return NextResponse.json({ ok: false, error: "El ID y el nombre son requeridos" }, { status: 400 });
        }
        await pool.query("UPDATE canal_venta SET nombre = ? WHERE id = ?", [nombre, id]);
        return NextResponse.json({ ok: true, message: "Canal actualizado correctamente" });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}