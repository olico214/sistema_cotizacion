"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Tooltip, Spinner
} from "@nextui-org/react";
import UserForm from "../createForm/createUser";

// Ícono de edición
const EditIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 20 20" width="1em" {...props} ><path d="M17.5 2.5a2.121 2.121 0 0 1 0 3l-9.5 9.5-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
);

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.ok) setUsers(data.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user = null) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };


    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchUsers(); // Recarga los datos de la tabla
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Usuarios del Sistema</h1>
                <Button color="primary" onPress={() => handleOpenModal()}>Nuevo Usuario</Button>
            </div>

            <Table aria-label="Tabla de usuarios">
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>TIPO</TableColumn>
                    <TableColumn>INMOBILIARIA</TableColumn>
                    <TableColumn>CIUDAD</TableColumn>
                    <TableColumn>COMISIÓN</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody items={users} isLoading={isLoading} loadingContent={<Spinner />} emptyContent="No hay usuarios registrados.">
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.fullname}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.inmobiliaria || "N/A"}</TableCell>
                            <TableCell>{item.ciudad}</TableCell>
                            <TableCell>{item.comision ? `${item.comision}%` : "N/A"}</TableCell>
                            <TableCell>
                                <Tooltip content="Editar Usuario">
                                    <Button isIconOnly variant="light" onPress={() => handleOpenModal(item)}>
                                        <EditIcon />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <UserForm
                user={currentUser}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
}