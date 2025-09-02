"use client";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CrearPerfil({ id }) {
  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [status, setStatus] = useState(false);
  const router = useRouter();

  const handleData = async () => {
    if (id > 0) {
      const response = await fetch(`/api/admin/perfiles/` + id);
      const data = await response.json();

      setDescripcion(data.result[0].descripcion);
      setName(data.result[0].name);
      setStatus(data.result[0].status);
    }
  };

  useEffect(() => {
    handleData(); // Llamada automática al montar el componente
  }, []);
  const handleSave = async () => {
    if (!name || !descripcion) {
      toast.error("Debe llenar todos los campos");
      return;
    }

    const data = {
      nombre: name,
      descripcion: descripcion,
      status: status,
      id: id,
    };

    try {
      const response = await fetch(`/api/admin/perfiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el perfil");
      }

      if (response.ok) {
        toast.success("Perfil guardado correctamente");
        if (id == 0) {
          const data = await response.json();
          router.push("/inicio/admin/perfiles/" + data.result.insertId);
        }
      }
    } catch (error) {
      console.error("Error en handleSave:", error);
      toast.error("Hubo un problema al guardar el perfil");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 shadow-md p-4">
      <div className="flex gap-2 container mx-auto">
        <Input
          label="Nombre"
          name="name"
          variant="bordered"
          className="max-w-sm"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          label="Descripción"
          name="descripcion"
          variant="bordered"
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
          }}
        />

        <Checkbox isSelected={status} onValueChange={setStatus}>
          Visible
        </Checkbox>
      </div>
      <div>
        <Button
          onPress={handleSave}
          color="default"
          variant="bordered"
          size="sm"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
