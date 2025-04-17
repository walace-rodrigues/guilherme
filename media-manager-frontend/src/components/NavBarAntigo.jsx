// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  // Checa o token no localStorage sempre que NavBar for montado
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Redireciona para a tela de login
  };

  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
      {/* Logo ou título da aplicação */}
      <div className="font-bold text-xl">
        <Link to="/">AppTarefas</Link>
      </div>

      {/* Links de navegação */}
      <div className="space-x-4">
        {/* Se NÃO houver token, mostra só o link de Login */}
        {!token && (
          <Link to="/" className="hover:underline">
            Login
          </Link>
        )}

        {/* Se houver token, mostra as rotas protegidas */}
        {token && (
          <>
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

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded ml-2"
            >
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
