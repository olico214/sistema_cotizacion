"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Link,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function TablePerfiles() {
  const router = useRouter();
  const [filterLetter, setFilterLetter] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const asyncFetchData = async () => {
      try {
        const response = await fetch("/api/admin/perfiles");
        const result = await response.json();
        setData(result.result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    asyncFetchData();
  }, []);

  const filteredUsers = filterLetter
    ? data.filter((user) => user.name.startsWith(filterLetter))
    : data;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="p-4">
      <div className="grid mb-4 grid-cols-2 items-center">
        <div className="justify-items-center">
          <Button onPress={() => router.push("/inicio/admin/perfiles/0")}>
            Nuevo
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 content-end items-center justify-end">
          <span
            className={`hover:text-black text-slate-500 hover:cursor-pointer ${
              !filterLetter ? "font-bold text-black" : ""
            }`}
            onClick={() => setFilterLetter(null)}
          >
            Todos
          </span>
          {alphabet.map((letter) => (
            <span
              key={letter}
              className={`hover:text-black text-slate-500 hover:cursor-pointer ${
                filterLetter === letter ? "font-bold text-black" : ""
              }`}
              onClick={() => setFilterLetter(letter)}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      <Table aria-label="User table">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>Estatus</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay registros disponibles">
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link href={"/inicio/admin/perfiles/" + user.id}>
                  {user.name}
                </Link>
              </TableCell>
              <TableCell>{user.descripcion}</TableCell>
              <TableCell>{user.status === 1 ? "Activo" : "Inactivo"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
