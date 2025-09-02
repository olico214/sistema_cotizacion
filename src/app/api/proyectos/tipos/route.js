import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM tipo_proyecto ORDER BY nombre ASC");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { nombre } = await req.json();
        const [result] = await pool.query("INSERT INTO tipo_proyecto (nombre) VALUES (?)", [nombre]);
        return NextResponse.json({ ok: true, id: result.insertId });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, nombre } = await req.json();
        await pool.query("UPDATE tipo_proyecto SET nombre = ? WHERE id = ?", [nombre, id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await pool.query("DELETE FROM tipo_proyecto WHERE id = ?", [id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}