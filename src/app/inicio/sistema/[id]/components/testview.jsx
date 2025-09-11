"use client"
import { Card, CardHeader, CardBody, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// --- Sub-componente para mostrar la tabla de productos ---
export default function CotizacionProductsViewtest({ productos, cotizacion }) {

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
                                <span className="text-slate-500">%{cotizacion.descuento}</span>
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
                                <span className="text-lg text-success-600">${formatCurrency(parseFloat(cotizacion.precioReal))}</span>
                            </div>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>SKU</TableColumn>
                        <TableColumn>MEDIDA</TableColumn>
                        <TableColumn>DESCRIPCION/GAMA</TableColumn>
                        <TableColumn>P. UNITARIO</TableColumn>
                        <TableColumn>CANTIDAD</TableColumn>
                        <TableColumn>TOTAL</TableColumn>
                    </TableHeader>
                    <TableBody items={productos} emptyContent="No hay productos en esta cotización.">
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.sku}</TableCell>
                                <TableCell>{item.medidas}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>${formatCurrency(item.preciounico)}</TableCell>
                                <TableCell>{item.cantidad}</TableCell>
                                <TableCell className="font-bold">${formatCurrency(item.preciototal)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    );
}