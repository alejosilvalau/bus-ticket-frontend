import { Link } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import LogoImg from "../img/Logo.jpg";
import "../styles/Header.css";

function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <div className="header">
      <div className="logo">
        <Link to="/">
          <img
            src={LogoImg}
            alt="BusTicket logo"
          />
        </Link>
      </div>
      
      <div className="link-item">
        <div style={{ marginTop: "4px" }} className="link">
          <Link to="/">Home</Link>
        </div>
        <div style={{ marginTop: "4px" }} className="link">
          <Link to="/bookings">Bookings</Link>
        </div>
        <div style={{ marginTop: "4px" }} className="link">
          <Link to="/ofertas">Ofertas</Link>
        </div>
        <div style={{ marginTop: "4px" }} className="link">
          <Link to="/editar">Editar</Link>
        </div>
      </div>

      <div className="auth-section">
        <div className="auth-buttons">
          {!isAuthenticated ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="loginBtn"
            >
              <img src="https://static.busticket.com/assets/img/user-icon.png" alt="user" />
              Iniciar Sesión
            </button>
          ) : (
            <div className="user-info">
              <span>{userEmail}</span>
              <button
                onClick={handleLogout}
                className="logoutBtn"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default Header;