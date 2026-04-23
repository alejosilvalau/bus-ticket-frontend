import { useState } from "react";
import SearchForm from "../components/SearchForm";
import Login from "../components/Login";
import type { Ticket } from "../types/Ticket";
import type { User } from "../types/index";
import "../styles/home.css";
import "../styles/searchBox.css";
import "../styles/login.css";
import "../styles/header.css";
import { Link } from "react-router-dom";
import  "./Offers";

// Mock data - esto vendría del backend
const MOCK_CITIES = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "La Plata",
  "Mar del Plata",
  "Salta",
  "Bariloche",
  "Tucumán",
  "Santa Fe",
];

const MOCK_TICKETS: Ticket[] = [
  { id: 1, origin: "", destination: "", date: "", price: 12000 },
  { id: 2, origin: "", destination: "", date: "", price: 15000 },
];

const FEATURES = [
  { icon: "✓", title: "Seguro", text: "Plataforma confiable y certificada" },
  { icon: "⚡", title: "Rápido", text: "Compra tu pasaje en segundos" },
  { icon: "💰", title: "Económico", text: "Los mejores precios del mercado" },
];

const CONTACT_INFO = [
  {
    icon: "📞",
    title: "Teléfono",
    main: "+54 (11) 1234-5678",
    sub: "Disponible 24/7",
  },
  {
    icon: "✉️",
    title: "Email",
    main: "info@busticket.com.ar",
    sub: "Respuesta en 24 horas",
  },
  {
    icon: "📍",
    title: "Dirección",
    main: "Avenida Corrientes 1234",
    sub: "Buenos Aires, Argentina",
  },
  {
    icon: "⏰",
    title: "Horarios",
    main: "Lun - Vie: 8:00 - 20:00",
    sub: "Sáb - Dom: 9:00 - 18:00",
  },
];

function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleSearch = (origin: string, destination: string, date: string) => {
    const results = MOCK_TICKETS.map((t) => ({
      ...t,
      origin,
      destination,
      date,
    }));
    setTickets(results);
    setHasSearched(true);
  };

  const handleLogin = (email: string, password: string) => {
    if (!email || !password) {
      alert("Email y contraseña son requeridos");
      return;
    }
    setUser({
      id: 1,
      email,
      name: email.split("@")[0],
    });
    setLoginOpen(false);
  };

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🚌 BusTicket</h1>
         
        <nav className="nav">
          <Link className="nav-btn" to="/">
            Inicio
          </Link>

          <Link className="nav-btn" to="/services">
              Servicios
          </Link>

          <Link className="nav-btn" to="/contact">
            Contacto
          </Link>
        </nav>

          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <span className="user-name">Hola, {user.name}!</span>
                <button className="logout-btn" onClick={() => setUser(null)}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <button
                  className="login-btn"
                  onClick={() => setLoginOpen(true)}
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <Login
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />

      <section className="hero">
        <div className="hero-content">
          <h2>Encuentra tu viaje perfecto</h2>
          <p>Compra pasajes de bus de forma rápida y segura</p>
          <div className="search-section">
            <SearchForm onSearch={handleSearch} cities={MOCK_CITIES} />
          </div>
        </div>
      </section>

      {hasSearched && (
        <section className="results-section">
          <div className="results-container">
            {tickets.length > 0 ? (
              <div className="results">
                <h2>Pasajes disponibles</h2>
                <div className="tickets-grid">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                      <div className="ticket-route">
                        <span className="origin">{ticket.origin}</span>
                        <span className="arrow">→</span>
                        <span className="destination">
                          {ticket.destination}
                        </span>
                      </div>
                      <div className="ticket-details">
                        <p>
                          <strong>Fecha:</strong> {ticket.date}
                        </p>
                        <p className="price">
                          <strong>${ticket.price.toLocaleString()}</strong>
                        </p>
                      </div>
                      <button className="buy-btn">Comprar</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-results">
                <p>No se encontraron pasajes para esa búsqueda</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="features">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="contact">
        <div className="contact-container">
          <h2>Contáctanos</h2>
          <div className="contact-grid">
            {CONTACT_INFO.map((info) => (
              <div key={info.title} className="contact-card">
                <span className="contact-icon">{info.icon}</span>
                <h3>{info.title}</h3>
                <p>{info.main}</p>
                <p className="small-text">{info.sub}</p>
              </div>
            ))}
          </div>
          <form className="contact-form">
            <input type="text" placeholder="Tu nombre" required />
            <input type="email" placeholder="Tu email" required />
            <textarea
              placeholder="Tu mensaje"
              rows={5}
              required
            ></textarea>
            <button type="submit" className="submit-contact-btn">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 BusTicket. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
