import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { useLocation } from "react-router-dom";



export default function LoginPage() {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state?.signUp ?? false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== password2) {
        setError("Las contraseñas no coinciden");
        return;
      }
      alert(`¡Bienvenido, ${name}!`);
      navigate("/");
    } else {
      if (email === "test@test.com" && password === "1234") {
        login(email);
        navigate("/");
      } else {
        setError("Email o contraseña incorrectos");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{isSignUp ? "Crear cuenta" : "Iniciar sesión"}</h1>
        <p className="login-subtitle">
          {isSignUp ? "Completá tus datos para registrarte" : "Ingresá a tu cuenta de BusTicket"}
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="field">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="nombre@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
            />
          </div>
            
           <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
            />
          </div>
          {isSignUp && (
            <div className="field">
              <label>Confirmar contraseña</label>
              <input type="password"
                placeholder="••••••••"
                value={password2}
                onChange={(e) => { setPassword2(e.target.value); setError(""); }}
              required
            />
            </div>
          )}
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="submit-btn">
            {isSignUp ? "Registrarme" : "Ingresar"}
          </button>
        </form>
        <p className="toggle-text">
          {isSignUp ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          >
            {isSignUp ? "Iniciá sesión" : "Registrate"}
          </button>
        </p>
      </div>
    </div>
  );
}