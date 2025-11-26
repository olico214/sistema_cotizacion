"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Switch,
    AutocompleteItem,
    Autocomplete,
    Textarea
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// --- Iconos SVG ---
const DeleteIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props}>
        <path d="M10 11V12M10 8V9M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
);
const SaveIcon = (props) => (
    <svg {...props} aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);




// --- Componente Principal ---
export default function CotizacionProductsUsuarios({ aumentos, preciosInstalacion, quoteId, quoteStatus, initialProducts, productCatalog, onUpdate, descuento, comisionVendedor, comisionAgente, proteccion, isAdmin }) {
    const route = useRouter();
    const [products, setProducts] = useState([]);
    const [toleracion, setTolerancia] = useState(0.15)
    // --- Estados para nuevas funcionalidades ---
    const [precioFinalManual, setPrecioFinalManual] = useState("");
    const [precioFinalError, setPrecioFinalError] = useState("");
    const [incluyeIVA, setIncluyeIVA] = useState(false);

    // --- Estado del formulario para añadir producto ---
    const [newProductForm, setNewProductForm] = useState({
        idProducto: "",
        cantidad: 1,
        alto: "",
        ancho: "",
        margen: "",
        usarMargen: true,
        ubicacion: ""
    });
    const getPrecioInstalacion = (cantidadTelas) => {
        if (cantidadTelas === 0) return 0;
        const tier = preciosInstalacion.find(p => cantidadTelas >= p.minimo && cantidadTelas <= p.maximo);
        return tier ? tier.precio : 0;
    };

    // --- Función principal de recálculo ---
    const recalculateAllProducts = (productList) => {
        const cantidadTelas = productList.filter(p => p.producto_tipo === 'Telas').length;
        const costoInstalacionUnificado = getPrecioInstalacion(cantidadTelas);
        const totProducts = productList.length
        const aumentoPorcentaje = (totProducts, costoBaseProducto) => {
            for (const i of aumentos) {
                if (totProducts >= i.piezas_minimas && totProducts <= i.piezas_maximas) {
                    const aumento = i.descuento || 0;
                    return costoBaseProducto + (costoBaseProducto * (aumento / 100));
                }
            }
            return costoBaseProducto + (costoBaseProducto * (0 / 100));
        }

        return productList.map(item => {
            let costoBaseProducto = (item.producto_tipo === 'Telas')
                ? (item.alto * item.ancho * (item.actual_costo || 0)) * item.cantidad
                : (item.actual_costo || 0) * item.cantidad;
            costoBaseProducto = aumentoPorcentaje(totProducts, costoBaseProducto);
            let proteccionMonto = 0;
            if (item.producto_tipo === 'Telas') {
                proteccionMonto = costoBaseProducto * ((parseFloat(proteccion) / 100) || 0);
            }

            const instalacionMonto = item.producto_tipo === 'Telas' ? costoInstalacionUnificado * item.cantidad : 0;
            const costoTotal = costoBaseProducto + proteccionMonto + instalacionMonto;

            const divisor = (1 - (parseFloat(item.margen) / 100 || 0))
                * (1 - (parseFloat(descuento) / 100 || 0))
                * (1 - (parseFloat(comisionAgente) / 100 || 0))
                * (1 - (parseFloat(comisionVendedor) / 100 || 0));

            const subtotalLinea = divisor > 0 ? costoTotal / divisor : costoTotal;
            const precioPorPieza = item.cantidad > 0 ? subtotalLinea / item.cantidad : 0;

            const precioPostMargen = costoTotal / (1 - (parseFloat(item.margen) / 100 || 0));
            const precioPostDescuento = precioPostMargen / (1 - (parseFloat(descuento) / 100 || 0));
            const precioPostAgente = precioPostDescuento / (1 - (parseFloat(comisionAgente) / 100 || 0));

            return {
                ...item,
                calculated: {
                    costoBase: costoBaseProducto,
                    proteccion: proteccionMonto,
                    instalacion: instalacionMonto,
                    margen: precioPostMargen - costoTotal,
                    descuento: precioPostDescuento - precioPostMargen,
                    comisionAgente: precioPostAgente - precioPostDescuento,
                    comisionVendedor: subtotalLinea - precioPostAgente,
                    precioPieza: precioPorPieza,
                    subtotal: subtotalLinea
                }
            };
        });
    };

    useEffect(() => {
        const recalculated = recalculateAllProducts(initialProducts);
        setProducts(recalculated);
    }, [initialProducts, proteccion, descuento, comisionVendedor, comisionAgente]);

    const selectedProductInfo = useMemo(() => {
        return productCatalog.find(p => p.id == newProductForm.idProducto);
    }, [newProductForm.idProducto, productCatalog]);

    // --- Lógica de cálculo de totales centralizada ---
    const totals = useMemo(() => {
        const subtotalGeneral = products.reduce((acc, item) => acc + (item.calculated?.subtotal || 0), 0);

        const precioFinalNum = parseFloat(precioFinalManual) || 0;
        const minPrecioPermitido = (subtotalGeneral - (subtotalGeneral * (descuento * 0.01))) * 0.90;

        const esPrecioManualValido = precioFinalNum > 0 && (!isAdmin && precioFinalNum >= minPrecioPermitido || isAdmin);

        // La base para todos los cálculos es el precio manual (si es válido) o el subtotal calculado.
        const baseParaCalculo = esPrecioManualValido ? precioFinalNum : subtotalGeneral - (subtotalGeneral * (descuento * 0.01));
        const descuentototal = (subtotalGeneral * (descuento * 0.01))
        // --- CORRECCIÓN EN LÓGICA DE IVA ---
        // El IVA siempre se calcula SOBRE la `baseParaCalculo`.
        const montoIVA = baseParaCalculo * 0.16;
        // El total final incluye el IVA solo si el switch está activado.
        const totalFinal = incluyeIVA ? baseParaCalculo + montoIVA : baseParaCalculo;

        // --- La lógica de prorrateo se ajusta para usar la base correcta ---
        const descuentoManualAbsoluto = esPrecioManualValido ? subtotalGeneral - baseParaCalculo : 0;
        const subtotalTelas = products.filter(p => p.producto_tipo === 'Telas').reduce((acc, item) => acc + (item.calculated?.subtotal || 0), 0);
        const subtotalOtros = subtotalGeneral - subtotalTelas;
        const porcTelas = subtotalGeneral > 0 ? (subtotalTelas / subtotalGeneral) * 100 : 0;
        const porcOtros = 100 - porcTelas;

        const prorrateo = {
            telas: {
                subtotal: subtotalTelas,
                porcentaje: porcTelas,
                descuentoAplicado: descuentoManualAbsoluto * (porcTelas / 100),
                nuevoTotal: subtotalTelas - (descuentoManualAbsoluto * (porcTelas / 100)),
            },
            otros: {
                subtotal: subtotalOtros,
                porcentaje: porcOtros,
                descuentoAplicado: descuentoManualAbsoluto * (porcOtros / 100),
                nuevoTotal: subtotalOtros - (descuentoManualAbsoluto * (porcOtros / 100)),
            }
        };

        return {
            subtotalGeneral,
            minPrecioPermitido,
            prorrateo,
            // Valores para mostrar en el resumen
            subtotalAntesIVA: baseParaCalculo, // Este es el subtotal sobre el que se calcula el IVA
            montoIVA,
            totalFinal,
            descuentototal
        };
    }, [products, precioFinalManual, isAdmin, incluyeIVA]);

    // --- Validador para el campo de precio final ---
    useEffect(() => {
        const precioFinalNum = parseFloat(precioFinalManual) || 0;
        if (precioFinalNum > 0 && !isAdmin && precioFinalNum < totals.minPrecioPermitido) {
            setPrecioFinalError(`Mínimo permitido: $${totals.minPrecioPermitido.toFixed(2)}`);
        } else {
            setPrecioFinalError("");
        }
    }, [precioFinalManual, isAdmin, totals.minPrecioPermitido]);

    // --- Handlers para acciones ---
    const handleAddProduct = (e) => {
        e.preventDefault();
        if (!selectedProductInfo) return;
        const newProductData = {
            id: `local-${Date.now()}`,
            idProducto: newProductForm.idProducto,
            sku: selectedProductInfo.sku,
            cantidad: parseInt(newProductForm.cantidad, 10),
            alto: parseFloat(newProductForm.alto) || null,
            ancho: parseFloat(newProductForm.ancho) || null,
            actual_costo: parseFloat(selectedProductInfo.costo) || 0,
            margen: newProductForm.usarMargen ? newProductForm.margen : 0,
            ubicacion: newProductForm.ubicacion ? newProductForm.ubicacion : "",
            producto_nombre: selectedProductInfo.nombre,
            producto_tipo: selectedProductInfo.tipo,
            description: selectedProductInfo.tipo == "Telas"
                ?
                `Persianas Manuales de ${newProductForm.ubicacion}, ${newProductForm.cantidad} pieza de ${parseFloat(newProductForm.ancho) + parseFloat(toleracion)} metros de ancho por ${parseFloat(newProductForm.alto) + parseFloat(toleracion)} metros de alto, tipo ${selectedProductInfo.type} modelo ${selectedProductInfo.modeloSB} color ${selectedProductInfo.colorSB}`
                : selectedProductInfo.descripcion,
            newMedidas: selectedProductInfo.tipo == "Telas"
                ?
                `${parseFloat(newProductForm.ancho) + parseFloat(toleracion)} mts x ${parseFloat(newProductForm.alto) + parseFloat(toleracion)} mts.`
                : selectedProductInfo.tamano
        };
        const updatedList = recalculateAllProducts([...products, newProductData]);
        setProducts(updatedList);
        setNewProductForm({ idProducto: newProductForm.idProducto, cantidad: 1, alto: "", ancho: "", margen: newProductForm.usarMargen ? newProductForm.margen : "", usarMargen: true, ubicacion: "" });
    };

    const handleDeleteProduct = (productId) => {
        const filteredList = products.filter(p => p.id !== productId);
        const updatedList = recalculateAllProducts(filteredList);
        setProducts(updatedList);
    };

    const handleSaveProducts = async () => {
        const result = await Swal.fire({
            title: '¿Guardar y Finalizar?',
            html: "Estás a punto de guardar los productos. <br>Una vez guardada, la lista quedará en modo de <b>solo lectura</b>.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const productsToSave = products.map(item => ({
                idCotizacion: quoteId,
                idproducto: item.idProducto,
                cantidad: item.cantidad,
                costo_pieza: item.actual_costo,
                proteccion: item.calculated.proteccion,
                instalacion: item.calculated.instalacion,
                margen: item.calculated.margen,
                pormargen: item.margen,
                preciounico: item.calculated.precioPieza,
                preciototal: item.calculated.subtotal,
                alto: item.alto,
                ancho: item.ancho,
                ubicacion: item.ubicacion,
                comision_agente: item.calculated.comisionAgente,
                comision_vendedor: item.calculated.comisionVendedor,
                descuento: item.calculated.descuento,
                newDescription: item.description,
                newMedidas: item.newMedidas
            }));
            const precioNormal = totals.subtotalGeneral;
            const precioReal = precioFinalManual ? parseFloat(precioFinalManual) : totals.totalFinal;
            const iva = incluyeIVA ? totals.montoIVA : 0;





            try {
                const response = await fetch(`/api/cotizacion/${quoteId}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ products: productsToSave, precioNormal, precioReal, iva, descuento, toleracion }),
                });
                if (!response.ok) throw new Error('Error al guardar los productos');

                Swal.fire({
                    title: '¡Cotización Creada!',
                    text: "¿Qué te gustaría hacer ahora?",
                    icon: 'success',
                    showDenyButton: true,
                    confirmButtonText: 'Ver Detalles',
                    denyButtonText: 'Crear Nueva Cotización',
                }).then((result) => {
                    if (result.isConfirmed) route.push(`/inicio/sistema/${quoteId}`);
                    else if (result.isDenied) route.push('/inicio/sistema/crear-cotizacion');
                });
            } catch (error) {
                console.error("Error en handleSaveProducts:", error);
                Swal.fire('Error', 'Hubo un problema al guardar los productos.', 'error');
            }
        }
    };

    const canAddProducts = quoteStatus !== 'Finalizado' && quoteStatus !== 'Cancelado';

    return (
        <div className="space-y-6">
            {canAddProducts && (
                <Card>
                    <CardHeader><h2 className="text-xl font-bold">Añadir Producto</h2></CardHeader>
                    <CardBody>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <Autocomplete
                                    label="Producto"
                                    defaultItems={productCatalog}
                                    selectedKey={newProductForm.idProducto}
                                    className="md:col-span-2"
                                    onSelectionChange={(e) => {
                                        const selected = productCatalog.find(p => p.id == e);
                                        setNewProductForm(p => ({ ...p, idProducto: e, alto: '', ancho: '', margen: selected?.margen || '' }));
                                    }}
                                    isRequired
                                >
                                    {(prod) => <AutocompleteItem key={prod.id} textValue={`${prod.sku} ${prod.type} ${prod.modeloSB} ${prod.colorSB}`}>{prod.tipo === 'Telas' ? `${prod.sku} ${prod.type} ${prod.modeloSB} ${prod.colorSB}` : prod.nombre} ({prod.tipo})</AutocompleteItem>}
                                </Autocomplete>
                                <Input label="Cantidad" type="number" min="1" value={newProductForm.cantidad} onValueChange={(v) => setNewProductForm(p => ({ ...p, cantidad: v }))} isRequired />
                                {selectedProductInfo?.tipo === 'Telas' && (
                                    <>
                                        <Input label="Tolerancia" type="number" step="0.01" value={toleracion} onChange={(e) => setTolerancia(e.target.value)} isRequired />
                                        <Input label="Ancho (m)" type="number" step="0.01" value={newProductForm.ancho} onValueChange={(v) => setNewProductForm(p => ({ ...p, ancho: v }))} isRequired />
                                        <Input label="Alto (m)" type="number" step="0.01" value={newProductForm.alto} onValueChange={(v) => setNewProductForm(p => ({ ...p, alto: v }))} isRequired />
                                        <Textarea className="md:col-span-4" label="Ubicacion" type="text" value={newProductForm.ubicacion} onValueChange={(u) => setNewProductForm(p => ({ ...p, ubicacion: u }))} isRequired />
                                    </>
                                )}
                                {isAdmin && (
                                    <div className="flex flex-col gap-2 justify-end h-full md:col-span-1">

                                        {newProductForm.usarMargen && (
                                            <Input label="Margen (%)" type="number" value={newProductForm.margen} onValueChange={(v) => setNewProductForm(p => ({ ...p, margen: v }))} isRequired />
                                        )}
                                    </div>

                                )}
                            </div>
                            <Button type="submit" color="primary" isDisabled={!selectedProductInfo || (selectedProductInfo.tipo === 'Telas' && (!newProductForm.alto || !newProductForm.ancho))}>Añadir</Button>
                        </form>
                    </CardBody>
                </Card>
            )}

            {(precioFinalManual > 0 && !precioFinalError) && (
                <Card className="bg-blue-50 border border-blue-200">
                    <CardHeader><h3 className="text-lg font-semibold text-blue-800">Resumen de Prorrateo</h3></CardHeader>
                    <CardBody className="space-y-3">
                        <p className="text-sm text-gray-600">El descuento manual de <span className="font-bold">${(totals.subtotalGeneral - totals.subtotalAntesIVA).toFixed(2)}</span> se distribuye proporcionalmente:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <p className="font-bold text-blue-700">Telas ({totals.prorrateo.telas.porcentaje.toFixed(1)}%)</p>
                                <p className="text-xs text-gray-500">Subtotal Original: ${totals.prorrateo.telas.subtotal.toFixed(2)}</p>
                                <p className="text-xs text-red-500">Desc. Aplicado: -${totals.prorrateo.telas.descuentoAplicado.toFixed(2)}</p>
                                <p className="font-semibold mt-1">Nuevo Total: ${totals.prorrateo.telas.nuevoTotal.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <p className="font-bold text-blue-700">Otros Productos ({totals.prorrateo.otros.porcentaje.toFixed(1)}%)</p>
                                <p className="text-xs text-gray-500">Subtotal Original: ${totals.prorrateo.otros.subtotal.toFixed(2)}</p>
                                <p className="text-xs text-red-500">Desc. Aplicado: -${totals.prorrateo.otros.descuentoAplicado.toFixed(2)}</p>
                                <p className="font-semibold mt-1">Nuevo Total: ${totals.prorrateo.otros.nuevoTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            <Card>
                <CardHeader><h2 className="text-xl font-bold">Productos en la Cotización</h2></CardHeader>
                <CardBody>
                    <Table
                        removeWrapper
                        aria-label="Tabla de productos en la cotización"
                        bottomContent={
                            <div className="flex flex-col items-end gap-4 p-4 border-t-2 border-default-200">
                                <div className="w-full max-w-sm space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-default-500">Subtotal Calculado</span>
                                        <span className="font-semibold">${totals.subtotalGeneral.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-default-500">Descuento</span>
                                        <span className="font-semibold">${totals.descuentototal.toFixed(2)}</span>
                                    </div>
                                    <Input
                                        label="Precio Final (Opcional)"
                                        type="number"
                                        placeholder="0.00"
                                        size="sm"
                                        value={precioFinalManual}
                                        onValueChange={setPrecioFinalManual}
                                        isInvalid={!!precioFinalError}
                                        errorMessage={precioFinalError}
                                        startContent={<span className="text-default-400 text-small">$</span>}
                                        description={!isAdmin && `Mínimo: $${totals.minPrecioPermitido.toFixed(2)}`}
                                    />
                                    <Switch isSelected={incluyeIVA} onValueChange={setIncluyeIVA}>Incluir IVA (16%)</Switch>
                                    <hr className="my-2" />
                                    {incluyeIVA && (
                                        <>
                                            <div className="flex justify-between text-default-600">
                                                <span>Subtotal antes de IVA</span>
                                                <span>${totals.subtotalAntesIVA.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-default-600">
                                                <span>IVA (16%)</span>
                                                <span>+${totals.montoIVA.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between w-full font-bold text-lg text-success-600">
                                        <span>{incluyeIVA ? 'Total (IVA Incluido)' : 'Total General'}</span>
                                        <span>${totals.totalFinal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <TableHeader>
                            <TableColumn>PRODUCTO</TableColumn>
                            <TableColumn>Medidas</TableColumn>
                            <TableColumn>Descripcion</TableColumn>
                            <TableColumn>CANT.</TableColumn>

                            <TableColumn>PRECIO P/PZA</TableColumn>
                            <TableColumn>SUBTOTAL</TableColumn>
                            <TableColumn>ACCIONES</TableColumn>
                        </TableHeader>
                        <TableBody items={products} emptyContent="No hay productos en esta cotización.">
                            {(item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.newMedidas}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.cantidad}</TableCell>

                                    <TableCell className="font-semibold">${(item.calculated?.precioPieza || 0).toFixed(2)}</TableCell>
                                    <TableCell className="font-bold">${(item.calculated?.subtotal || 0).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Tooltip content="Eliminar" color="danger">
                                            <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteProduct(item.id)} isDisabled={!canAddProducts}>
                                                <DeleteIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
                <CardFooter className="flex justify-end border-t-2 border-default-200">
                    <Button
                        color="success"
                        variant="flat"
                        onPress={handleSaveProducts}
                        isDisabled={
                            !canAddProducts ||
                            products.length === 0 ||
                            (!!precioFinalManual && parseFloat(precioFinalManual) < totals.totalFinal)
                        }
                        startContent={<SaveIcon className="w-5 h-5" />}
                    >
                        Guardar Cambios en Productos
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}