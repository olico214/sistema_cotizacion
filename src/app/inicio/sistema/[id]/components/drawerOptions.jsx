"use client";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { FaEnvelope, FaWhatsapp, FaFilePdf } from "react-icons/fa";
import { useEffect, useState } from "react";
import { generatePDF } from "./generatepdf";


export default function DrawerOptionsComponent({ id }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [data, setData] = useState(null);

    // Este useEffect ya está cargando los datos correctamente
    useEffect(() => {
        if (!id) return; // No hacer nada si no hay ID
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/cotizacion/${id}/generate`);
                if (!response.ok) throw new Error("Error al cargar la cotización");
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    // 1. Crea una función "handler" que envuelva la llamada a generatePDF
    const handleGeneratePDF = () => {
        // Verifica que los datos existan antes de generar el PDF
        if (data) {
            // 2. Llama a generatePDF pasándole los datos del estado ('data')
            generatePDF(data);
        } else {
            console.error("No se pueden generar el PDF porque no hay datos.");
            // Opcional: mostrar un toast o alerta al usuario
        }
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50">
                <Button onPress={onOpen} color="primary" size="lg" isDisabled={!data}>
                    Abrir Opciones
                </Button>
            </div>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                Selecciona una opción
                            </DrawerHeader>
                            <DrawerBody className="flex flex-col gap-2 p-4">
                                {/* Botones de Correo y WhatsApp */}
                                <Button color="primary" startContent={<FaEnvelope />}>
                                    Enviar Correo
                                </Button>
                                <Button color="success" startContent={<FaWhatsapp />}>
                                    Enviar WhatsApp
                                </Button>

                                {/* 3. Usa el nuevo handler en el evento onPress del botón */}
                                <Button
                                    color="secondary"
                                    onPress={handleGeneratePDF}
                                    startContent={<FaFilePdf />}
                                >
                                    Generar Cotización (PDF)
                                </Button>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}