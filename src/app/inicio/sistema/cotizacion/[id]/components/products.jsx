"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";

const DeleteIcon = (props) => <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props}><path d="M10 11V12M10 8V9M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;

export default function CotizacionProducts({ quoteId, quoteStatus, initialProducts, productCatalog, onUpdate }) {
    const [newProductForm, setNewProductForm] = useState({ idProducto: "", cantidad: 1, alto: "", ancho: "" });

    const selectedProductInfo = useMemo(() => {
        return productCatalog.find(p => p.id == newProductForm.idProducto);
    }, [newProductForm.idProducto, productCatalog]);

    const newProductSubtotal = useMemo(() => {
        if (!selectedProductInfo) return 0;
        const cantidad = parseInt(newProductForm.cantidad) || 1;
        const precio = parseFloat(selectedProductInfo.precio) || 0;
        if (selectedProductInfo.tipo === 'Telas') {
            const alto = parseFloat(newProductForm.alto) || 0;
            const ancho = parseFloat(newProductForm.ancho) || 0;
            return (alto * ancho * precio) * cantidad;
        } else {
            return precio * cantidad;
        }
    }, [newProductForm, selectedProductInfo]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!selectedProductInfo) return;
        const productData = { ...newProductForm, actual_precio: selectedProductInfo.precio, actual_costo: selectedProductInfo.costo };
        await fetch(`/api/cotizacion/${quoteId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
        setNewProductForm({ idProducto: "", cantidad: 1, alto: "", ancho: "" });
        onUpdate();
    };

    const handleDeleteProduct = async (idProductOv) => {
        if (confirm("¿Seguro que quieres eliminar este producto?")) {
            await fetch(`/api/cotizacion/${quoteId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idProductOv }) });
            onUpdate();
        }
    };

    const canAddProducts = quoteStatus !== 'Autorizado' && quoteStatus !== 'Cancelado';

    return (
        <>
            {/* Formulario para Añadir Productos (Condicional) */}
            {canAddProducts && (
                <Card>
                    <CardHeader><h2 className="text-xl font-bold">Añadir Producto</h2></CardHeader>
                    <CardBody>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <Select label="Producto" className="md:col-span-2" items={productCatalog} onChange={(e) => setNewProductForm(p => ({ ...p, idProducto: e.target.value, alto: '', ancho: '' }))} isRequired>
                                    {(prod) => <SelectItem key={prod.id} textValue={prod.nombre}>{prod.nombre} ({prod.tipo})</SelectItem>}
                                </Select>
                                <Input label="Cantidad" type="number" min="1" value={newProductForm.cantidad} onChange={(e) => setNewProductForm(p => ({ ...p, cantidad: e.target.value }))} isRequired />
                                {selectedProductInfo?.tipo === 'Telas' && (
                                    <>
                                        <Input label="Alto (m)" type="number" step="0.01" value={newProductForm.alto} onChange={(e) => setNewProductForm(p => ({ ...p, alto: e.target.value }))} isRequired />
                                        <Input label="Ancho (m)" type="number" step="0.01" value={newProductForm.ancho} onChange={(e) => setNewProductForm(p => ({ ...p, ancho: e.target.value }))} isRequired />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-end items-center gap-4 mt-4">
                                <p className="font-bold text-lg">Subtotal: ${newProductSubtotal.toFixed(2)}</p>
                                <Button type="submit" color="primary">Añadir</Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            )}

            {/* Tabla de Productos en la Cotización */}
            <Card>
                <CardHeader><h2 className="text-xl font-bold">Productos en la Cotización</h2></CardHeader>
                <CardBody>
                    <Table removeWrapper aria-label="Tabla de productos en la cotización">
                        <TableHeader>
                            <TableColumn>PRODUCTO</TableColumn>
                            <TableColumn>CANTIDAD</TableColumn>
                            <TableColumn>PRECIO UNIT.</TableColumn>
                            <TableColumn>SUBTOTAL</TableColumn>
                            <TableColumn>ACCIONES</TableColumn>
                        </TableHeader>
                        <TableBody items={initialProducts} emptyContent="No hay productos en esta cotización.">
                            {(item) => {
                                const itemInfo = productCatalog.find(p => p.id === item.idProducto) || {};
                                let subtotal = 0;
                                if (itemInfo.tipo === 'Telas') {
                                    subtotal = (item.alto * item.ancho * item.actual_precio) * item.cantidad;
                                } else {
                                    subtotal = item.actual_precio * item.cantidad;
                                }
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.producto_nombre}</TableCell>
                                        <TableCell>{item.cantidad}</TableCell>
                                        <TableCell>${Number(item.actual_precio).toFixed(2)} {itemInfo.tipo === 'Telas' ? '/ m²' : ''}</TableCell>
                                        <TableCell className="font-bold">${subtotal.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Tooltip content="Eliminar" color="danger">
                                                <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteProduct(item.id)} isDisabled={!canAddProducts}>
                                                    <DeleteIcon />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            }}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </>
    );
}