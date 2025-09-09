"use client"

import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Checkbox
} from "@nextui-org/react";
import CanalVentaComponent from "./canal_venta/registrarCanalVenta";

// Defines the initial empty state for the form
const initialClientState = {
    nombre: '',
    telefono: '',
    email: '',
    domicilio: '',
    estado: '',
    ciudad: '',
    colonia: '',
    frecuente: false,
    selected_canal_venta: '',
};

export default function ClienteComponent({ type = 'new', fetchCatalogs = null }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [clientData, setClientData] = useState(initialClientState);
    const [canalesVenta, setCanalesVenta] = useState([]); // State for sales channels

    // Fetches sales channels when the modal is opened


    useEffect(() => {
        if (isOpen) {
            const fetchCanales = async () => {
                try {
                    // This endpoint needs to be created to fetch sales channels
                    const res = await fetch('/api/canales');
                    const data = await res.json();
                    if (data.ok) {
                        setCanalesVenta(data.data);
                    }
                } catch (error) {
                    console.error("Error fetching sales channels:", error);
                }
            };
            fetchCanales();
        }
    }, [isOpen]);

    // Handles changes in form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    // Handles changes in the select component
    const handleSelectChange = (e) => {
        setClientData(prev => ({ ...prev, selected_canal_venta: e.target.value }));
    };

    // Handles changes in the checkbox component
    const handleCheckboxChange = (isSelected) => {
        setClientData(prev => ({ ...prev, frecuente: isSelected }));
    };

    // Submits the form data to the API
    const handleSubmit = async (onClose) => {
        console.log("Submitting client data:", clientData);
        try {
            // This endpoint needs to be created to save the new client
            const res = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData),
            });

            if (!res.ok) {
                throw new Error('Failed to save client');
            }

            const result = await res.json();
            fetchCatalogs()
            setClientData(initialClientState); // Resets the form
            onClose(); // Closes the modal
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <>
            {type === 'new'
                ?
                <Button onPress={onOpen} color="primary">Registrar Cliente</Button>
                :
                <Button onPress={onOpen} color="primary" variant="light">Registrar Cliente</Button>
            }
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="5xl"
                isDismissable={false}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registro de Nuevo Cliente</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Input
                                        isRequired
                                        label="Nombre Completo"
                                        name="nombre"
                                        value={clientData.nombre}
                                        onChange={handleInputChange}
                                        className="sm:col-span-2"
                                    />
                                    <div className=" flex gap-2">

                                        <Select
                                            isRequired
                                            label="Canal de Venta"
                                            name="selected_canal_venta"
                                            selectedKeys={clientData.selected_canal_venta ? [clientData.selected_canal_venta] : []}
                                            onChange={handleSelectChange}
                                        >
                                            {canalesVenta.map((canal) => (
                                                <SelectItem key={canal.id} value={canal.id}>
                                                    {canal.nombre}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <CanalVentaComponent />
                                    </div>
                                    <Input
                                        label="Teléfono"
                                        name="telefono"
                                        value={clientData.telefono}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={clientData.email}
                                        onChange={handleInputChange}
                                    />
                                    <Checkbox
                                        isSelected={clientData.frecuente}
                                        onValueChange={handleCheckboxChange}
                                    >
                                        Cliente Frecuente
                                    </Checkbox>
                                    <Input
                                        label="Domicilio"
                                        name="domicilio"
                                        value={clientData.domicilio}
                                        onChange={handleInputChange}
                                        className="sm:col-span-3"
                                    />
                                    <Input
                                        label="Estado"
                                        name="estado"
                                        value={clientData.estado}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Ciudad"
                                        name="ciudad"
                                        value={clientData.ciudad}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Colonia"
                                        name="colonia"
                                        value={clientData.colonia}
                                        onChange={handleInputChange}
                                    />


                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => {
                                    setClientData(initialClientState); // Resets form on cancel
                                    onClose();
                                }}>
                                    Cancelar
                                </Button>
                                <Button color="primary" onPress={() => handleSubmit(onClose)}>
                                    Guardar Cliente
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}