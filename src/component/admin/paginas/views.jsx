"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ViewPageComponent({ apps, icons }) {
  const [nombre, setNombre] = useState("");
  const [url, setUrl] = useState("");
  const [app, setApp] = useState("");
  const [id, setId] = useState(0);

  const handleSave = async () => {
    const data = {
      nombre: nombre,
      url: url,
      app: app,
      id: id,
    };

    if (!nombre || !url || !app) {
      toast.error("Debe llenar todos los campos", {
        duration: 2000,
      });
      return;
    }

    const response = await fetch("/api/admin/paginas", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("pagina creada con exito");
    }
  };
  return (
    <div className="grid grid-cols-1 gap-4 mt-10">
      <div className="grid grid-cols-3 gap-4 ">
        <div>
          <Select
            label="Aplicaciones"
            selectedKeys={[app]}
            variant="bordered"
            onChange={(e) => {
              setApp(e.target.value);
            }}
          >
            {apps.map((app) => (
              <SelectItem key={app.name}>{app.name}</SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <Input
            label="Nombre"
            name="nombre"
            variant="bordered"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
          />
        </div>

        <div>
          <Input
            label="URL"
            name="url"
            variant="bordered"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </div>
        <div className="col-span-3">
          <Button className="max-w-sm" onPress={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
