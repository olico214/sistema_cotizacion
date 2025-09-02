"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Input, Chip, Pagination, Spinner, Tooltip, Button
} from "@nextui-org/react";

// Columnas que se mostrarán en la tabla
const columns = [
    { key: "nombre", label: "NOMBRE" },
    { key: "email", label: "EMAIL" },
    { key: "telefono", label: "TELÉFONO" },
    { key: "canal_venta_nombre", label: "CANAL DE VENTA" },
    { key: "frecuente", label: "FRECUENTE" },
    { key: "actions", label: "ACCIONES" },
];

// Ícono de búsqueda
const SearchIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}><path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M22 22L20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
);

// Ícono de edición (Placeholder)
const EditIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props} ><path d="M17.5 2.5a2.121 2.121 0 0 1 0 3l-9.5 9.5-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
);


export default function ClientesTable() {
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    // Carga los datos de la API cuando el componente se monta
    useEffect(() => {
        const fetchClientes = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/clientes');
                const json = await res.json();
                if (json.ok) {
                    setClientes(json.data);
                }
            } catch (error) {
                console.error("Fallo al obtener los clientes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClientes();
    }, []);

    // Memoiza los clientes filtrados para mejorar el rendimiento
    const filteredItems = useMemo(() => {
        if (!filterValue) return clientes;

        return clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
            cliente.email.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [clientes, filterValue]);

    // Memoiza los items de la página actual
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    // Renderiza celdas de forma personalizada
    const renderCell = useCallback((cliente, columnKey) => {
        const cellValue = cliente[columnKey];
        switch (columnKey) {
            case "frecuente":
                return (
                    <Chip color={cellValue ? "success" : "default"} size="sm" variant="flat">
                        {cellValue ? "Sí" : "No"}
                    </Chip>
                );
            case "actions":
                return (
                    <Tooltip content="Editar cliente">
                        <Button isIconOnly variant="light" onPress={() => console.log("Editar", cliente.id)}>
                            <EditIcon />
                        </Button>
                    </Tooltip>
                );
            default:
                return cellValue;
        }
    }, []);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <Input
                    isClearable
                    placeholder="Buscar por nombre o email..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onValueChange={onSearchChange}
                />
            </div>
        );
    }, [filterValue, onSearchChange]);

    return (
        <Table
            aria-label="Tabla de Clientes"
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={
                pages > 1 ? (
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={setPage}
                        />
                    </div>
                ) : null
            }
            bottomContentPlacement="outside"
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
                items={items}
                isLoading={isLoading}
                loadingContent={<Spinner label="Cargando clientes..." />}
                emptyContent={"No se encontraron clientes."}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}