// Archivo: app/api/usuarios/generar-token/route.js

import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";
import crypto from "crypto"; // Módulo nativo de Node.js para generar strings seguros

export async function POST(req) {
    let connection;
    try {
        const { userID } = await req.json();

        if (!userID) {
            return NextResponse.json(
                { ok: false, error: "El ID de usuario es requerido." },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();

        // 1. Buscar un token que aún esté activo y vigente
        const findTokenQuery = "SELECT token FROM token WHERE user_id = ? AND estatus = 1 AND vigencia > NOW()";
        const [existingTokens] = await connection.query(findTokenQuery, [userID]);

        if (existingTokens.length > 0) {
            // 2. Si ya existe un token válido, simplemente lo devolvemos
            const existingToken = existingTokens[0].token;
            connection.release();
            return NextResponse.json({
                ok: true,
                message: "Ya existe un token activo para este usuario.",
                token: existingToken,
            });
        }

        // --- Si no se encontró un token válido, creamos uno nuevo ---

        await connection.beginTransaction();
        const selectIdQuery = "SELECT id FROM users WHERE userID = ?";
        const [rows] = await connection.query(selectIdQuery, [userID])

        const userPrimaryKey = rows[0].id;
        // 3. (Opcional pero recomendado) Desactivar cualquier token viejo para este usuario
        const deactivateOldTokensQuery = "UPDATE token SET estatus = 0 WHERE user_id = ?";
        await connection.query(deactivateOldTokensQuery, [userPrimaryKey]);

        // 4. Generar un nuevo token criptográficamente seguro
        const newToken = crypto.randomBytes(32).toString("hex");

        // 5. Insertar el nuevo token con una vigencia de 2 días
        //    Tu columna 'vigencia' debe ser de tipo DATETIME o TIMESTAMP



        const insertTokenQuery = "INSERT INTO token (token, user_id, vigencia, estatus) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 2 DAY), 1)";
        await connection.query(insertTokenQuery, [newToken, userPrimaryKey]);

        // 6. Confirmar los cambios en la base de datos
        await connection.commit();

        return NextResponse.json({
            ok: true,
            message: "Token generado exitosamente.",
            token: newToken,
        });

    } catch (error) {
        if (connection) {
            await connection.rollback(); // Si algo falla, revertimos los cambios
        }
        console.error("Error al generar el token:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release(); // Liberar la conexión es muy importante
        }
    }
}