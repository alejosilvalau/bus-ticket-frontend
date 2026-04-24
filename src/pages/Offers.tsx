import Banner from "../img/Banner.jpg";
import Img1 from "../img/img1.jpg";
import LogoImg from "../img/Logo.jpg";
import "../styles/Offers.css";

const offers = [
  {
    icon: "🎉",
    title: "Super Oferta",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reserva ya y obtén 30% de descuento en tu primer viaje.",
    image: Banner,
    badge: "30% OFF",
    code: "PRIMERA30",
    validity: "Válido hasta 30 de junio",
  },
  {
    icon: "💰",
    title: "Cashback Rápido",
    description:
      "Suspendisse potenti. Recibe hasta $500 de devolución al completar tu reserva antes del fin de mes.",
    image: Img1,
    badge: "$500 Cashback",
    code: "REINTEGRO500",
    validity: "Promoción limitada",
  },
  {
    icon: "🎁",
    title: "Upgrade Premium",
    description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    image: LogoImg,
    badge: "Asiento Gratis",
    code: "UPGRADE",
    validity: "Hasta agotar stock",
  },
  {
    icon: "⚡",
    title: "Oferta Relámpago",
    description:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; aprovecha precios imperdibles.",
    image: Banner,
    badge: "25% OFF",
    code: "FLASH25",
    validity: "Solo hoy",
  },
];

const Offers = () => {
  return (
    <section className="offers-page">
      <div className="offers-header">
        <h1>Ofertas Destacadas</h1>
        <p>
          Descubre nuestras promociones exclusivas de BusTicket. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="offers-grid">
        {offers.map((offer, index) => (
          <article key={index} className="offer-item">
            <div className="offer-icon">{offer.icon}</div>
            <img className="offer-image" src={offer.image} alt={offer.title} />
            <h3>{offer.title}</h3>
            <p className="offer-description">{offer.description}</p>
            <div className="offer-details">
              <span className="discount-badge">{offer.badge}</span>
              <div className="offer-code">
                <span className="code-text">{offer.code}</span>
              </div>
            </div>
            <p className="validity">{offer.validity}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Offers;
