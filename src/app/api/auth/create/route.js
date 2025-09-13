import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/libs/mysql-safe";

export async function POST(req) {
  try {
    const { email, contraseña, name, perfil, externo, clave } =
      await req.json();
    // Verifica que se recibieron correctamente el email y password
    if (!email || !contraseña) {
      throw new Error("Email and password are required");
    }

    // Encripta la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const connection = await pool.getConnection();

    const query = `INSERT INTO users (email, password, status,externo) VALUES (?, ?, ?,?)`;
    const [result] = await connection.query(query, [
      email,
      hashedPassword,
      "active",
      externo,
    ]);

    const insertNewProfile = `INSERT INTO user_profile (user, profile,fullname,clave) VALUES (?, ?,?,?)`;
    const [resultInsert] = await connection.query(insertNewProfile, [
      result.insertId,
      perfil,
      name,
      clave,
    ]);

    // Retorna una respuesta exitosa
    return NextResponse.json({ ok: true, userId: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
