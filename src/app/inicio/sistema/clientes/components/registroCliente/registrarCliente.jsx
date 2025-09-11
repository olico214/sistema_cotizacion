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
    Checkbox,
    Textarea
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
    cp: '',
    tipo: ''
};

export default function ClienteComponent({ type = 'new', fetchClientes = null }) {
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
            setClientData(initialClientState); // Resets the form
            onClose(); // Closes the modal
            fetchClientes()
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
                <Button onPress={onOpen} color="primary" variant="light" className="max-w-sm">Registrar Cliente</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-h-[560px] overflow-auto">
                                    <Input
                                        isRequired
                                        label="Nombre Completo"
                                        variant="bordered"
                                        name="nombre"
                                        value={clientData.nombre}
                                        onChange={handleInputChange}
                                        className="sm:col-span-3"
                                    />
                                    <div className=" flex gap-2">

                                        <Select
                                            isRequired
                                            label="Canal de Venta"
                                            name="selected_canal_venta"
                                            variant="bordered"
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
                                        variant="bordered"
                                        value={clientData.telefono}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Email"
                                        variant="bordered"
                                        type="email"
                                        name="email"
                                        value={clientData.email}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="Tipo de cliente"
                                        selectedKeys={clientData.tipo ? [clientData.tipo] : []}
                                        variant="bordered"
                                        onChange={((e) => {
                                            console.log(e.target.value)
                                            setClientData(prev => ({ ...prev, tipo: e.target.value }));
                                        })}
                                    >
                                        <SelectItem key={"Final"} value={"Final"}>Final</SelectItem>
                                        <SelectItem key={"Intermediario"} value={"Intermediario"}>Intermediario</SelectItem>
                                        <SelectItem key={"Revendedor"} value={"Revendedor"}>Revendedor</SelectItem>
                                        <SelectItem key={"Instalador"} value={"Instalador"}>Instalador</SelectItem>
                                        <SelectItem key={"Mantenimiento"} value={"Mantenimiento"}>Mantenimiento</SelectItem>
                                    </Select>

                                    <Checkbox
                                        isSelected={clientData.frecuente}
                                        variant="bordered"
                                        onValueChange={handleCheckboxChange}
                                    >
                                        Cliente Frecuente
                                    </Checkbox>
                                    <Textarea
                                        label="Domicilio"
                                        name="domicilio"
                                        value={clientData.domicilio}
                                        onChange={handleInputChange}
                                        variant="bordered"
                                        className="sm:col-span-4"
                                    />
                                    <Input
                                        label="Estado"
                                        name="estado"
                                        value={clientData.estado}
                                        variant="bordered"
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Ciudad"
                                        name="ciudad"
                                        variant="bordered"
                                        value={clientData.ciudad}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Colonia"
                                        name="colonia"
                                        variant="bordered"
                                        value={clientData.colonia}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Codigo Postal"
                                        variant="bordered"
                                        name="cp"
                                        value={clientData.cp}
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