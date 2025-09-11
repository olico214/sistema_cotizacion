import pool from "@/libs/mysql";
import { NextResponse } from "next/server";

// OBTENER los detalles completos de UNA cotización
export async function GET(req, { params }) {
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
                c.cp as codigo_postal,
                ov.iva,
                ov.precioNormal,
                ov.precioNormalconDescuento,
                ov.precioReal,
                ov.descuento,
                ti.nombre as nombre_proyecto,
                ov.linea_cotizada
                
            FROM 
                listado_ov AS ov
            LEFT JOIN clientes AS c ON ov.idCliente = c.id
            LEFT JOIN users_data AS u ON ov.idUser = u.id
            LEFT JOIN envio AS e ON ov.id_envio = e.id
            LEFT JOIN users_data AS uAgent ON ov.idAgente = uAgent.id
            left join tipo_proyecto ti on ti.id = ov.idTipoProyecto
            WHERE ov.id = ?;
        `;
        const [headerResult] = await pool.query(headerQuery, [id]);
        if (headerResult.length === 0) {
            return NextResponse.json({ message: "Cotización no encontrada" }, { status: 404 });
        }
        console.log("headers")
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
        // Query para los productos
        console.log("products")
        const condiciones = `
        SELECT * from condiciones_generales order by orden asc`;
        const [condicionesResult] = await pool.query(condiciones, []);
        console.log("condiciones")


        const descuento = `
        SELECT titulo,comentario from descuento`;
        const [descuentoResult] = await pool.query(descuento, []);
        console.log("descuento")

        return NextResponse.json({
            cotizacion: headerResult[0],
            productos: productsResult,
            condiciones_generales: condicionesResult,
            descuento: descuentoResult[0]
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}