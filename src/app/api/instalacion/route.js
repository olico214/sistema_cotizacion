import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET() {
    try {
        const [result] = await pool.query("SELECT * FROM instalacion");
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { minimo, maximo, precio } = await req.json();


        // Si no existe, insertamos
        const [result] = await pool.query("INSERT INTO instalacion ( minimo,maximo,precio) VALUES (?,?,?)", [minimo, maximo, precio]);
        return NextResponse.json({ ok: true, id: result.insertId });

    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}


export async function PUT(req) {
    try {
        const { id, minimo, maximo, precio } = await req.json();
        await pool.query("UPDATE instalacion SET minimo = ?,maximo=?, precio=? WHERE id = ?", [minimo, maximo, precio, id]);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
