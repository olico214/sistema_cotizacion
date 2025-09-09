"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Select, SelectItem, Spinner
} from "@nextui-org/react";
import ClienteComponent from "../../clientes/components/registroCliente/registrarCliente";

const initialFormState = {
    idCliente: "",
    idUser: "",
    idAgente: "",
    idTipoproyecto: "",
    id_envio: "",
};

export default function CotizacionForm({ isOpen, onClose, user }) {
    const router = useRouter();
    const [formData, setFormData] = useState(initialFormState);
    const [catalogs, setCatalogs] = useState({ clientes: [], usuarios: [], tiposProyecto: [], envios: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isCatalogsLoading, setIsCatalogsLoading] = useState(true);

    // Carga los catálogos para los Selects cuando se abre el modal
    useEffect(() => {
        if (isOpen) {

            fetchCatalogs();
        }
    }, [isOpen]);
    const fetchCatalogs = async () => {
        setIsCatalogsLoading(true);
        try {
            const res = await fetch('/api/initial-data?user=' + user);
            const data = await res.json();
            if (data.ok) setCatalogs(data.data);
        } catch (error) {
            console.error("Error al cargar catálogos", error);
        } finally {
            setIsCatalogsLoading(false);
        }
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/listado_ov', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!result.ok) throw new Error(result.error);

            // ¡Redirección! La parte clave del flujo.
            router.push(`./crear-cotizacion/${result.id}`);

        } catch (error) {
            console.error("Error al crear la cotización:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl" isDismissable={false}>
            <ModalContent>
                {(onCloseCallback) => (
                    <>
                        <ModalHeader>Crear Nueva Cotización</ModalHeader>
                        <ModalBody>
                            {isCatalogsLoading ? (
                                <Spinner label="Cargando datos..." />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex gap-1">

                                        <Select name="idCliente" label="Cliente" items={catalogs.clientes} onChange={handleSelectChange} isRequired>
                                            {(cliente) => <SelectItem key={cliente.id}>{cliente.nombre}</SelectItem>}
                                        </Select>
                                        <ClienteComponent type={"cliente"} fetchCatalogs={fetchCatalogs} />
                                    </div>

                                    <Select name="idUser" label="Vendedor" items={catalogs.usuarios} onChange={handleSelectChange} isRequired>
                                        {(usuario) => <SelectItem key={usuario.id}>{usuario.fullname}</SelectItem>}
                                    </Select>
                                    <Select name="idAgente" label="Agente" items={catalogs.usuarios} onChange={handleSelectChange} isRequired>
                                        {(usuario) => <SelectItem key={usuario.id}>{usuario.fullname}</SelectItem>}
                                    </Select>
                                    <Select name="idTipoproyecto" label="Tipo de Proyecto" items={catalogs.tiposProyecto} onChange={handleSelectChange} isRequired>
                                        {(tipo) => <SelectItem key={tipo.id}>{tipo.nombre}</SelectItem>}
                                    </Select>
                                    <Select name="id_envio" label="Método de Envío (Opcional)" items={catalogs.envios} onChange={handleSelectChange}>
                                        {(envio) => <SelectItem key={envio.id}>{envio.descripcion}</SelectItem>}
                                    </Select>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onCloseCallback}>Cancelar</Button>
                            <Button color="primary" isLoading={isLoading} onPress={handleSubmit}>Crear y Añadir Productos</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}