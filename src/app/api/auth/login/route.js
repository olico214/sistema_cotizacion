import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/libs/mysql-safe";
import { CreateCookie } from "@/libs/auth/cookie";

export async function POST(req) {
    try {
        const { email, contraseña } = await req.json();

        // Check if email and password are provided
        if (!email || !contraseña) {
            throw new Error("Email and password are required");
        }

        const connection = await pool.getConnection();

        const query = `SELECT * FROM users WHERE email = ? AND status = ?`;
        const [rows] = await connection.query(query, [email, 'active']);

        if (rows.length === 0) {
            throw new Error("User not found or not active");
        }

        const user = rows[0];
        const isPasswordMatch = await bcrypt.compare(contraseña, user.password);

        if (!isPasswordMatch) {
            return NextResponse.json({ ok: false });
        }

        await CreateCookie(user.userID);
        // Return a successful response
        return NextResponse.json({ ok: true, userId: user.userID });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ ok: false, error: error.message });
    }
}
