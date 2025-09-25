"use client"

import React, { useState, useEffect } from "react";
import {
    Modal, ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Select,
    SelectItem
} from "@nextui-org/react";

const initialFormData = {
    nombre: '',
    sku: '',
    descripcion: '',
    precio: '',
    costo: '',
    medidas: '',
    modeloSB: '',
    colorSB: '',
    modeloProveedor: '',
    colorProveedor: '',
    tamano: '',
    stockinicial: '',
    margen: '',
    is_automatizacion: false,
    is_persiana: false,
};

const productTypes = [
    { key: "Motores", label: "Motores" },
    { key: "servicios", label: "servicios" },
    { key: "Accesorios", label: "Accesorios" },
    { key: "Telas", label: "Telas" },
];

// Recibe `productToEdit` y `children` para el botón que abre el modal
export default function RegisterProduct({ fetchProducts, productToEdit = null, children }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [formData, setFormData] = useState(initialFormData);
    const [productType, setProductType] = useState("otro");

    // Determina si estamos en modo edición
    const isEditMode = productToEdit !== null;

    // Efecto para calcular el precio (sin cambios)
    useEffect(() => {
        const cost = parseFloat(formData.costo);
        const margin = parseFloat(formData.margen);
        if (cost > 0 && margin >= 0 && margin < 100) {
            const calculatedPrice = cost / (1 - (margin / 100));
            setFormData(prev => ({ ...prev, precio: calculatedPrice.toFixed(2) }));
        } else if (isEditMode) {
            // En modo edición, si se borra el costo, no borramos el precio necesariamente
            // podrías mantener el precio anterior o recalcular si el margen sigue ahí
        } else {
            setFormData(prev => ({ ...prev, precio: '' }));
        }
    }, [formData.costo, formData.margen, isEditMode]);


    // Popula el formulario cuando se abre el modal en modo edición
    useEffect(() => {
        if (isOpen && isEditMode) {
            // Usamos un spread para asegurarnos de que todos los campos de initialFormData estén presentes
            // y luego sobreescribimos con los datos del producto a editar.
            setFormData({ ...initialFormData, ...productToEdit });
            setProductType(productToEdit.tipo || "otro");
        }
    }, [isOpen, isEditMode, productToEdit]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        setFormData(initialFormData);
        setProductType('otro');
    };

    // Al cerrar el modal, siempre limpiamos el formulario para el siguiente uso
    const handleClose = () => {
        onOpenChange(false); // Cierra el modal
        handleClear(); // Limpia el estado
    };

    const handleSubmit = async (onClose) => {
        const url = isEditMode ? `/api/productos/${productToEdit.id}` : '/api/productos';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const dataToSend = { ...formData, tipo: productType };
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!res.ok) throw new Error(`Error: ${res.statusText}`);

            await res.json();
            fetchProducts(); // Actualiza la lista de productos
            onClose(); // Cierra el modal y limpia el formulario
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <>
            {/* Clona el botón/ícono que se le pasa y le añade la función de abrir el modal */}
            {React.cloneElement(children, { onPress: onOpen })}

            <Modal isOpen={isOpen} onOpenChange={handleClose} placement="center" size="4xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {isEditMode ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Tipo de Producto"
                                        placeholder="Selecciona un tipo"
                                        selectedKeys={productType ? [productType] : []}
                                        onChange={(e) => setProductType(e.target.value)}
                                        className="md:col-span-2"
                                    >
                                        {productTypes.map((type) => (
                                            <SelectItem key={type.key} value={type.key}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <div className="flex gap-4 md:col-span-2">
                                        <Checkbox
                                            isSelected={formData.is_automatizacion}
                                            onValueChange={isSelected => setFormData(prev => ({ ...prev, is_automatizacion: isSelected }))}
                                        >
                                            Automatización
                                        </Checkbox>
                                        <Checkbox
                                            isSelected={formData.is_persiana}
                                            onValueChange={isSelected => setFormData(prev => ({ ...prev, is_persiana: isSelected }))}
                                        >
                                            Persianas
                                        </Checkbox>
                                    </div>
                                    <Input name="nombre" label={productType === "Telas" ? "Tipo" : "Nombre"} value={formData.nombre} onChange={handleInputChange} />
                                    <Input name="sku" label="SKU" value={formData.sku} onChange={handleInputChange} />
                                    <Input name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleInputChange} className="md:col-span-2" />
                                    <Input name="tamano" label="Tamaño" value={formData.tamano} onChange={handleInputChange} />
                                    <Input name="stockinicial" label="Stock Inicial" type="number" value={formData.stockinicial} onChange={handleInputChange} />
                                    <Input name="costo" label="Costo" type="number" startContent="$" value={formData.costo} onChange={handleInputChange} isRequired />
                                    <Input name="margen" label="Margen" type="number" endContent="%" value={formData.margen} onChange={handleInputChange} />
                                    <Input name="precio" label="Precio" type="number" startContent="$" value={formData.precio} isReadOnly />

                                    {productType === 'Telas' && (
                                        <>
                                            <Input name="medidas" label="Medidas" value={formData.medidas} onChange={handleInputChange} />
                                            <Input name="modeloSB" label="Modelo SB" value={formData.modeloSB} onChange={handleInputChange} />
                                            <Input name="colorSB" label="Color SB" value={formData.colorSB} onChange={handleInputChange} />
                                            <Input name="modeloProveedor" label="Modelo Proveedor" value={formData.modeloProveedor} onChange={handleInputChange} />
                                            <Input name="colorProveedor" label="Color Proveedor" value={formData.colorProveedor} onChange={handleInputChange} />
                                        </>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                {!isEditMode && (
                                    <Button color="secondary" variant="ghost" onPress={handleClear}>
                                        Limpiar 🧹
                                    </Button>
                                )}
                                <Button color="primary" onPress={() => handleSubmit(onClose)}>
                                    {isEditMode ? 'Guardar Cambios' : 'Guardar Producto'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}