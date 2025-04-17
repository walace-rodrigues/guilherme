// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaThList, FaThLarge, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar tarefas");
      setError("Erro ao carregar as tarefas.");
    }
    setLoading(false);
  };

  const aplicarFiltros = () => {
    let filtradas = tasks;
    if (filters.status) {
      filtradas = filtradas.filter((t) => t.status === filters.status);
    }
    if (filters.priority) {
      filtradas = filtradas.filter((t) => t.priority === filters.priority);
    }
    return filtradas;
  };

  useEffect(() => {
    if (token) {
      carregarTarefas();
    } else {
      toast.error("Token não encontrado. Faça login novamente.");
    }
  }, [token]);

  const toggleView = (mode) => setViewMode(mode);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const editarTarefa = (id) => {
    navigate(`/tarefa/${id}/editar`);
  };

  const excluirTarefa = async (id) => {
    if (!window.confirm("Deseja excluir esta tarefa?")) return;
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tarefa excluída com sucesso");
      carregarTarefas();
    } catch {
      toast.error("Erro ao excluir a tarefa");
    }
  };

  const filteredTasks = aplicarFiltros();

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="p-6">Carregando tarefas...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="p-6 text-red-500">{error}</div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Painel de Tarefas</h2>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              onClick={() => toggleView("list")}
            >
              <FaThList />
            </button>
            <button
              className={`p-2 rounded ${viewMode === "card" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              onClick={() => toggleView("card")}
            >
              <FaThLarge />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Selecione Status</option>
            <option value="pendente">Pendente</option>
            <option value="em progresso">Em progresso</option>
            <option value="concluída">Concluída</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Selecione Prioridade</option>
            <option value="alta">Alta</option>
            <option value="média">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        {viewMode === "list" ? (
          <table className="min-w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-green-100">
              <tr>
                <th className="text-left px-4 py-2">Título</th>
                <th className="text-left px-4 py-2">Prazo</th>
                <th className="text-left px-4 py-2">Prioridade</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Progresso</th>
                <th className="text-left px-4 py-2">Responsável</th>
                <th className="text-left px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="px-4 py-2 font-semibold">{task.title}</td>
                  <td className="px-4 py-2">{new Date(task.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-2 capitalize">{task.priority}</td>
                  <td className="px-4 py-2 capitalize">{task.status}</td>
                  <td className="px-4 py-2">{task.progress}%</td>
                  <td className="px-4 py-2">{task.responsavel_nome || "-"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => editarTarefa(task.id)} className="text-blue-600 hover:underline">
                      <FaEdit className="inline mr-1" />
                    </button>
                    <button onClick={() => excluirTarefa(task.id)} className="text-red-600 hover:underline">
                      <FaTrash className="inline mr-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white shadow-md rounded p-4 border border-gray-200">
                <h3 className="text-blue-800 font-bold mb-2">{task.title}</h3>
                <p className="text-sm mb-1">{task.description}</p>
                <p className="text-sm">📅 Prazo: {new Date(task.deadline).toLocaleDateString()}</p>
                <p className="text-sm">🔥 Prioridade: {task.priority}</p>
                <p className="text-sm">📌 Status: {task.status}</p>
                <p className="text-sm">👤 Responsável: {task.responsavel_nome || "-"}</p>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="bg-green-600 h-2 rounded"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs mt-1 text-gray-600">{task.progress}% concluído</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => editarTarefa(task.id)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <FaEdit className="inline mr-1" />
                  </button>
                  <button
                    onClick={() => excluirTarefa(task.id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <FaTrash className="inline mr-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
