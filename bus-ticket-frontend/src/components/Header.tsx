import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">abhibus</div>

      <nav className="nav">
        <a href="#">Offers</a>
        <a href="#">Free Rides</a>
        <a href="#">My Bookings</a>
        <a href="#" className="login">
          Login / Register
        </a>
      </nav>
    </header>
  );
}

export default Header;
