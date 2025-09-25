// Archivo: /api/usuarios/actualizar/route.js

import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

export async function POST(req) {
    let connection;
    try {
        const { id: userID, fullname, perfil, estatus, externo } = await req.json(); // Renombramos 'id' a 'userID' para claridad

        // Validación
        if (!userID || !fullname || !perfil || !estatus) {
            return NextResponse.json(
                { ok: false, error: "Faltan datos requeridos." },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Actualizar la tabla `users` usando el userID del frontend
        const usersQuery = "UPDATE users SET status = ?, externo = ? WHERE userID = ?";
        const usersValues = [estatus, externo, userID];
        await connection.query(usersQuery, usersValues);

        // 2. OBTENER EL ID PRIMARIO de la tabla `users` para usarlo en la siguiente tabla
        const selectIdQuery = "SELECT id FROM users WHERE userID = ?";
        const [rows] = await connection.query(selectIdQuery, [userID]); // Usamos desestructuración [rows]

        // 3. Validar que encontramos el usuario antes de continuar
        if (rows.length === 0) {
            // Si no hay usuario, no podemos continuar. Revertimos la transacción.
            await connection.rollback();
            return NextResponse.json(
                { ok: false, error: "El usuario a actualizar no fue encontrado." },
                { status: 404 }
            );
        }

        // 4. Extraer el ID primario del resultado
        const userPrimaryKey = rows[0].id; // Accedemos al id de la primera fila

        // 5. Actualizar la tabla `user_profile` usando el ID primario que acabamos de obtener
        const profileQuery = "UPDATE user_profile SET fullname = ?, profile = ? WHERE user = ?";
        const profileValues = [fullname, perfil, userPrimaryKey]; // Usamos el ID correcto aquí
        await connection.query(profileQuery, profileValues);

        // Si todo fue bien, confirmar la transacción
        await connection.commit();

        return NextResponse.json({ ok: true, message: "Usuario actualizado correctamente." });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error al actualizar el usuario:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}