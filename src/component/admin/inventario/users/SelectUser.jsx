"use client";
import { useState, useEffect } from "react";
import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { toast } from "sonner";

export default function SelectUserComponent({ users, user, userrecords, resultalmacen }) {
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (userrecords.length > 0) {
      const newSelections = {};
      userrecords.forEach((record) => {
        newSelections[record.iduser] = record.permissions
          ? record.permissions.split(",").filter((p) => p !== "")
          : [];
      });

      setSelections((prev) => ({
        ...users.reduce((acc, u) => {
          acc[u.user] = prev[u.user] || [];
          return acc;
        }, {}),
        ...newSelections,
      }));
    }
  }, [userrecords, users]);

  const handleSelectionChange = (userId, selectedValues) => {
    setSelections((prev) => ({
      ...prev,
      [userId]: selectedValues,
    }));
  };

  const handleSave = async () => {
    const res = await fetch("/api/admin/inventarios", {
      method: "POST",
      body: JSON.stringify(selections),
      headers: {
        Authorization: user,
      },
    });

    const json = await res.json();
    if (json.ok) {
      toast.success("Datos agregados con éxito", { duration: 2000 });
    } else {
      toast.error("Error al guardar", { duration: 2000 });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="max-h-[70vh] overflow-auto space-y-6 rounded-lg border border-gray-200 shadow-sm bg-white p-4">
        {users.map((item) => (
          <div
            key={item.user}
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b pb-4"
          >
            <div className="font-semibold text-gray-800 min-w-[180px]">{item.fullname}</div>
            <CheckboxGroup
              value={selections[item.user] || []}
              onValueChange={(selected) => handleSelectionChange(item.user, selected)}
              orientation="horizontal"
              className="flex flex-wrap gap-2"
            >
              {resultalmacen.map((almacen) => (
                <Checkbox key={almacen.id} value={String(almacen.id)}>
                  {almacen.nombre}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onPress={handleSave} color="primary" className="w-full md:w-auto">
          Guardar
        </Button>
      </div>
    </div>
  );
}
