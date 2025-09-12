"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Select, SelectItem, Spinner,
    Autocomplete,
    AutocompleteItem,
    Input,
    Tooltip
} from "@nextui-org/react";
import ClienteComponent from "../../clientes/components/registroCliente/registrarCliente";
import { FaQuestion } from "react-icons/fa";
import Swal from "sweetalert2";

const initialFormState = {
    idCliente: "",
    idUser: "",
    idAgente: "",
    idTipoproyecto: "",
    id_envio: "",
    nombreProyecto: "",
    lineaCotizada: ""
};

const lineas = [{
    key: "Presianas Premium", value: "Presianas Premium"
},
{
    key: "Persianas Automaticas", value: "Persianas Automaticas"
},
{
    key: "Motores", value: "Motores"
},
{
    key: "Reparacion", value: "Reparacion"
},
{
    key: "Persianas Anticiclonicas", value: "Persianas Anticiclonicas"
},
{
    key: "Persianas Europeas", value: "Persianas Europeas"
},
{
    key: "Toldo Vertical", value: "Toldo Vertical"
},
{
    key: "BR Presianas", value: "BR Presianas"
},
{
    key: "BR Insumos Persianas", value: "BR Insumos Persianas"
},
{
    key: "BR Otros", value: "BR Otros"
},
{
    key: "Cortinas Premium", value: "Cortinas Premium"
}]
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
        // 1. Muestra la alerta de confirmación
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se creará una nueva cotización con los datos ingresados.",
            icon: 'question', // Un ícono de pregunta es más adecuado para confirmaciones
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡crear ahora!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            // 2. Si el usuario confirma, ejecuta el código original
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    const res = await fetch('/api/listado_ov', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });

                    const data = await res.json();
                    if (!data.ok) {
                        // Muestra un swal de error si la API devuelve un problema
                        throw new Error(data.error || 'Ocurrió un error en el servidor.');
                    }

                    // Opcional: Muestra un mensaje de éxito antes de redirigir
                    await Swal.fire({
                        title: '¡Éxito!',
                        text: 'La cotización ha sido creada correctamente.',
                        icon: 'success',
                        timer: 1500, // Cierra automáticamente después de 1.5 segundos
                        showConfirmButton: false,
                    });

                    // Redirección
                    router.push(`./crear-cotizacion/${data.id}`);

                } catch (error) {
                    console.error("Error al crear la cotización:", error);
                    // Muestra una alerta de error al usuario
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message || 'No se pudo crear la cotización. Inténtalo de nuevo.',
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        });
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

                                        <Autocomplete
                                            name="idCliente"
                                            label="Cliente"
                                            selectedKey={formData.idCliente}
                                            defaultItems={catalogs.clientes}
                                            onSelectionChange={((e) => {
                                                setFormData(prev => ({ ...prev, ["idCliente"]: e }));
                                            })} isRequired>
                                            {(cliente) => <AutocompleteItem key={cliente.id} value={cliente.nombre}>{cliente.nombre}</AutocompleteItem >}
                                        </Autocomplete>
                                        <ClienteComponent type={"cliente"} fetchCatalogs={fetchCatalogs} />
                                    </div>
                                    <Select name="lineaCotizada" label="Linea Cotizada" items={lineas} onChange={handleSelectChange} isRequired>
                                        {(envio) => <SelectItem key={envio.key}>{envio.key}</SelectItem>}
                                    </Select>
                                    <Select name="idTipoproyecto" label="Tipo de Proyecto" items={catalogs.tiposProyecto} onChange={handleSelectChange} isRequired>
                                        {(tipo) => <SelectItem key={tipo.id}>{tipo.nombre}</SelectItem>}
                                    </Select>
                                    <Select name="idUser" label="Vendedor" items={catalogs.usuarios} onChange={handleSelectChange} >
                                        {(usuario) => <SelectItem key={usuario.id}>{usuario.fullname}</SelectItem>}
                                    </Select>
                                    <Select name="idAgente" label="Agente" items={catalogs.usuarios} onChange={handleSelectChange} >
                                        {(usuario) => <SelectItem key={usuario.id}>{usuario.fullname}</SelectItem>}
                                    </Select>

                                    <Select name="id_envio" label="Método de Envío (Opcional)" items={catalogs.envios} onChange={handleSelectChange}>
                                        {(envio) => <SelectItem key={envio.id}>{envio.descripcion}</SelectItem>}
                                    </Select>

                                    <div className="flex items-center gap-2"> {/* Centra verticalmente y ajusta el espacio */}
                                        <Input
                                            label="Nombre del Proyecto"
                                            name="nombreProyecto"
                                            value={formData.nombreProyecto}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, ["nombreProyecto"]: e.target.value }));
                                            }}
                                        />
                                        <Tooltip content="Dejar vacío genera un nombre aleatorio">
                                            {/* Usamos isIconOnly y variant="light" para que se vea solo el ícono */}
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="mt-4" /* Ajusta el margen si es necesario */
                                            >
                                                <FaQuestion />
                                            </Button>
                                        </Tooltip>
                                    </div>
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