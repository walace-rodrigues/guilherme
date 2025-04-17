import { BrowserRouter, Routes, Route } from "react-router-dom";
import RevisarTarefa from "./pages/RevisarTarefa";
import EditarTarefa from "./pages/EditarTarefa";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import ListarTarefas from "./pages/ListarTarefas";
import GestaoClientes from "./pages/GestaoClientes";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovaTarefa from "./pages/NovaTarefa";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/nova-tarefa"
          element={
            <RequireAuth>
              <NovaTarefa />
            </RequireAuth>
          }
        />
        <Route
          path="/tarefa/:id/revisar"
          element={
            <RequireAuth>
              <RevisarTarefa />
            </RequireAuth>
          }
        />
        <Route
          path="/tarefa/:id/editar"
          element={
            <RequireAuth>
              <EditarTarefa />
            </RequireAuth>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RequireAuth>
              <GestaoUsuarios />
            </RequireAuth>
          }
        />
        <Route
          path="/clientes"
          element={
            <RequireAuth>
              <GestaoClientes />
            </RequireAuth>
          }
        />
        <Route
          path="/tarefas"
          element={
            <RequireAuth>
              <ListarTarefas />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}