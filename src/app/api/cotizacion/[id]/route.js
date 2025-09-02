import { NextResponse } from "next/server";
import pool from "@/libs/mysql";
// OBTENER los detalles completos de UNA cotización (MODIFICADO)
export async function GET(req, { params }) {
    try {
        const { id } = await params;

        // Query para el encabezado (AHORA INCLUYE DATOS DE ENVÍO)
        const headerQuery = `
            SELECT 
                ov.*,
                c.nombre AS cliente_nombre,
                u.fullname AS usuario_nombre,
                u.comision AS comision_vendedor,
                e.descripcion AS envio_descripcion,
                e.precio AS envio_precio,
                 uAgent.fullname AS nombre_agente,
                 uAgent.comision AS comision_agente,
                 ov.proteccion
            FROM 
                listado_ov AS ov
            LEFT JOIN 
                clientes AS c ON ov.idCliente = c.id
            LEFT JOIN 
                users_data AS u ON ov.idUser = u.id
            LEFT JOIN 
                envio AS e ON ov.id_envio = e.id
            LEFT JOIN 
                users_data AS uAgent ON ov.idAgente = uAgent.id
            WHERE 
                ov.id = ?;
        `;
        const [headerResult] = await pool.query(headerQuery, [id]);
        if (headerResult.length === 0) {
            return NextResponse.json({ ok: false, error: "Cotización no encontrada" }, { status: 404 });
        }

        // Query para los productos (sin cambios)
        const productQuery = `
            SELECT pov.*, p.nombre as producto_nombre, p.sku, p.tipo,pov.margen
            FROM products_ov pov
            JOIN productos p ON pov.idProducto = p.id
            WHERE pov.idListado = ?
        `;
        const [productsResult] = await pool.query(productQuery, [id]);
        return NextResponse.json({
            ok: true,
            data: {
                cotizacion: headerResult[0],
                productos: productsResult
            }
        });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
// ACTUALIZAR el encabezado o el estatus de la cotización
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { idCliente, idUser, idTipoproyecto, id_envio, estatus, idAgente } = await req.json();

        const query = `
            UPDATE listado_ov 
            SET idCliente = ?, idUser = ?, idTipoproyecto = ?, id_envio = ?, estatus = ? ,idAgente=?
            WHERE id = ?
        `;
        await pool.query(query, [idCliente, idUser, idTipoproyecto, id_envio, estatus, idAgente, id]);

        return NextResponse.json({ ok: true, message: "Cotización actualizada" });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// AÑADIR un producto a la cotización
export async function POST(req, { params }) {
    try {
        const { id: idListado } = params;
        const { idProducto, alto, ancho, cantidad, actual_costo, actual_precio, margen } = await req.json();

        // **Regla de negocio: Validar estatus antes de insertar**
        const [cotizacion] = await pool.query("SELECT estatus FROM listado_ov WHERE id = ?", [idListado]);
        const estatusActual = cotizacion[0].estatus;

        if (estatusActual === 'Autorizado' || estatusActual === 'Cancelado') {
            return NextResponse.json({ ok: false, error: "No se pueden agregar productos a una cotización autorizada o cancelada." }, { status: 403 }); // 403 Forbidden
        }

        const query = `
            INSERT INTO products_ov (idListado, idProducto, alto, ancho, cantidad, actual_costo, actual_precio,margen) 
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `;
        await pool.query(query, [idListado, idProducto, alto, ancho, cantidad, actual_costo, actual_precio, margen]);

        return NextResponse.json({ ok: true, message: "Producto añadido" });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}

// ELIMINAR un producto de la cotización
export async function DELETE(req, { params }) {
    try {
        const { id: idListado } = await params;
        const { idProductOv } = await req.json(); // Se espera el ID de la fila en `products_ov`

        // Opcional: Validar estatus para no permitir eliminar si ya está autorizada.

        await pool.query("DELETE FROM products_ov WHERE id = ? AND idListado = ?", [idProductOv, idListado]);

        return NextResponse.json({ ok: true, message: "Producto eliminado" });
    } catch (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}