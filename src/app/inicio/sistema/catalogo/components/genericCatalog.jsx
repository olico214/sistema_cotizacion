"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Card, CardHeader, CardBody
} from "@nextui-org/react";

// Íconos
const EditIcon = (props) => <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props} ><path d="M17.5 2.5a2.121 2.121 0 0 1 0 3l-9.5 9.5-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
const DeleteIcon = (props) => <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props}><path d="M10 11V12M10 8V9M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;

export default function GenericCatalog({ title, apiEndpoint, columns, formFields, initialState }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState(initialState);

    const fetchItems = useCallback(async () => {
        const res = await fetch(apiEndpoint);
        const data = await res.json();
        if (data.ok) setItems(data.data);
    }, [apiEndpoint]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        setFormData(currentItem || initialState);
    }, [currentItem, initialState]);

    const handleOpenModal = (item = null) => {
        setCurrentItem(item);
        onOpen();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (onClose) => {
        const method = currentItem ? 'PUT' : 'POST';
        const body = JSON.stringify(currentItem ? { ...formData, id: currentItem.id } : formData);
        await fetch(apiEndpoint, { method, headers: { 'Content-Type': 'application/json' }, body });
        fetchItems();
        onClose();
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
            await fetch(apiEndpoint, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
            fetchItems();
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{title}</h2>
                <Button color="primary" onPress={() => handleOpenModal()}>Nuevo</Button>
            </CardHeader>
            <CardBody>
                <Table removeWrapper aria-label={`Tabla de ${title}`}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={items} emptyContent={`No hay ${title.toLowerCase()} registrados.`}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>
                                        {columnKey === 'actions' ? (
                                            <div className="flex gap-2">
                                                <Tooltip content="Editar">
                                                    <Button isIconOnly variant="light" size="sm" onPress={() => handleOpenModal(item)}><EditIcon /></Button>
                                                </Tooltip>
                                                <Tooltip content="Eliminar" color="danger">
                                                    <Button isIconOnly variant="light" size="sm" color="danger" onPress={() => handleDelete(item.id)}><DeleteIcon /></Button>
                                                </Tooltip>
                                            </div>
                                        ) : (
                                            item[columnKey]
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>{currentItem ? "Editar" : "Nuevo"} {title.slice(0, -1)}</ModalHeader>
                                <ModalBody>
                                    {formFields.map(field => (
                                        <Input
                                            key={field.name}
                                            autoFocus={formFields[0].name === field.name}
                                            label={field.label}
                                            name={field.name}
                                            type={field.type || "text"}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                            isRequired
                                        />
                                    ))}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                                    <Button color="primary" onPress={() => handleSave(onClose)}>Guardar</Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </CardBody>
        </Card>
    );
}