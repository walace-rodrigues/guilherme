// src/pages/NovaTarefa.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

export default function NovaTarefa() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "média",
    client_id: "",
    assigned_to: "",
  });
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      const [resClientes, resUsuarios] = await Promise.all([
        axios.get("http://localhost:5000/clients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setClientes(resClientes.data);
      setUsuarios(resUsuarios.data);
    } catch {
      toast.error("Erro ao carregar clientes ou usuários");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tarefa criada com sucesso!");
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao criar tarefa");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Criar Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="alta">Alta</option>
            <option value="média">Média</option>
            <option value="baixa">Baixa</option>
          </select>
          <select
            name="client_id"
            value={form.client_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Selecione o Cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="assigned_to"
            value={form.assigned_to}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Selecione o Responsável</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Criar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
}
