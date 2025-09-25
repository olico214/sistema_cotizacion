"use client";

import React from "react";
import Link from "next/link";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Chip, useDisclosure, Tooltip
} from "@nextui-org/react";



const statusColorMap = {
    Nuevo: "primary",
    'En proceso': "warning",
    Autorizado: "success",
    Cancelado: "danger",
};

export default function CotizacionesTable({ initialData }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-MX', options);
    };

    return (
        <div className="p-4 sm:p-8">


            <Table aria-label="Tabla de Cotizaciones">
                <TableHeader>
                    <TableColumn>FOLIO</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>VENDEDOR</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>ESTATUS</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody items={initialData} emptyContent="No hay cotizaciones registradas.">
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>#{item.id}</TableCell>
                            <TableCell>{item.cliente_nombre || "-"}</TableCell>
                            <TableCell>{item.usuario_nombre || "-"}</TableCell>
                            <TableCell>{formatDate(item.createdDate)}</TableCell>
                            <TableCell>
                                <Chip color={statusColorMap[item.estatus]} size="sm" variant="flat">
                                    {item.estatus}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Tooltip content="Ver detalles y añadir productos">
                                    <Button as={Link} href={`/inicio/sistema/${item.id}`} color="primary" variant="light" size="sm">
                                        Detalles
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </div>
    );
}