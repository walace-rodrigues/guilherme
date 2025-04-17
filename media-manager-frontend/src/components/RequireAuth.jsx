// src/components/RequireAuth.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // sem token => volta pro login
    }
  }, [navigate]);

  return children;
}
