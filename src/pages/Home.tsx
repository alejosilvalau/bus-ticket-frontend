import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import "../styles/Home.css";
import Sliderbar from "../components/Sliderbar";
function Home() {
  return (
    <div className="home-container">
      <Sliderbar />
      <section className="hero">
        <h1>Encuentra tu viaje perfecto</h1>
        <p>Reserva autobuses con los mejores precios y comodidad</p>
        <SearchBox />
      </section>

      <section className="benefits">
        <div className="benefit-card">
          <h3>🚌 Amplia Red</h3>
          <p>Conectamos ciudades principales con rutas confiables</p>
        </div>
        <div className="benefit-card">
          <h3>💰 Mejores Precios</h3>
          <p>Compara y elige la mejor opción para tu presupuesto</p>
        </div>
        <div className="benefit-card">
          <h3>🛡️ Seguro</h3>
          <p>Viaja con confianza con nuestros servicios garantizados</p>
        </div>
        <div className="benefit-card">
          <h3>⭐ Opiniones</h3>
          <p>Confían en nosotros miles de pasajeros satisfechos</p>
        </div>
      </section>

      <section className="cta">
        <h2>¿Necesitas ayuda?</h2>
        <p>Contáctanos para cualquier consulta sobre tus reservas</p>
        <Link to="/buscar" className="cta-btn">
          Buscar Ahora
        </Link>
      </section>
    </div>
  );
}

export default Home;
