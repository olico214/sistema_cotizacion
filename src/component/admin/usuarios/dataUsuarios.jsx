"use client";

import {
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa"; // Importar iconos
import { toast } from "sonner";

export default function DataUsuariosComponent({ data, perfiles, id }) {
  // --- Estados para los valores actuales del usuario ---
  const [name, setName] = useState(data.fullname);
  const [perfil, setPerfil] = useState(String(data.idprofile)); // Asegurarse de que sea string para Select
  const [estatus, setEstatus] = useState(data.status);
  const [isExterno, setIsExterno] = useState(data.externo);

  // --- Estados para los valores temporales durante la edición ---
  const [editingName, setEditingName] = useState(name);
  const [editingPerfil, setEditingPerfil] = useState(perfil);
  const [editingEstatus, setEditingEstatus] = useState(estatus);
  const [editingIsExterno, setEditingIsExterno] = useState(isExterno);

  // --- Estado para controlar el modo de edición ---
  const [isEditing, setIsEditing] = useState(false);

  // Sincronizar estados de edición cuando cambian los estados principales
  useEffect(() => {
    setEditingName(name);
    setEditingPerfil(perfil);
    setEditingEstatus(estatus);
    setEditingIsExterno(isExterno);
  }, [name, perfil, estatus, isExterno]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar los valores temporales a los valores originales
    setEditingName(name);
    setEditingPerfil(perfil);
    setEditingEstatus(estatus);
    setEditingIsExterno(isExterno);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/usuarios/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          externo: editingIsExterno ? 1 : 0
        }),
      });
      if (response.ok) {
        toast.success('Cambios guardados correctamente');
        setIsEditing(false);
      } else {
        // Manejar errores de la API
        toast.error('Error al guardar los cambios');

        console.error('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error de red al guardar:', error);
    }


  };

  return (
    <Card className="max-w-4xl mx-auto p-4 shadow-lg bg-white">
      <CardHeader className="flex justify-between items-center border-b pb-3 mb-3">
        <h2 className="text-xl font-semibold text-gray-700">
          Información del Usuario
        </h2>
        {!isEditing && (
          <Button
            color="primary"
            variant="flat"
            startContent={<FaEdit />}
            onPress={handleEdit}
            className="text-sm font-medium"
          >
            Editar
          </Button>
        )}
      </CardHeader>

      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-5">
          <Input
            label="Nombre Completo"
            name="name"
            size="md"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            isReadOnly={!isEditing}
            variant="bordered"
            className="max-w-full"
            placeholder="Introduce el nombre"
          />

          <Input
            label="Correo Electrónico"
            name="email"
            size="md"
            value={data.email}
            isReadOnly // El correo casi siempre es de solo lectura
            variant="bordered"
            className="max-w-full"
            placeholder="Correo del usuario"
          />

          <Select
            label="Estatus"
            size="md"
            selectedKeys={[editingEstatus]} // Debe ser un array de strings
            onChange={(e) => setEditingEstatus(e.target.value)}
            isReadOnly={!isEditing}
            isDisabled={!isEditing}
            variant="bordered"
            className="max-w-full"
          >
            <SelectItem key="active" value="active">
              Activo
            </SelectItem>
            <SelectItem key="inactive" value="inactive">
              Cancelado o Inactivo
            </SelectItem>
            <SelectItem key="pending" value="pending">
              Pendiente de Confirmación
            </SelectItem>
          </Select>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-5">
          <Select
            label="Perfil del Usuario"
            size="md"
            selectedKeys={[editingPerfil]} // Debe ser un array de strings
            onChange={(e) => setEditingPerfil(e.target.value)}
            isReadOnly={!isEditing}
            isDisabled={!isEditing}
            variant="bordered"
            className="max-w-full"
          >
            {perfiles.map((item) => (
              <SelectItem key={String(item.id)} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </Select>

          <Checkbox
            isSelected={editingIsExterno}
            onValueChange={setEditingIsExterno}
            isDisabled={!isEditing}
            className="mt-2"
          >
            Administrador
          </Checkbox>
        </div>
      </CardBody>

      {isEditing && (
        <CardFooter className="flex justify-end gap-3 border-t pt-4 mt-4">
          <Button
            color="danger"
            variant="light"
            startContent={<FaTimes />}
            onPress={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            color="success"
            startContent={<FaSave />}
            onPress={handleSave}
          >
            Guardar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}