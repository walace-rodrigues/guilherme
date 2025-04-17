// src/pages/GestaoUsuarios.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NavBar from "../components/NavBar";

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [ordenarPor, setOrdenarPor] = useState("name");
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "colaborador" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const carregarUsuarios = useCallback(() => {
    axios
      .get("http://localhost:5000/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch(() => toast.error("Erro ao carregar usuários."));
  }, [token]);

  useEffect(() => {
    if (!token) return navigate("/");
    carregarUsuarios();
  }, [navigate, token, carregarUsuarios]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/auth/register", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Usuário registrado com sucesso.");
        setForm({ name: "", email: "", password: "", role: "colaborador" });
        carregarUsuarios();
      })
      .catch(() => toast.error("Erro ao registrar usuário."));
  };

  const atualizarRole = (id, novoRole) => {
    axios
      .put(`http://localhost:5000/auth/users/${id}`, { role: novoRole }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Tipo de usuário atualizado.");
        carregarUsuarios();
      })
      .catch(() => toast.error("Erro ao atualizar tipo de usuário."));
  };

  const usuariosFiltrados = usuarios
    .filter((u) => {
      const nomeOk = u.name.toLowerCase().includes(filtroNome.toLowerCase());
      const tipoOk = filtroTipo === "todos" || u.role.toLowerCase() === filtroTipo.toLowerCase();
      return nomeOk && tipoOk;
    })
    .sort((a, b) => {
      const valA = a[ordenarPor].toLowerCase();
      const valB = b[ordenarPor].toLowerCase();
      if (valA < valB) return ordemAsc ? -1 : 1;
      if (valA > valB) return ordemAsc ? 1 : -1;
      return 0;
    });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const alternarOrdenacao = (campo) => {
    if (ordenarPor === campo) {
      setOrdemAsc(!ordemAsc);
    } else {
      setOrdenarPor(campo);
      setOrdemAsc(true);
    }
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(usuariosFiltrados.map(u => ({ Nome: u.name, Tipo: u.role })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuários");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Usuários", 14, 16);
    doc.autoTable({
      head: [["Nome", "Tipo"]],
      body: usuariosFiltrados.map((u) => [u.name, u.role]),
      startY: 20,
    });
    doc.save("usuarios.pdf");
  };

  const resetarFiltros = () => {
    setFiltroNome("");
    setFiltroTipo("todos");
    setOrdenarPor("name");
    setOrdemAsc(true);
    setPaginaAtual(1);
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Gestão de Usuários</h1>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 space-y-4">
          <div>
            <label className="block font-medium">Nome</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Senha</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Tipo</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="colaborador">Colaborador</option>
              <option value="master">Master</option>
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Cadastrar Usuário</button>
        </form>

        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={exportarExcel} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Exportar XLSX</button>
          <button onClick={exportarPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Exportar PDF</button>
          <button onClick={resetarFiltros} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Resetar Filtros</button>
        </div>

        <div className="mb-4 space-y-2">
          <input type="text" placeholder="Buscar por nome..." value={filtroNome} onChange={(e) => { setFiltroNome(e.target.value); setPaginaAtual(1); }} className="w-full border p-2 rounded" />

          <div className="flex gap-2">
            {['todos', 'master', 'colaborador'].map(tipo => (
              <button
                key={tipo}
                onClick={() => { setFiltroTipo(tipo); setPaginaAtual(1); }}
                className={`px-3 py-1 rounded text-sm ${filtroTipo === tipo ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => alternarOrdenacao("name")} className="text-sm text-green-800 underline">Ordenar por Nome {ordenarPor === "name" ? (ordemAsc ? "↑" : "↓") : ""}</button>
            <button onClick={() => alternarOrdenacao("role")} className="text-sm text-green-800 underline">Ordenar por Tipo {ordenarPor === "role" ? (ordemAsc ? "↑" : "↓") : ""}</button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Lista de Usuários</h2>
        <ul className="bg-white rounded shadow divide-y">
          {usuariosPaginados.map((u) => (
            <li key={u.id} className="p-3 flex justify-between items-center">
              <span>{u.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 italic">{u.role === "master" ? "Master" : "Colaborador"}</span>
                {u.role === "colaborador" && (
                  <button onClick={() => atualizarRole(u.id, "master")} className="text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600">Tornar Master</button>
                )}
                {u.role === "master" && (
                  <button onClick={() => atualizarRole(u.id, "colaborador")} className="text-xs text-white bg-gray-500 px-2 py-1 rounded hover:bg-gray-600">Rebaixar</button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setPaginaAtual((prev) => Math.max(1, prev - 1))} disabled={paginaAtual === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
          <span className="text-sm text-gray-600">Página {paginaAtual} de {totalPaginas}</span>
          <button onClick={() => setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))} disabled={paginaAtual === totalPaginas} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Próxima</button>
        </div>
      </div>
    </div>
  );
}
