import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">🚌 abhibus</div>

      <nav className="nav">
        <button className="nav-btn">Offers</button>
        <button className="nav-btn">Free Rides</button>
        <button className="nav-btn">My Bookings</button>

        <button className="login-btn">
          Login / Register
        </button>
      </nav>
    </header>
  );
}

export default Header;