// Archivo: app/api/productos/[id]/route.js

import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

// --- ACTUALIZAR (EDITAR) UN PRODUCTO EXISTENTE ---
export async function PUT(request, { params }) {
    try {
        // 1. Obtenemos el ID del producto desde la URL (ej: /api/productos/15)
        const { id } = await params;

        // 2. Extraemos los datos actualizados del cuerpo de la petición
        const {
            nombre, sku, descripcion, tamano, tipo, medidas,
            modeloSB, colorSB, modeloProveedor, colorProveedor,
            costo, stockinicial, precio, margen, is_automatizacion, is_persiana
        } = await request.json();

        // 3. Creamos la consulta SQL para actualizar el producto
        const query = `
            UPDATE productos SET
                nombre = ?,
                sku = ?,
                descripcion = ?,
                tamano = ?,
                tipo = ?,
                medidas = ?,
                modeloSB = ?,
                colorSB = ?,
                modeloProveedor = ?,
                colorProveedor = ?,
                costo = ?,
                stockinicial = ?,
                precio = ?,
                margen = ?,
                is_automatizacion = ?,
                is_persiana = ?,
                type = ?
            WHERE id = ? 
        `; // El WHERE id = ? es crucial para actualizar solo el producto correcto

        // 4. Preparamos los valores en el orden correcto
        //    La última '?' corresponde al ID del producto
        const values = [
            nombre,
            sku,
            descripcion,
            tamano,
            tipo,
            medidas,
            modeloSB,
            colorSB,
            modeloProveedor,
            colorProveedor,
            costo || null,
            stockinicial || null,
            precio || null,
            margen || null,
            is_automatizacion || false,
            is_persiana || false,
            tipo === "Telas" ? nombre : null,
            id // El ID para la cláusula WHERE
        ];

        // 5. Ejecutamos la consulta
        await pool.query(query, values);

        // 6. Devolvemos una respuesta exitosa
        return NextResponse.json({
            ok: true,
            message: "Producto actualizado correctamente",
        });

    } catch (error) {
        console.error(`Error en PUT /api/productos/[id]:`, error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}