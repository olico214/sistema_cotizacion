"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Tooltip,
} from "@nextui-org/react";
import { deleteCookie } from "@/libs/auth/cookie";
import { toast } from "sonner";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import BreadCrumbComponent from "../breadcrumb/breadcrumb";
import { icons } from "@/libs/icons/icons";
import { handleCloseSesionServer } from "../../libs/closesesion/scripts";

const Sidebar = ({ children, apps }) => {
  const pathname = usePathname();
  // --- Se reintroduce el estado para controlar el sidebar en móvil ---
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // --- Se reintroduce el efecto para cerrar el sidebar al hacer clic fuera en móvil ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const handleLogout = () => {
    deleteCookie();
    toast.info("Sesión cerrada");
    handleCloseSesionServer();
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* --- Sidebar (con comportamiento responsivo) --- */}
      <aside
        ref={sidebarRef}
        className={`bg-gray-900 text-gray-300 w-64 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out fixed lg:static lg:translate-x-0 inset-y-0 z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Smart Blinds</h1>
          {/* --- Se reintroduce el botón de cierre para móvil --- */}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navegación principal con scroll (Aplicaciones siempre expandidas) */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {apps.map((app) => (
              <li key={app.name}>
                <div className="w-full flex items-center justify-between p-2">
                  <span className="flex items-center gap-3 font-medium text-white">
                    {React.createElement(
                      icons.find((i) => i.name === app.icon)?.component ||
                      ChevronDown,
                      { size: 16 }
                    )}
                    {app.name}
                  </span>
                </div>

                <ul className="pl-6 mt-2 space-y-1 border-l-2 border-gray-700">
                  {app.modules.map((mod) => {
                    const Icon = icons.find(
                      (i) => i.name === mod.icon
                    )?.component;
                    const isActive = pathname === `/inicio/${mod.ruta}`;
                    return (
                      <li key={mod.ruta}>
                        <Link
                          prefetch={false}
                          href={`/inicio/${mod.ruta}`}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${isActive
                            ? "bg-primary-500 text-white font-semibold"
                            : "hover:bg-gray-800 hover:text-white"
                            }`}
                          // Al hacer clic en un link, se cierra el sidebar en móvil
                          onClick={() => isSidebarOpen && setSidebarOpen(false)}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          {mod.nombre}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* --- Sección de Cerrar Sesión (Abajo) --- */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Tooltip content="Cerrar Sesión" placement="top">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={handleLogout}
                className="text-gray-400 hover:text-white"
              >
                <LogOut size={18} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </aside>

      {/* --- Se reintroduce el Overlay para móvil --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Contenido Principal --- */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* --- Se reintroduce el botón de menú (hamburguesa) para móvil --- */}
            <Button
              isIconOnly
              variant="light"
              onPress={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>
            <div className="hidden lg:block">
              <BreadCrumbComponent />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;