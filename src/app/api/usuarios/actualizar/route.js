import { NextResponse } from "next/server";
import pool from "@/libs/mysql"; // Asegúrate que la ruta a tu conexión sea correcta

export async function POST(req) {
    try {
        const { externo, id } = await req.json();
        const query = "update users set externo =? where userID =?"
        const values = [externo, id || null];

        const [result] = await pool.query(query, values);
        return NextResponse.json({ ok: true, id: result });

    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
