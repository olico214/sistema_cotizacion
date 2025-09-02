"use client";
import { Button, Checkbox, CheckboxGroup, select } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StatusComponent({ id, data, asigndPerfiles }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (asigndPerfiles.length > 0) {
      setSelected(asigndPerfiles);
    }
  }, [asigndPerfiles]);

  const handleSave = async () => {
    const data = {
      number: selected,
      id: id,
    };

    const response = await fetch("/api/admin/activos/perfilStatus", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Agregado con exito");
    }
  };
  return (
    <div className="shadow-md grid grid-cols-1 gap-3">
      <div>
        <CheckboxGroup
          color="primary"
          label="Selecciona Grupos"
          orientation="horizontal"
          value={selected}
          onValueChange={setSelected}
        >
          {data.map((item) => (
            <Checkbox key={item.id} value={item.id}>
              {item.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div className="p-4">
        <Button variant="ghost" onPress={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
