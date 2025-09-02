"use client"

import { useState } from "react";
import {
    Modal, ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem
} from "@nextui-org/react";

// Objeto con el estado inicial para limpiar el formulario fácilmente
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
};

const productTypes = [
    { key: "Motores", label: "Motores" },
    { key: "servicios", label: "servicios" },
    { key: "Accesorios", label: "Accesorios" },
    { key: "Telas", label: "Telas" },
];

export default function RegisterProduct() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [productType, setProductType] = useState("otro");
    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- NUEVA FUNCIÓN PARA LIMPIAR ---
    const handleClear = () => {
        setFormData(initialFormData); // Restablece los campos del formulario
        setProductType('otro');     // Restablece el selector de tipo
    };

    const handleSubmit = async (onClose) => {
        // ... (tu lógica para enviar a la API se mantiene igual)
        try {
            const dataToSend = {
                ...formData,
                tipo: productType
            };
            console.log("Datos a enviar:", dataToSend);
            const res = await fetch("/api/productos", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            const result = await res.json();
            console.log("Producto guardado:", result);
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <>
            <Button onPress={onOpen} color="primary">Nuevo Producto</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="4xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registrar Nuevo Producto</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Tipo de Producto"
                                        placeholder="Selecciona un tipo"
                                        selectedKeys={[productType]}
                                        onChange={(e) => setProductType(e.target.value)}
                                        className="md:col-span-2"
                                    >
                                        {productTypes.map((type) => (
                                            <SelectItem key={type.key} value={type.key}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    {/* Inputs comunes y condicionales (sin cambios aquí) */}
                                    <Input name="nombre" label="Nombre" value={formData.nombre} onChange={handleInputChange} />
                                    <Input name="sku" label="SKU" value={formData.sku} onChange={handleInputChange} />
                                    <Input name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleInputChange} className="md:col-span-2" />
                                    <Input name="tamano" label="Tamaño" value={formData.tamano} onChange={handleInputChange} />
                                    <Input name="stockinicial" label="Stock Inicial" type="number" value={formData.stockinicial} onChange={handleInputChange} />
                                    <Input name="costo" label="Costo" type="number" startContent="$" value={formData.costo} onChange={handleInputChange} />
                                    <Input name="precio" label="Precio" type="number" startContent="$" value={formData.precio} onChange={handleInputChange} />
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
                                {/* --- NUEVO BOTÓN DE LIMPIEZA --- */}
                                <Button color="secondary" variant="ghost" onPress={handleClear}>
                                    Limpiar 🧹
                                </Button>
                                <Button color="primary" onPress={() => handleSubmit(onClose)}>
                                    Guardar Producto
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}