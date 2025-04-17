// src/pages/GestaoClientes.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import NavBar from "../components/NavBar";

export default function GestaoClientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ name: "", whatsapp_number: "" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const carregarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch {
      toast.error("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "whatsapp_number") {
      const somenteNumeros = value.replace(/\D/g, "");
      setForm((prev) => ({
        ...prev,
        [name]: somenteNumeros,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validarWhatsapp = (numero) => {
    const regex = /^55\d{11}$/;
    return regex.test(numero);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarWhatsapp(form.whatsapp_number)) {
      toast.error("Número inválido. Use o formato 55XXXXXXXXXXX");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/clients/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cliente atualizado");
      } else {
        await axios.post("http://localhost:5000/clients", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cliente cadastrado");
      }
      setForm({ name: "", whatsapp_number: "" });
      setEditingId(null);
      carregarClientes();
    } catch {
      toast.error("Erro ao salvar cliente");
    }
  };

  const editar = (cliente) => {
    setForm({ name: cliente.name, whatsapp_number: cliente.whatsapp_number });
    setEditingId(cliente.id);
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cliente excluído");
      carregarClientes();
    } catch {
      toast.error("Erro ao excluir cliente");
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Gestão de Clientes</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="whatsapp_number"
            placeholder="WhatsApp (55XXXXXXXXXXX)"
            value={form.whatsapp_number}
            onChange={handleChange}
            maxLength={13}
            className="w-full border p-2 rounded"
            required
          />
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            {editingId ? "Atualizar" : "Cadastrar"}
          </button>
        </form>

        <table className="w-full mt-6 bg-white shadow rounded">
          <thead className="bg-green-100">
            <tr>
              <th className="text-left px-4 py-2">Nome</th>
              <th className="text-left px-4 py-2">WhatsApp</th>
              <th className="text-left px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.whatsapp_number}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button onClick={() => editar(c)} title="Editar">
                    <FaEdit className="text-blue-600 hover:text-blue-800" size={18} />
                  </button>
                  <button onClick={() => excluir(c.id)} title="Excluir">
                    <FaTrashAlt className="text-red-600 hover:text-red-800" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
