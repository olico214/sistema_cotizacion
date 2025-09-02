"use client";
import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TabsList({ data, id, results }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(results);
  }, [results, setSelected]);

  const handleSave = async () => {
    const data = {
      opciones: selected,
      id: id,
    };
    const response = await fetch("/api/admin/perfiles/tabs/" + id, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      toast.success("Datos guardados correctamente", {
        duration: 2000,
      });
    }
  };
  return (
    <div className="grid mx-auto  items-center  gap-5 shadow-md  rounded-md">
      <div className="w-full  gap-2 ">
        <CheckboxGroup
          color="primary"
          label="Tabs"
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
        <Button color="default" variant="bordered" onPress={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
