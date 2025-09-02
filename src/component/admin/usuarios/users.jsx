"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Input,
} from "@nextui-org/react";
import Crearusuario from "./crearUsuario";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TableUsers({ users }) {
  const route = useRouter();
  const [filterLetter, setFilterLetter] = useState(null);
  const [find, setFind] = useState("");

  const filteredUsers = filterLetter
    ? users.filter((user) => user.email.startsWith(filterLetter))
    : users;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="p-4">
      <div className="grid mb-4 grid-cols-2 items-center">
        <div className="justify-items-center">
          <Crearusuario />
        </div>
        <div className=" flex flex-wrap gap-2 content-end items-center justify-end">
          <div>
            <span className="hover:text-black text-slate-500 hover:cursor-pointer">
              Todos
            </span>
          </div>
          {alphabet.map((letter) => (
            <div key={letter}>
              <span className="hover:text-black text-slate-500 hover:cursor-pointer">
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Table aria-label="User table">
        <TableHeader>
          <TableColumn>Correo</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Clave</TableColumn>
          <TableColumn>Perfil</TableColumn>
          <TableColumn>Estatus</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.userID}>
              <TableCell>
                <Link href={`/inicio/admin/users/` + user.userID}>
                  {user.email}
                </Link>
              </TableCell>
              <TableCell>{user.fullname}</TableCell>
              <TableCell>{user.clave}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
