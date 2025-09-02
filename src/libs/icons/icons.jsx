import {
  FaBook,
  FaBookOpen,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaFolder,
  FaList,
  FaMoneyBill,
  FaPencilAlt,
  FaPersonBooth,
  FaListAlt,
  FaChartPie,
} from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { IoIosPerson, IoIosPeople } from "react-icons/io";

export const icons = [
  { name: "canvas", component: FaListAlt },
  { name: "dashboard", component: FaChartPie },
  { name: "empleados", component: IoIosPeople },
  { name: "puesto", component: FaPeopleRoof },
  { name: "Captura incidencias", component: FaPencilAlt },
  { name: "Cambio de puesto", component: FaExchangeAlt },
  { name: "movimientos de nomina", component: FaMoneyBill },
  { name: "lista de movimientos de nomina", component: FaList },
  { name: "Catalogo", component: FaBookOpen },
  { name: "Perfil", component: IoIosPerson },
  { name: "Carpetas", component: FaFolder },
];
