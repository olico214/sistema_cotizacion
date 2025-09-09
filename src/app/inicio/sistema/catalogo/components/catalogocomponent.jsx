"use client";

import CondicionesGeneralesComponent from "./condicionesGenerales";
import GenericCatalog from "./genericCatalog";

// Configuración para el catálogo "Tipos de Proyecto"
const tipoProyectoConfig = {
    title: "Tipos de Proyecto",
    apiEndpoint: "/api/proyectos/tipos",
    columns: [
        { key: "nombre", label: "Nombre" },
        { key: "actions", label: "Acciones" },
    ],
    formFields: [
        { name: "nombre", label: "Nombre del Tipo de Proyecto" },
    ],
    initialState: { nombre: "" },
};

const instalacion = {
    title: "Instalacion",
    apiEndpoint: "/api/instalacion",
    columns: [
        { key: "minimo", label: "Minimo" },
        { key: "maximo", label: "Maximo" },
        { key: "precio", label: "Precio" },
        { key: "actions", label: "Acciones" },
    ],
    formFields: [
        { name: "minimo", label: "Minimo" },
        { name: "maximo", label: "Maximo" },
        { name: "precio", label: "Precio" },
    ],
    initialState: { minimo: "", maximo: "", precio: "" },
};

const descuento = {
    title: "Descuentos",
    apiEndpoint: "/api/descuentos",
    columns: [
        { key: "descuento", label: "Descuento" },
        { key: "titulo", label: "Titulo" },
        { key: "comentario", label: "Comentario" },
    ],
    formFields: [
        { name: "descuento", label: "Descuento Global" },
        { name: "titulo", label: "Titulo" },
        { name: "comentario", label: "Comentario" },
    ],
    initialState: { descuento: "", titulo: "", comentario: "" },
};

// Configuración para el catálogo "Métodos de Envío"
const envioConfig = {
    title: "Métodos de Envío",
    apiEndpoint: "/api/envios",
    columns: [
        { key: "descripcion", label: "Descripción" },
        { key: "sku", label: "SKU" },
        { key: "precio", label: "Precio" },
        { key: "costo", label: "Costo" },
        { key: "actions", label: "Acciones" },
    ],
    formFields: [
        { name: "descripcion", label: "Descripción" },
        { name: "sku", label: "SKU" },
        { name: "tamano", label: "Tamaño" },
        { name: "precio", label: "Precio", type: "number" },
        { name: "costo", label: "Costo", type: "number" },
    ],
    initialState: { sku: "", descripcion: "", tamano: "", precio: "", costo: "" },
};

export default function CatalogosPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-8">

            <GenericCatalog {...tipoProyectoConfig} />
            <GenericCatalog {...envioConfig} />
            <div className="lg:col-span-2">
                <GenericCatalog {...descuento} />
            </div>
            <div className="lg:col-span-2">

                <GenericCatalog {...instalacion} />
            </div>
            <div className="lg:col-span-2">

                <CondicionesGeneralesComponent />
            </div>
        </div>
    );
}