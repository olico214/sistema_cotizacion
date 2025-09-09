"use client"
import { Card, CardHeader, CardBody, Divider, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// --- Sub-componente para mostrar el encabezado ---
export default function CotizacionHeaderView({ cotizacion }) {
    const InfoBlock = ({ label, value }) => (
        <div>
            <p className="text-xs text-default-500 uppercase font-semibold">{label}</p>
            <p className="text-sm text-default-800">{value || 'N/A'}</p>
        </div>
    );

    const statusColorMap = {
        Autorizado: "success",
        "En proceso": "primary",
        Nuevo: "secondary",
        Cancelado: "danger",
    };

    return (
        <Card shadow="sm" className="border-1 border-default-200">
            <CardHeader className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold">Resumen de Cotización #{cotizacion.id}</h1>
                    <p className="text-sm text-default-500">Información guardada</p>
                </div>
                <Chip color={statusColorMap[cotizacion.estatus]} size="sm" variant="flat">
                    {cotizacion.estatus}
                </Chip>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                    <InfoBlock label="Cliente" value={cotizacion.cliente_nombre} />
                    <InfoBlock label="Vendedor" value={cotizacion.usuario_nombre} />
                    <InfoBlock label="Agente" value={cotizacion.nombre_agente} />
                    <InfoBlock label="Método de Envío" value={cotizacion.envio_descripcion} />
                    <InfoBlock label="Comisión Vendedor" value={`${cotizacion.comision_vendedor || 0}%`} />
                    <InfoBlock label="Comisión Agente" value={`${cotizacion.comision_agente || 0}%`} />
                    <InfoBlock label="Costo de Envío" value={`$${Number(cotizacion.envio_precio || 0).toFixed(2)}`} />
                    <InfoBlock label="Protección Telas" value={`${cotizacion.proteccion || 0}%`} />
                </div>
            </CardBody>
        </Card>
    );
}