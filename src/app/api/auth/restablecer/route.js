// Archivo: app/api/usuarios/restablecer-pass/route.js

import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";
import bcrypt from "bcrypt";

export async function POST(req) {
    let connection;
    try {
        const { token, nuevaContraseña } = await req.json();

        // --- Validación inicial ---
        if (!token || !nuevaContraseña) {
            return NextResponse.json(
                { ok: false, error: "El token y la nueva contraseña son requeridos." },
                { status: 400 }
            );
        }
        if (nuevaContraseña.length < 8) {
            return NextResponse.json(
                { ok: false, error: "La contraseña debe tener al menos 8 caracteres." },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Verificar el token en la base de datos
        const findTokenQuery = "SELECT user_id, vigencia, estatus FROM token WHERE token = ?";
        const [tokenRows] = await connection.query(findTokenQuery, [token]);

        // --- Validaciones de seguridad del token ---
        if (tokenRows.length === 0) {
            throw new Error("El token no es válido o no existe.");
        }
        const tokenData = tokenRows[0];
        if (tokenData.estatus !== 1) {
            throw new Error("Este token ya ha sido utilizado.");
        }
        if (new Date(tokenData.vigencia) < new Date()) {
            throw new Error("El token ha expirado. Por favor, solicita uno nuevo.");
        }

        // Si el token es válido, obtenemos el ID del usuario
        const userId = tokenData.user_id;

        // 2. Encriptar la nueva contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(nuevaContraseña, saltRounds);

        // 3. Actualizar la contraseña en la tabla 'users'
        // Asumo que la llave primaria de 'users' es 'id' como en tu script de creación
        const updateUserQuery = "UPDATE users SET password = ? WHERE id = ?";
        await connection.query(updateUserQuery, [hashedPassword, userId]);

        // 4. Invalidar el token para que no pueda ser reutilizado
        const invalidateTokenQuery = "UPDATE token SET estatus = 0 WHERE token = ?";
        await connection.query(invalidateTokenQuery, [token]);

        // 5. Confirmar todos los cambios
        await connection.commit();

        return NextResponse.json({ ok: true, message: "Contraseña actualizada exitosamente." });

    } catch (error) {
        if (connection) {
            await connection.rollback(); // Si algo falla, revertimos todo
        }
        console.error("Error al restablecer la contraseña:", error);
        // Devolvemos el mensaje de error para que el frontend lo muestre
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}