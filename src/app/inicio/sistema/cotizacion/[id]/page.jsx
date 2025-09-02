"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import CotizacionHeader from "./components/header";
import CotizacionProducts from "./components/products";

export default function CotizacionDetailPage() {
    const { id } = useParams(); // Obtiene el [id] de la URL

    // El estado principal se mantiene en el componente padre
    const [data, setData] = useState({ cotizacion: null, productos: [] });
    const [catalogs, setCatalogs] = useState({ productos: [], clientes: [], usuarios: [], tiposProyecto: [], envios: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Esta función ahora se pasará como prop para que los hijos puedan refrescar los datos
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [cotizacionRes, catalogsRes] = await Promise.all([
                fetch(`/api/cotizacion/${id}`),
                fetch('/api/initial-data')
            ]);

            const cotizacionData = await cotizacionRes.json();
            const catalogsData = await catalogsRes.json();

            if (cotizacionData.ok) setData(cotizacionData.data);
            if (catalogsData.ok) setCatalogs(catalogsData.data);

        } catch (error) {
            console.error("Error al cargar los datos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    // Carga inicial de datos
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) return <Spinner size="lg" className="flex justify-center items-center h-screen" />;
    if (!data.cotizacion) return <p className="p-8">Cotización no encontrada.</p>;

    return (
        <div className="p-4 sm:p-8 space-y-8">
            {/* Componente para el encabezado */}
            <CotizacionHeader
                cotizacion={data.cotizacion}
                catalogs={catalogs}
                onUpdate={fetchData} // Pasa la función para refrescar
            />

            {/* Componente para los productos */}
            <CotizacionProducts
                quoteId={id}
                quoteStatus={data.cotizacion.estatus}
                initialProducts={data.productos}
                productCatalog={catalogs.productos}
                onUpdate={fetchData} // Pasa la misma función para refrescar
            />
        </div>
    );
}