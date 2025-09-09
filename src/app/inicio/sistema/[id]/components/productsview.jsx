"use client"
import { Card, CardHeader, CardBody, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// --- Sub-componente para mostrar la tabla de productos ---
export default function CotizacionProductsView({ productos, cotizacion }) {

    // Función auxiliar para formatear números de forma segura
    const formatCurrency = (value) => Number(value || 0).toFixed(2);

    return (
        <Card shadow="sm" className="border-1 border-default-200">
            <CardHeader>
                <h2 className="text-xl font-bold">Productos en la Cotización</h2>
            </CardHeader>
            <CardBody>
                <Table
                    removeWrapper
                    aria-label="Tabla de productos en la cotización"
                    bottomContent={
                        // --- SECCIÓN DE TOTALES CON ESTILOS MEJORADOS ---
                        <div className="flex flex-col items-end gap-3 p-4 border-t-2 border-default-200">
                            <div className="flex justify-between w-full max-w-xs text-sm">
                                <span className="text-slate-500">Precio normal</span>
                                <span className="font-medium text-slate-700">${formatCurrency(cotizacion.precioNormal)}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs text-sm">
                                <span className="text-slate-500">Precio con Descuento</span>
                                <span className="font-medium text-orange-600">${formatCurrency(cotizacion.precioNormalconDescuento)}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs text-sm">
                                <span className="text-slate-500">IVA (16%)</span>
                                <span className="font-medium text-slate-700">+${formatCurrency(cotizacion.iva)}</span>
                            </div>

                            <Divider className="my-2 max-w-xs" />

                            <div className="flex justify-between w-full max-w-xs font-bold">
                                <span className="text-lg text-slate-800">Precio Final</span>
                                <span className="text-lg text-success-600">${formatCurrency(cotizacion.precioReal)}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs font-bold">
                                <span className="text-lg text-slate-800">Precio Final + Iva</span>
                                <span className="text-lg text-success-600">${formatCurrency(parseFloat(cotizacion.precioReal) + parseFloat(cotizacion.iva))}</span>
                            </div>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>SKU</TableColumn>
                        <TableColumn>PRODUCTO</TableColumn>
                        <TableColumn>CANT.</TableColumn>
                        <TableColumn>P. UNITARIO</TableColumn>
                        <TableColumn>+ PROT.</TableColumn>
                        <TableColumn>+ INST.</TableColumn>
                        <TableColumn>+ MARGEN</TableColumn>
                        <TableColumn>+ COMISIONES</TableColumn>
                        <TableColumn>+ DESC.</TableColumn>
                        <TableColumn>P. TOTAL</TableColumn>
                    </TableHeader>
                    <TableBody items={productos} emptyContent="No hay productos en esta cotización.">
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.sku}</TableCell>
                                <TableCell>{item.producto_nombre}</TableCell>
                                <TableCell>{item.cantidad}</TableCell>
                                <TableCell>${formatCurrency(item.preciounico)}</TableCell>
                                <TableCell className="text-blue-600">+${formatCurrency(item.proteccion)}</TableCell>
                                <TableCell className="text-secondary-600">+${formatCurrency(item.instalacion)}</TableCell>
                                <TableCell className="text-purple-600">+${formatCurrency(item.margen)}</TableCell>
                                <TableCell className="text-orange-600">+${(Number(item.comision_agente || 0) + Number(item.comision_vendedor || 0)).toFixed(2)}</TableCell>
                                <TableCell className="text-danger-500">+${formatCurrency(item.descuento)}</TableCell>
                                <TableCell className="font-bold">${formatCurrency(item.preciototal)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}