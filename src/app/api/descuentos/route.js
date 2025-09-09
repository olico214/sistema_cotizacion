import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM descuento");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { descuento, titulo, comentario } = await req.json();

        // Verificar si ya existe un registro
        const [rows] = await pool.query("SELECT COUNT(*) AS count FROM descuento");

        if (rows[0].count > 0) {
            // Si existe, actualizamos
            await pool.query("UPDATE descuento SET descuento = ? , titulo = ? , comentario = ? WHERE id = 1", [descuento, titulo, comentario]);
            return NextResponse.json({ ok: true, updated: true });
        } else {
            // Si no existe, insertamos
            const [result] = await pool.query("INSERT INTO descuento (id, descuento) VALUES (1, ?)", [descuento]);
            return NextResponse.json({ ok: true, id: result.insertId });
        }
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}


export async function PUT(req) {
    try {
        const { id, descuento } = await req.json();
        await pool.query("UPDATE descuento SET descuento = ? WHERE id = ?", [descuento, id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
