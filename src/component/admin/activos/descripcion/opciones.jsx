import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { getOpciones, getStatus } from "./scripts";
import { useState } from "react";
import { toast } from "sonner";

export default function OpcionesComponent({ id }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rows, setRows] = useState([]); // Estado para almacenar las filas de opciones
  const [statusOptions, setStatusOptions] = useState([]); // Estado para almacenar las opciones de estatus

  const handleOpen = async () => {
    try {
      const response = await getOpciones(id); // Obtener las opciones desde la API

      // Transformar los datos de la API al formato de rows
      const formattedRows = response.map((item, index) => ({
        indexId: index + 1, // indexId autoincremental
        id: item.id, // id de la opción (puede ser null si es nueva)
        opciones: item.opciones, // opciones es el id del estatus seleccionado
      }));

      setRows(formattedRows); // Actualizar el estado rows con los datos transformados

      const data = await getStatus(); // Obtener las opciones de estatus
      setStatusOptions(data); // Almacenar las opciones de estatus en el estado
      onOpen(); // Abrir el modal
    } catch (error) {
      console.error("Error al obtener las opciones:", error);
      toast.error("Error al cargar las opciones.");
    }
  };

  // Función para agregar una nueva fila
  const handleAddRow = () => {
    // Verifica si la última fila tiene una opción seleccionada
    const lastRow = rows[rows.length - 1];
    if (lastRow && !lastRow.opciones) {
      toast.info(
        "Debes seleccionar una opción antes de agregar una nueva fila."
      );
      return;
    }

    // Agrega una nueva fila
    const newRow = {
      indexId: rows.length + 1, // indexId autoincremental
      id: null, // id será null hasta que se guarde en la base de datos
      opciones: "", // opciones inicialmente vacío
    };
    setRows([...rows, newRow]);
  };

  // Función para actualizar el valor de una fila (selección de opción)
  const handleOptionChange = (indexId, value) => {
    const updatedRows = rows.map((row) =>
      row.indexId === indexId ? { ...row, opciones: value } : row
    );
    setRows(updatedRows);
  };

  // Función para eliminar una fila
  const handleDeleteRow = (indexId) => {
    const updatedRows = rows.filter((row) => row.indexId !== indexId);
    setRows(updatedRows);
  };

  // Función para guardar las opciones
  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/activos/opciones/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      });

      if (response.ok) {
        toast.success("Opciones guardadas correctamente.");
        console.log("Opciones guardadas:", rows);
      } else {
        toast.error("Error al guardar las opciones.");
        console.error("Error al guardar las opciones:", response.statusText);
      }
    } catch (error) {
      toast.error("Error al guardar las opciones.");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Button onPress={handleOpen} size="sm" variant="ghost">
        Ver Opciones
      </Button>
      <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Opciones de Estatus
              </ModalHeader>
              <ModalBody>
                <div>
                  <table className="w-full mt-4">
                    <thead>
                      <tr>
                        <th className="text-left">#</th>
                        <th className="text-left">Opciones</th>
                        <th className="text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.indexId}>
                          <td>{row.indexId}</td>
                          <td>
                            <select
                              value={row.opciones}
                              onChange={(e) =>
                                handleOptionChange(row.indexId, e.target.value)
                              }
                              className="p-1"
                            >
                              <option value="">Selecciona una opción</option>
                              {statusOptions.map((status) => (
                                <option key={status.id} value={status.id}>
                                  {status.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="flex gap-2">
                            <Button
                              onPress={() => handleAddRow()}
                              size="sm"
                              isIconOnly
                            >
                              +
                            </Button>
                            <Button
                              onPress={() => handleDeleteRow(row.indexId)}
                              size="sm"
                              isIconOnly
                              color="danger"
                            >
                              -
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Botón para agregar la primera fila si no hay filas */}
                  {rows.length === 0 && (
                    <Button onPress={handleAddRow} color="primary" size="sm">
                      Agregar Fila
                    </Button>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
