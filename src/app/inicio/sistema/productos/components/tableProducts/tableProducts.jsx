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
    Spinner,
    Tooltip
} from "@nextui-org/react";
import RegisterProduct from "../register/registerProduct";

// --- ARCHIVOS DE ÍCONOS ---
// Asegúrate de que estos componentes existan o defínelos aquí
const EditIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props}>
        <path d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5"></path>
        <path d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.50831" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5"></path>
    </svg>
);
const DeleteIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props}>
        <path d="M17.5 4.98332C14.725 4.72499 11.9333 4.59166 9.15 4.59166C7.5 4.59166 5.85 4.67499 4.2 4.82499L2.5 4.98332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        <path d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        <path d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        <path d="M8.60834 13.75H11.3833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        <path d="M7.91669 10.4167H12.0834" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
    </svg>
);


const columns = [
    { key: "sku", label: "SKU" },
    { key: "nombre", label: "NOMBRE" },
    { key: "tipo", label: "TIPO" },
    { key: "costo", label: "COSTO" },
    { key: "margen", label: "MARGEN" },
    { key: "precio", label: "PRECIO" },
    { key: "stockinicial", label: "STOCK" },
    { key: "actions", label: "ACCIONES" },
];

export default function TableProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

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

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredItems = useMemo(() => {
        let filteredProducts = [...products];
        if (filterValue) {
            filteredProducts = filteredProducts.filter(product =>
                product.nombre.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (typeFilter !== "all") {
            filteredProducts = filteredProducts.filter(product => product.tipo === typeFilter);
        }
        return filteredProducts;
    }, [products, filterValue, typeFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

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
                return `$${Number(cellValue).toFixed(2)}`;

            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Editar producto">
                            <RegisterProduct fetchProducts={fetchProducts} productToEdit={product}>
                                <Button isIconOnly size="sm" variant="light">
                                    <EditIcon />
                                </Button>
                            </RegisterProduct>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [fetchProducts]);

    const topContent = useMemo(() => {
        const productTypes = ["all", ...new Set(products.map(p => p.tipo).filter(Boolean))];
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                    <RegisterProduct fetchProducts={fetchProducts}>
                        <Button color="primary">Nuevo Producto</Button>
                    </RegisterProduct>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 overflow-x-auto pb-2">
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
                </div>
                <span className="text-default-400 text-small">Total {products.length} productos</span>
            </div>
        );
    }, [filterValue, onSearchChange, products, typeFilter, onClear, fetchProducts]);

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