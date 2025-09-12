import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

// OBTENER los detalles completos de UNA cotización
export async function GET(req, { params }) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    // Es una buena práctica validar que los parámetros necesarios existen
    if (!userId) {
        return NextResponse.json(
            { ok: false, error: "El parámetro 'user' es requerido." },
            { status: 400 } // 400 Bad Request
        );
    }
    try {
        const { id } = await params;

        // Query para el encabezado
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
                c.telefono AS cliente_telefono,
                c.email AS cliente_email,
                c.estado AS cliente_estado,
                c.ciudad AS cliente_ciudad,
                c.colonia AS cliente_colonia,
                c.domicilio AS cliente_domicilio,
                c.frecuente as cliente_frecuente,
                ov.iva,
                ov.precioNormal,
                ov.precioNormalconDescuento,
                ov.precioReal
            FROM 
                listado_ov AS ov
            LEFT JOIN clientes AS c ON ov.idCliente = c.id
            LEFT JOIN users_data AS u ON ov.idUser = u.id
            LEFT JOIN envio AS e ON ov.id_envio = e.id
            LEFT JOIN users_data AS uAgent ON ov.idAgente = uAgent.id
            WHERE ov.id = ?;
        `;
        const [headerResult] = await pool.query(headerQuery, [id]);
        if (headerResult.length === 0) {
            return NextResponse.json({ message: "Cotización no encontrada" }, { status: 404 });
        }

        // Query para los productos
        const productQuery = `
            SELECT 
                pov.*, 
                p.nombre as producto_nombre, 
                p.tipo as producto_tipo,
                p.costo as actual_costo,
                p.precio as actual_precio,
                p.sku

            FROM products_ov pov
            JOIN productos p ON pov.idProducto = p.id
            WHERE pov.idCotizacion = ?;
        `;
        const [productsResult] = await pool.query(productQuery, [id]);

        const isAdminQuery = `
            SELECT externo from users where userID = ?;
        `;
        const [isAdminResult] = await pool.query(isAdminQuery, [userId]);

        return NextResponse.json({
            cotizacion: headerResult[0],
            productos: productsResult,
            isAdmin: isAdminResult[0].externo ? true : false
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function PUT(req, { params }) {

    try {

        const { id } = await params;

        const { idCliente, idUser, idTipoproyecto, id_envio, estatus, idAgente } = await req.json();

        const newStatus = estatus == "Cancelar" ? "Cancelado" : null

        const query = `UPDATE listado_ov 
        SET idCliente = ?, idUser = ?, idTipoproyecto = ?, id_envio = ?, estatus = ? ,idAgente=?
 WHERE id = ? `;

        await pool.query(query, [idCliente, idUser, idTipoproyecto, id_envio, newStatus, idAgente, id]);



        return NextResponse.json({ ok: true, message: "Cotización actualizada" });

    } catch (error) {

        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    }

}