"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ModalEditview from "./modal";

const STATUSES = [
  "Sistema",
  "Administracion",

];

export default function DragPages({ pages, apps }) {
  const [users, setUsers] = useState(pages);
  const [activeUser, setActiveUser] = useState(null); // Usuario activo

  const handleDragStart = (event) => {
    const { active } = event;
    const user = users.find((user) => user.id === active.id);
    setActiveUser(user); // Establece el usuario arrastrado
  };

  const handleDragEnd = (event) => {
    try {
      const { active, over } = event;
      if (!over) {
        setActiveUser(null);
        return;
      }

      const { id: activeId } = active;
      const { id: overId } = over;

      const activeIndex = users.findIndex((user) => user.id === activeId);
      const overIndex = users.findIndex((user) => user.id === overId);
      setUsers((users) => arrayMove(users, activeIndex, overIndex));
    } catch {
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  return (
    <div className="flex space-x-4 p-4">
      <DndContext
      // collisionDetection={closestCenter}
      // onDragStart={handleDragStart}
      // onDragEnd={handleDragEnd}
      >
        {STATUSES.map((status) => (
          <Droppable key={status} id={status} table={status}>
            <StatusTable
              title={status}
              id={status}
              table={status}
              users={users.filter((user) => user.apps === status)}
              onStatusChange={handleStatusChange}
              apps={apps}
            />
          </Droppable>
        ))}

        <DragOverlay>
          {activeUser ? (
            <SortableUser id={activeUser.position} name={activeUser.name} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Droppable({ id, children, table }) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      index: table,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-md shadow-md flex-1 min-w-[200px]"
    >
      {children}
    </div>
  );
}

function StatusTable({ id, title, users, onStatusChange, apps }) {
  return (
    <div
      id={id}
      className="bg-gray-100 p-4 rounded-md shadow-md flex-1 min-w-[200px]"
    >
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <SortableContext
        id={id}
        items={users.map((user) => user.position)}
        strategy={verticalListSortingStrategy}
      >
        {users.map((user) => (
          <SortableUser
            key={user.position}
            id={user.position}
            name={user.page}
            url={user.url}
            page={user}
            status={user.status}
            onStatusChange={onStatusChange}
            apps={apps}
          />
        ))}
      </SortableContext>
    </div>
  );
}

// Componente SortableUser (Elemento arrastrable)
function SortableUser({ id, name, status, onStatusChange, url, page, apps }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-lg text-black mb-4 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-gray-100"
    >
      <div className="text-xl font-semibold">{name}</div>
      <div className="text-sm text-gray-500">{url}</div>
      <div>
        <ModalEditview page={page} apps={apps} />
      </div>
    </div>
  );
}
