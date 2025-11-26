import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM envio ORDER BY descripcion ASC");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { sku, descripcion, tamano, precio, costo } = await req.json();
        const query = "INSERT INTO envio (sku, descripcion, tamano, precio, costo) VALUES (?, ?, ?, ?, ?)";
        const [result] = await pool.query(query, [sku, descripcion, tamano, precio, costo]);
        return NextResponse.json({ ok: true, id: result.insertId });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, sku, descripcion, tamano, precio, costo } = await req.json();
        const query = "UPDATE envio SET sku = ?, descripcion = ?, tamano = ?, precio = ?, costo = ? WHERE id = ?";
        await pool.query(query, [sku, descripcion, tamano, precio, costo, id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await pool.query("DELETE FROM envio WHERE id = ?", [id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}