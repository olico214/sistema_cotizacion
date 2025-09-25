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
import { FaEdit, FaSave, FaTimes, FaKey } from "react-icons/fa"; // Importar el nuevo icono
import { toast } from "sonner";

export default function DataUsuariosComponent({ data, perfiles, id }) {
  // --- Estados existentes (sin cambios) ---
  const [name, setName] = useState(data.fullname);
  const [perfil, setPerfil] = useState(String(data.idprofile));
  const [estatus, setEstatus] = useState(data.status);
  const [isExterno, setIsExterno] = useState(data.externo);
  const [editingName, setEditingName] = useState(name);
  const [editingPerfil, setEditingPerfil] = useState(perfil);
  const [editingEstatus, setEditingEstatus] = useState(estatus);
  const [editingIsExterno, setEditingIsExterno] = useState(isExterno);
  const [isEditing, setIsEditing] = useState(false);

  // --- Nuevo estado para el botón de generar token ---
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  useEffect(() => {
    setEditingName(name);
    setEditingPerfil(perfil);
    setEditingEstatus(estatus);
    setEditingIsExterno(isExterno);
  }, [name, perfil, estatus, isExterno]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditingName(name);
    setEditingPerfil(perfil);
    setEditingEstatus(estatus);
    setEditingIsExterno(isExterno);
  };

  const handleSave = async () => {
    // Lógica de guardado (sin cambios)
    try {
      const response = await fetch('/api/usuarios/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          fullname: editingName,
          perfil: editingPerfil,
          estatus: editingEstatus,
          externo: editingIsExterno ? 1 : 0,
        }),
      });
      if (response.ok) {
        toast.success('Cambios guardados correctamente');
        setName(editingName);
        setPerfil(editingPerfil);
        setEstatus(editingEstatus);
        setIsExterno(editingIsExterno);
        setIsEditing(false);
      } else {
        toast.error('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error de red al guardar:', error);
    }
  };

  // --- NUEVA FUNCIÓN PARA GENERAR EL TOKEN ---
  const handleGenerateResetToken = async () => {
    setIsGeneratingToken(true);
    try {
      const res = await fetch('/api/usuarios/generar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: id }),
      });

      const result = await res.json();

      if (!res.ok) {
        // Si la API devuelve un error, lo mostramos
        throw new Error(result.error || 'Ocurrió un error en el servidor.');
      }

      const token = result.token;
      const resetUrl = `https://sistema.smartblinds.mx/restablecer?token=${token}`;

      // Copiar al portapapeles
      await navigator.clipboard.writeText(resetUrl);

      // Mostrar notificación de éxito
      toast.success(
        `Enlace de recuperación copiado al portapapeles!`, {
        description: `Usa este enlace para continuar: ${resetUrl}`,
        duration: 8000, // La notificación dura 8 segundos
      });

    } catch (err) {
      // Mostrar notificación de error
      toast.error(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsGeneratingToken(false);
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
        {/* El contenido del CardBody (Inputs, Selects) no cambia */}
        {/* ... (tu código de inputs y selects va aquí) ... */}
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-5">
          <Input label="Nombre Completo" value={editingName} onChange={(e) => setEditingName(e.target.value)} isReadOnly={!isEditing} variant="bordered" />
          <Input label="Correo Electrónico" value={data.email} isReadOnly variant="bordered" />
          <Select label="Estatus" selectedKeys={[editingEstatus]} onChange={(e) => setEditingEstatus(e.target.value)} isDisabled={!isEditing} variant="bordered">
            <SelectItem key="active" value="active">Activo</SelectItem>
            <SelectItem key="inactive" value="inactive">Cancelado o Inactivo</SelectItem>
            <SelectItem key="pending" value="pending">Pendiente de Confirmación</SelectItem>
          </Select>
        </div>
        {/* Columna Derecha */}
        <div className="flex flex-col gap-5">
          <Select label="Perfil del Usuario" selectedKeys={[editingPerfil]} onChange={(e) => setEditingPerfil(e.target.value)} isDisabled={!isEditing} variant="bordered">
            {perfiles.map((item) => (<SelectItem key={String(item.id)} value={String(item.id)}>{item.name}</SelectItem>))}
          </Select>
          <Checkbox isSelected={editingIsExterno} onValueChange={setEditingIsExterno} isDisabled={!isEditing} className="mt-2">Administrador</Checkbox>
        </div>
      </CardBody>

      {/* --- SE MODIFICA EL CardFooter PARA AÑADIR EL NUEVO BOTÓN --- */}
      <CardFooter className="flex justify-between items-center border-t pt-4 mt-4">
        {/* Lado izquierdo: Botón de Restablecer Contraseña */}
        <div>
          {!isEditing && (
            <Button
              color="warning"
              variant="flat"
              startContent={<FaKey />}
              onPress={handleGenerateResetToken}
              isLoading={isGeneratingToken}
              isDisabled={isEditing}
            >
              Restablecer Contraseña
            </Button>
          )}
        </div>

        {/* Lado derecho: Botones de Guardar/Cancelar (solo en modo edición) */}
        <div className="flex justify-end gap-3">
          {isEditing && (
            <>
              <Button color="danger" variant="light" startContent={<FaTimes />} onPress={handleCancel}>
                Cancelar
              </Button>
              <Button color="success" startContent={<FaSave />} onPress={handleSave}>
                Guardar
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}