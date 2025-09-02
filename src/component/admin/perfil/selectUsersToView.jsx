"use client";
import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function SelectViewProfiles({ id }) {
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    asyncFetchData();
  }, []);
  const asyncFetchData = async () => {
    const response = await fetch("/api/admin/perfiles/grupos/" + id);
    const result = await response.json();
    const data = result.result;
    setGroups(data);
    const grupos = [];
    for (let item of result.existingUsers) {
      grupos.push(item.idGroup);
    }
    setSelected(grupos);
  };

  const handleSave = async () => {
    const data = {
      selected,
    };
    const response = await fetch("/api/admin/perfiles/grupos/" + id, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };
  return (
    <div className="p-4 shadow-md rounded-md gap-4 grid">
      <div>
        <CheckboxGroup
          orientation="horizontal"
          value={selected}
          onValueChange={setSelected}
          label="Perfiles a revisar"
        >
          {groups.map((item) => (
            <Checkbox key={item.id} value={item.id}>
              {item.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div>
        <Button onPress={handleSave} color="default" variant="bordered">
          Guardar
        </Button>
      </div>
    </div>
  );
}
