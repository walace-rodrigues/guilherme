// src/pages/EditarTarefa.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditarTarefa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "média",
    status: "pendente",
    progress: 0,
  });

  const token = localStorage.getItem("token");

  const carregarTarefa = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tarefa = res.data.find((t) => t.id === parseInt(id));
      if (!tarefa) throw new Error("Tarefa não encontrada");
      setForm({
        title: tarefa.title,
        description: tarefa.description,
        deadline: tarefa.deadline,
        priority: tarefa.priority,
        status: tarefa.status,
        progress: tarefa.progress,
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar a tarefa");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    carregarTarefa();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tarefa atualizada com sucesso");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar a tarefa");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Editar Tarefa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Título" required className="w-full border p-2 rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" required className="w-full border p-2 rounded" />
        <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} required className="w-full border p-2 rounded" />
        <select name="priority" value={form.priority} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="pendente">Pendente</option>
          <option value="em progresso">Em progresso</option>
          <option value="concluída">Concluída</option>
        </select>
        <input type="number" name="progress" value={form.progress} onChange={handleChange} min={0} max={100} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">Salvar</button>
      </form>
    </div>
  );
}