import { Link } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import LogoImg from "../img/Logo.jpg";
import "../styles/Header.css";

function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLogin = (email: string, password: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <div className="header" style={{ marginBottom: "50px", position: "fixed", width: "100%" }}>
      <div className="logo" style={{ marginTop: "-40px" }}>
        <Link to="/">
          <img
            style={{ width: "130px", marginTop: "25px" }}
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
          <Link to="/buscar">Buscar</Link>
        </div>
        <div style={{ marginTop: "4px" }} className="link">
          <Link to="/ofertas">Ofertas</Link>
        </div>

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
                style={{
                  backgroundColor: "#c60001",
                  marginTop: "3px",
                  padding: "5px 10px",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
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