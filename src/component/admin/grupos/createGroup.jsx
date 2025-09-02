"use client";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import TableGroups from "./tableGroups";
import { toast } from "sonner";

export default function GruposComponent() {
  const [formData, setFormData] = useState({ name: "", descripcion: "" });
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetchData();
  }, []);

  const asyncFetchData = async () => {
    try {
      const response = await fetch("/api/admin/grupos");
      const data = await response.json();
      console.log(data.result);
      setData(data.result);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleSaveData = async (data) => {
    const response = await fetch("/api/admin/grupos", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setFormData({ name: "", descripcion: "" }); // Limpiar formulario después de guardar
      toast.success("Datos Guardados con exito");
      asyncFetchData();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex p-4">
      <div className="w-1/3">
        <form
          className="w-full max-w-xs flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveData(formData);
          }}
        >
          <Input
            isRequired
            label="Nombre Grupo"
            name="name"
            type="text"
            variant="bordered"
            size="sm"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            isRequired
            label="Descripción"
            size="sm"
            variant="bordered"
            name="descripcion"
            type="text"
            value={formData.descripcion}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <Button color="primary" type="submit">
              Guardar
            </Button>
            <Button
              type="button"
              variant="flat"
              onPress={() => setFormData({ name: "", descripcion: "" })}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </div>
      <div className="w-2/3">
        <TableGroups data={data} />
      </div>
    </div>
  );
}
