import { NextResponse } from "next/server";
import pool from "@/libs/mysql-safe";

// --- GUARDAR UN NUEVO PRODUCTO ---
export async function POST(req) {
    try {
        // 1. Extraemos todos los posibles datos del formulario del cuerpo de la petición
        const {
            nombre, sku, descripcion, tamano, tipo, medidas,
            modeloSB, colorSB, modeloProveedor, colorProveedor,
            costo, stockinicial, precio, margen, is_automatizacion, is_persiana
        } = await req.json();

        // 2. Creamos la consulta SQL para insertar en la tabla `productos`
        const query = `
      INSERT INTO productos (
        nombre, sku, descripcion, tamano, tipo, medidas,
        modeloSB, colorSB, modeloProveedor, colorProveedor,
        costo, stockinicial, precio, margen, is_automatizacion, is_persiana,type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        // 3. Preparamos los valores en el orden correcto
        //    Usamos '|| null' para convertir strings vacíos a NULL y evitar errores en campos numéricos
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
            tipo == "Telas" ? nombre : null
        ];

        // 4. Ejecutamos la consulta
        const [result] = await pool.query(query, values);

        // 5. Devolvemos una respuesta exitosa
        return NextResponse.json({
            ok: true,
            message: "Producto guardado correctamente",
            id: result.insertId // Devolvemos el ID del nuevo producto
        });

    } catch (error) {
        console.error("Error en POST /api/productos:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// --- OBTENER TODOS LOS PRODUCTOS ---
export async function GET(req) {
    try {
        // 1. Consulta para seleccionar todos los productos
        const query = `SELECT * FROM productos ORDER BY nombre ASC`;

        // 2. Ejecutamos la consulta
        const [result] = await pool.query(query);

        // 3. Devolvemos el resultado
        return NextResponse.json({ ok: true, data: result });

    } catch (error) {
        console.error("Error en GET /api/productos:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}