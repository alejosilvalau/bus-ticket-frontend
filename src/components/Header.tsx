
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo">BusTickets</div>

      <nav className="main-nav">
        <Link to="/">Ofertas</Link>
        <Link to="/buscar">Buscar</Link>
      </nav>

      <Link className="login-link" to="/login">Login</Link>
    </header>
  );
};

export default Header;
