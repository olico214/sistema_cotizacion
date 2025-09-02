"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Home,
  Settings,
  Bell,
  Star,
  CarFront,
  ClipboardPlus,
  History,
  Car,
} from "lucide-react"; // Ejemplo de iconos
import TableTabs from "./tableStatus";

export default function TabsAdminComponent() {
  const [formData, setFormData] = useState({ name: "", icono: "", tab: "" });
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetchData();
  }, []);

  const asyncFetchData = async () => {
    try {
      const response = await fetch("/api/admin/activos/tabs");
      const data = await response.json();
      setData(data.result);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleSaveData = async (data) => {
    const response = await fetch("/api/admin/activos/tabs", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setFormData({ name: "", icono: "", tab: "" });
      toast.success("Datos guardados con éxito");
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
            label="Nombre Pestaña"
            name="name"
            type="text"
            variant="bordered"
            size="sm"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            isRequired
            label="Tab"
            name="tab"
            type="text"
            variant="bordered"
            size="sm"
            value={formData.tab}
            onChange={handleChange}
          />

          <div className="flex gap-2">
            <Button color="primary" type="submit">
              Guardar
            </Button>
            <Button
              type="button"
              variant="flat"
              onPress={() => setFormData({ name: "", icono: "", tab: "" })}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </div>
      <div className="w-2/3">
        <TableTabs data={data} refreshData={asyncFetchData} />
      </div>
    </div>
  );
}
