"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

const EditIcon = (props) => <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props} ><path d="M17.5 2.5a2.121 2.121 0 0 1 0 3l-9.5 9.5-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;

export default function CotizacionHeader({ cotizacion, catalogs, onUpdate }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [editFormData, setEditFormData] = useState(cotizacion);

    useEffect(() => {
        setEditFormData(cotizacion);
    }, [cotizacion]);

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateHeader = async () => {
        await fetch(`/api/cotizacion/${cotizacion.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editFormData),
        });
        onOpenChange(); // Cierra el modal
        onUpdate(); // Llama a la función del padre para refrescar
    };

    const handleStatusChange = async (newStatus) => {
        const updatedCotizacion = { ...cotizacion, estatus: newStatus };
        await fetch(`/api/cotizacion/${cotizacion.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCotizacion),
        });
        onUpdate();
    };

    const canModify = cotizacion.estatus !== 'Autorizado' && cotizacion.estatus !== 'Cancelado';

    return (
        <>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Detalles de la Cotización #{cotizacion.id}</h1>
                    <Button color="secondary" variant="flat" onPress={onOpen} isDisabled={!canModify} startContent={<EditIcon />}>
                        Editar Encabezado
                    </Button>
                </CardHeader>
                <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                        <p className="text-sm text-default-500">Cliente</p>
                        <p>{cotizacion.cliente_nombre || '...'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-default-500">Vendedor</p>
                        <p>{cotizacion.usuario_nombre || '...'}</p>
                    </div>
                    {/* CAMPO AÑADIDO PARA MOSTRAR EL ENVÍO */}
                    <div>
                        <p className="text-sm text-default-500">Método de Envío</p>
                        <p>{cotizacion.envio_descripcion || "No especificado"}</p>
                    </div>
                    <Select
                        label="Estatus de la cotización"
                        selectedKeys={[cotizacion.estatus]}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        isDisabled={!canModify}
                    >
                        <SelectItem key="Nuevo">Nuevo</SelectItem>
                        <SelectItem key="En proceso">En proceso</SelectItem>
                        <SelectItem key="Autorizado">Autorizado</SelectItem>
                        <SelectItem key="Cancelado">Cancelado</SelectItem>
                    </Select>
                </CardBody>
            </Card>

            {/* Modal para editar el encabezado */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Editar Encabezado de la Cotización</ModalHeader>
                            <ModalBody>
                                {editFormData && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Select name="idCliente" label="Cliente" items={catalogs.clientes} selectedKeys={[String(editFormData.idCliente)]} onChange={handleEditFormChange} isRequired>
                                            {(item) => <SelectItem key={item.id}>{item.nombre}</SelectItem>}
                                        </Select>
                                        <Select name="idUser" label="Vendedor" items={catalogs.usuarios} selectedKeys={[String(editFormData.idUser)]} onChange={handleEditFormChange} isRequired>
                                            {(item) => <SelectItem key={item.id}>{item.fullname}</SelectItem>}
                                        </Select>
                                        <Select name="idTipoproyecto" label="Tipo de Proyecto" items={catalogs.tiposProyecto} selectedKeys={[String(editFormData.idTipoproyecto)]} onChange={handleEditFormChange} isRequired>
                                            {(item) => <SelectItem key={item.id}>{item.nombre}</SelectItem>}
                                        </Select>
                                        <Select name="id_envio" label="Método de Envío" items={catalogs.envios} selectedKeys={[String(editFormData.id_envio)]} onChange={handleEditFormChange}>
                                            {(item) => <SelectItem key={item.id}>{item.descripcion}</SelectItem>}
                                        </Select>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                                <Button color="primary" onPress={handleUpdateHeader}>Guardar Cambios</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}