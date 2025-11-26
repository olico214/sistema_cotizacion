import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM aumentos ORDER BY id ASC");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { piezas_minimas, piezas_maximas, descuento } = await req.json();
        const query = "INSERT INTO aumentos (piezas_minimas, piezas_maximas, descuento) VALUES (?, ?, ?)";
        const [result] = await pool.query(query, [piezas_minimas, piezas_maximas, descuento]);
        return NextResponse.json({ ok: true, id: result.insertId });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, piezas_minimas, piezas_maximas, descuento } = await req.json();
        const query = "UPDATE aumentos SET piezas_minimas = ?, piezas_maximas = ?, descuento = ? WHERE id = ?";
        await pool.query(query, [piezas_minimas, piezas_maximas, descuento, id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await pool.query("DELETE FROM aumentos WHERE id = ?", [id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}