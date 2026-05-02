import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

type Props = { isOpen: boolean; onClose: () => void };

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (email === "test@test.com" && password === "1234") {
      login(email);
      onClose();
    } else {
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <p className="login-modal-brand">Bus ticket</p>
        <h2>Iniciar sesión</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
        />
        <button className="submit-btn" onClick={handleSubmit}>Ingresar</button>
        <p className="toggle-text">
          ¿No tenés cuenta?{" "}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => { onClose(); navigate("/login", { state: { signUp: true } }); }}
          >
            Registrate
          </button>
        </p>
      </div>
    </div>
  );
}