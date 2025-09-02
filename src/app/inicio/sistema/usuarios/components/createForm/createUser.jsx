"use client";

import React, { useState, useEffect } from "react";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Select, SelectItem
} from "@nextui-org/react";

const initialFormState = {
    fullname: "",
    type: "Vendedor",
    inmobiliaria: "",
    ciudad: "",
    comision: "",
};

export default function UserForm({ user, isOpen, onClose, onSaveSuccess }) {
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);

    // Efecto para llenar el formulario cuando se edita un usuario
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || "",
                type: user.type || "Vendedor",
                inmobiliaria: user.inmobiliaria || "",
                ciudad: user.ciudad || "",
                comision: user.comision || "",
            });
        } else {
            setFormData(initialFormState);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setFormData(prev => ({
            ...prev,
            type: newType,
            // Limpia el campo 'inmobiliaria' si el tipo no es 'Agente'
            inmobiliaria: newType === 'Agente' ? prev.inmobiliaria : ""
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const url = '/api/users';
        const method = user ? 'PUT' : 'POST';
        const body = JSON.stringify(user ? { ...formData, id: user.id } : formData);

        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
            if (!res.ok) throw new Error("Error al guardar el usuario");

            onSaveSuccess(); // Llama al callback para refrescar y cerrar
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false}>
            <ModalContent>
                {(onCloseCallback) => (
                    <>
                        <ModalHeader>{user ? "Editar" : "Nuevo"} Usuario</ModalHeader>
                        <ModalBody>
                            <Input name="fullname" label="Nombre Completo" value={formData.fullname} onChange={handleInputChange} isRequired />
                            <Select label="Tipo de Usuario" selectedKeys={[formData.type]} onChange={handleTypeChange} isRequired>
                                <SelectItem key="Vendedor" value="Vendedor">Vendedor</SelectItem>
                                <SelectItem key="Agente" value="Agente">Agente</SelectItem>
                            </Select>

                            {/* CAMPO CONDICIONAL */}
                            {formData.type === 'Agente' && (
                                <Input name="inmobiliaria" label="Inmobiliaria" value={formData.inmobiliaria} onChange={handleInputChange} isRequired />
                            )}

                            <Input name="ciudad" label="Ciudad" value={formData.ciudad} onChange={handleInputChange} />
                            <Input name="comision" label="Comisión" type="number" step="0.01" value={formData.comision} onChange={handleInputChange} startContent="%" />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onCloseCallback}>Cancelar</Button>
                            <Button color="primary" isLoading={isLoading} onPress={handleSubmit}>
                                {user ? "Actualizar" : "Guardar"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}