import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Chip,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AsignUsuarios({ item }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [userstmp, setUserstmp] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleGetData = async () => {
    const response = await fetch(`/api/admin/grupos/profile/${item.id}`);
    const data = await response.json();

    // Obtener las listas de perfiles y seleccionados
    const profiles = JSON.parse(data.result[0].profiles) || [];
    const selecteds = JSON.parse(data.result[0].selecteds) || [];

    setUsers(profiles); // Guarda la lista completa
    setUserstmp(profiles); // Copia la lista para manipularla

    // Filtrar los usuarios seleccionados antes de actualizar el estado
    const selectedUsersList = profiles.filter((user) =>
      selecteds.some((selected) => selected.id === user.id)
    );

    // Filtrar los usuarios NO seleccionados
    const remainingUsers = profiles.filter(
      (user) => !selecteds.some((selected) => selected.id === user.id)
    );

    // Actualizar estados
    setSelectedUsers(selectedUsersList);
    setUserstmp(remainingUsers);

    onOpen(); // Abre el modal u otra acción
  };

  const handleSelectChange = (e) => {
    const selectedValue = e;

    const selectedItem = users.find((item) => item.id == selectedValue); // Busca el item en la lista
    if (selectedItem) {
      setSelectedUsers((prev) => [...prev, selectedItem]); // Agrega al tmp
      setUserstmp((prev) => prev.filter((item) => item.id !== selectedItem.id));
    }
  };

  const handleDeleteTmp = (id) => {
    const selectedItem = users.find((item) => item.id === id); // Busca el item en calendarioTmp

    if (selectedItem) {
      setSelectedUsers((prev) => prev.filter((item) => item.id !== id)); // Elimina del calendarioTmp
      setUserstmp((prev) => [...prev, selectedItem]); // Agrega de nuevo al calendario
    }
  };

  const handleSave = async () => {
    const data = {
      selectedUsers,
    };
    const response = await fetch("/api/admin/grupos/profile/" + item.id, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Datos guardados con exito");
    } else {
      toast.error("Error al guardar los datos");
    }
  };
  return (
    <>
      <Button onPress={handleGetData} color="primary" variant="bordered">
        Asignar Usuarios
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {item.name}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Autocomplete
                      size="sm"
                      name="usuarios"
                      label="Selecciona un usuario"
                      variant="bordered"
                      onSelectionChange={handleSelectChange} // ← Usamos onAction en lugar de onSelectionChange
                    >
                      {userstmp.map((user) => (
                        <AutocompleteItem key={user.id} value={user.id}>
                          {user.Name} {user.Father_Name} {user.Mother_Name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <Chip
                        key={user.id}
                        variant="bordered"
                        onClose={() => handleDeleteTmp(user.id)}
                      >
                        {user.Name} {user.Father_Name} {user.Mother_Name}
                      </Chip>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
