// src/pages/ListarTarefas.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

const ListarTarefas = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const carregarTarefas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar as tarefas");
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Lista de Tarefas</h2>
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="text-left px-4 py-2">Título</th>
              <th className="text-left px-4 py-2">Prazo</th>
              <th className="text-left px-4 py-2">Prioridade</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="px-4 py-2 font-semibold">{task.title}</td>
                <td className="px-4 py-2">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-2 capitalize">{task.priority}</td>
                <td className="px-4 py-2 capitalize">{task.status}</td>
                <td className="px-4 py-2">{task.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarTarefas;
