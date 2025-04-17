// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">AppTarefas</h1>
      <div className="space-x-6">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/tarefas" className="hover:underline">
          Listar Tarefas
        </Link>
        <Link to="/nova-tarefa" className="hover:underline">
          Nova Tarefa
        </Link>
        <Link to="/usuarios" className="hover:underline">
          Usuários
        </Link>
        <Link to="/clientes" className="hover:underline">
          Clientes
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}