"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    Pagination,
    Spinner // Para mostrar el estado de carga
} from "@nextui-org/react";


// Definimos las columnas que tendrá nuestra tabla
const columns = [
    { key: "nombre", label: "NOMBRE" },
    { key: "sku", label: "SKU" },
    { key: "tipo", label: "TIPO" },
    { key: "costo", label: "COSTO" },
    { key: "precio", label: "PRECIO" },
    { key: "stockinicial", label: "STOCK" },
];

export default function TableProducts() {
    // --- ESTADOS ---
    const [products, setProducts] = useState([]); // Almacena todos los productos de la API
    const [isLoading, setIsLoading] = useState(true); // Estado de carga
    const [filterValue, setFilterValue] = useState(""); // Valor del campo de búsqueda
    const [typeFilter, setTypeFilter] = useState("all"); // Filtro por tipo de producto
    const [page, setPage] = useState(1); // Página actual de la paginación

    // --- CONFIGURACIÓN ---
    const rowsPerPage = 10;

    // --- FETCH DE DATOS ---
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/productos');
                const json = await res.json();
                if (json.ok) {
                    setProducts(json.data);
                } else {
                    console.error("Error al obtener los productos:", json.error);
                }
            } catch (error) {
                console.error("Fallo en la conexión con la API:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

    // --- LÓGICA DE FILTRADO Y BÚSQUEDA (MEMOIZADA) ---
    const filteredItems = useMemo(() => {
        let filteredProducts = [...products];

        // Filtro de búsqueda por nombre
        if (filterValue) {
            filteredProducts = filteredProducts.filter(product =>
                product.nombre.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        // Filtro por tipo
        if (typeFilter !== "all") {
            filteredProducts = filteredProducts.filter(product => product.tipo === typeFilter);
        }

        return filteredProducts;
    }, [products, filterValue, typeFilter]);

    // --- LÓGICA DE PAGINACIÓN (MEMOIZADA) ---
    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    // --- MANEJADORES DE EVENTOS (CALLBACKS) ---
    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1); // Regresa a la primera página al buscar
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    // --- RENDERIZADO DE CELDAS PERSONALIZADO ---
    const renderCell = useCallback((product, columnKey) => {
        const cellValue = product[columnKey];

        switch (columnKey) {
            case "tipo":
                return (
                    <Chip color={product.tipo === 'Telas' ? "warning" : "primary"} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "costo":
            case "precio":
                return `$${Number(cellValue).toFixed(2)}`; // Formatea como moneda
            default:
                return cellValue;
        }
    }, []);


    const topContent = useMemo(() => {
        const productTypes = ["all", ...new Set(products.map(p => p.tipo))]; // Obtiene tipos únicos

        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."

                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {/* Chips para filtrar por tipo */}
                        {productTypes.map(type => (
                            <Chip
                                key={type}
                                variant={typeFilter === type ? "solid" : "bordered"}
                                color="primary"
                                className="cursor-pointer"
                                onClick={() => {
                                    setTypeFilter(type);
                                    setPage(1);
                                }}
                            >
                                {type === "all" ? "Todos" : type}
                            </Chip>
                        ))}
                    </div>
                    {/* Chips con los totales */}
                    <div className="flex gap-2">
                        <Chip color="default">Total: {products.length}</Chip>
                        <Chip color="success">Mostrando: {filteredItems.length}</Chip>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, products, typeFilter]);

    return (
        <Table
            aria-label="Tabla de productos con paginación y filtros"
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={
                pages > 1 && (
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                )
            }
            bottomContentPlacement="outside"
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
                items={items}
                isLoading={isLoading}
                loadingContent={<Spinner label="Cargando productos..." />}
                emptyContent={"No se encontraron productos que coincidan con los filtros."}
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

