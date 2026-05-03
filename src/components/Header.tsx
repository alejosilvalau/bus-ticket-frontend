import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import LogoImg from "../img/Logo.jpg";
import "../styles/Header.css";

export default function Header() {
  const { isAuthenticated, userEmail, logout, isLoginOpen, openLogin, closeLogin } = useAuth();

  return (
    <div className="header">
      <div className="logo">
        <Link to="/">
          <img src={LogoImg} alt="BusTicket logo" />
        </Link>
      </div>
      <div className="link-item">
        <div style={{ marginTop: "4px" }} className="link"><Link to="/">Home</Link></div>
        <div style={{ marginTop: "4px" }} className="link"><Link to="/bookings">Bookings</Link></div>
        <div style={{ marginTop: "4px" }} className="link"><Link to="/ofertas">Ofertas</Link></div>
        {/*por ahora solo valida que estes autenticado*/}
       {isAuthenticated && /*user?.is_admin && */(
          <div style={{ marginTop: "4px" }} className="link"><Link to="/editar">Editar</Link></div>
        )}
      </div>
      <div className="auth-section">
        <div className="auth-buttons">
          {!isAuthenticated ? (
            <button onClick={openLogin} className="loginBtn">
              Iniciar Sesión
            </button>
          ) : (
            <div className="user-info">
              <span>{userEmail}</span>
              <button onClick={logout} className="logoutBtn">Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </div>
  );
}