import SearchBox from "../components/SearchBox";
import "../styles/Home.css";
import Sliderbar from "../components/Sliderbar";

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-eyebrow">Book Bus Tickets</span>
            <h1>Reserva tu viaje en autobús en segundos</h1>
            <p>
              Elige tu ruta, compara horarios y consigue tus boletos con los mejores precios.
            </p>
          </div>

          <div className="hero-search-card">
            <div className="travel-tabs">
              <button className="tab active">Bus</button>
            </div>
            <SearchBox />
          </div>
        </div>
      </section>

      <Sliderbar />

      <section className="benefits">
        <div className="benefit-card">
          <h3>🚌 Amplia Red</h3>
          <p>Conectamos las principales ciudades con rutas directas y convenientes.</p>
        </div>
        <div className="benefit-card">
          <h3>💰 Mejores Precios</h3>
          <p>Compara opciones y reserva con tarifas transparentes y promociones exclusivas.</p>
        </div>
        <div className="benefit-card">
          <h3>🛡️ Viaja Seguro</h3>
          <p>Disfruta de viajes seguros con servicios confiables y asistencia dedicada.</p>
        </div>
        <div className="benefit-card">
          <h3>⭐ Opiniones</h3>
          <p>Miles de viajeros satisfechos nos recomiendan por comodidad y precio.</p>
        </div>
      </section>

      <section className="cta">
        <h2>¿Listo para viajar?</h2>
        <p>
          Reserva ahora y empieza a planificar tu próxima aventura por carretera con BusTicket.
        </p>
      </section>
    </div>
  );
}

export default Home;
