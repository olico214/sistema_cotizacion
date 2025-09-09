import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const API_URL = '/api/condiciones-generales';

export default function CondicionesGeneralesComponent() {
    const [condiciones, setCondiciones] = useState([]);
    const [nuevaCondicion, setNuevaCondicion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCondiciones = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('No se pudo conectar con el servidor.');
                }
                const data = await response.json();
                setCondiciones(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error al cargar las condiciones:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCondiciones();
    }, []);

    // ... imports and component setup

    const guardarCondiciones = async (condicionesActualizadas) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(condicionesActualizadas),
            });

            if (!response.ok) {
                throw new Error('Error al guardar los cambios.');
            }

            // ✨ CORRECCIÓN AQUÍ ✨
            // Procesa la respuesta del servidor que ahora contiene la lista actualizada
            // con los IDs correctos de la base de datos.
            const data = await response.json();

            // Sincroniza el estado del frontend con los datos del backend.
            setCondiciones(data);

            console.log("Cambios guardados y estado sincronizado.");

        } catch (err) {
            setError(err.message);
            console.error("Error al guardar las condiciones:", err);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(condiciones);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const updatedItems = items.map((item, index) => ({ ...item, orden: index }));

        // No es necesario llamar a setCondiciones aquí, ya que guardarCondiciones lo hará.
        // setCondiciones(updatedItems); 
        guardarCondiciones(updatedItems);
    };

    const agregarCondicion = () => {
        if (nuevaCondicion.trim() === '') return;

        const nueva = {
            // El ID temporal es correcto para la UI, el backend lo reemplazará.
            id: `temp-${Date.now()}`,
            texto_condicion: nuevaCondicion,
            orden: condiciones.length,
        };

        const nuevasCondiciones = [...condiciones, nueva];
        // Tampoco es necesario llamar a setCondiciones aquí.
        setNuevaCondicion('');
        guardarCondiciones(nuevasCondiciones);
    };

    // ... return statement remains the same

    if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando condiciones...</p>;
    if (error) return <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Condiciones Generales</h2>

            <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
                <input
                    type="text"
                    value={nuevaCondicion}
                    onChange={(e) => setNuevaCondicion(e.target.value)}
                    placeholder="Escribe una nueva condición"
                    style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button
                    onClick={agregarCondicion}
                    style={{ padding: '10px 15px', border: 'none', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Agregar
                </button>
            </div>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="condiciones">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr auto', backgroundColor: '#f7f7f7', fontWeight: 'bold', borderBottom: '1px solid #ddd', alignItems: 'center' }}>
                                <div style={{ padding: '10px', textAlign: 'center' }}>Orden</div>
                                <div style={{ padding: '10px' }}>Descripción</div>
                            </div>
                            {condiciones.map((condicion, index) => (
                                <Draggable key={condicion.id} draggableId={String(condicion.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '50px 1fr',
                                                alignItems: 'center',
                                                padding: '10px',
                                                borderBottom: '1px solid #eee',
                                                backgroundColor: 'white',
                                                userSelect: 'none',
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <span style={{ textAlign: 'center', color: '#888' }}>{index + 1}</span>
                                            <span>{condicion.texto_condicion}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}