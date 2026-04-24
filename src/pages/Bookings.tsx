import { useState } from "react";
import "../styles/Bookings.css";

const initialBookings = [
  {
    id: 1,
    route: "Buenos Aires → Córdoba",
    date: "2026-05-02",
    time: "08:30",
    seat: "12A",
    status: "Confirmada",
    price: "$4.800",
  },
  {
    id: 2,
    route: "Rosario → Mendoza",
    date: "2026-05-18",
    time: "17:45",
    seat: "7C",
    status: "Pendiente",
    price: "$6.250",
  },
  {
    id: 3,
    route: "Santa Fe → Buenos Aires",
    date: "2026-06-10",
    time: "12:15",
    seat: "3B",
    status: "Confirmada",
    price: "$3.600",
  },
];

const Bookings = () => {
  const [bookings, setBookings] = useState(initialBookings);

  const handleDelete = (id: number) => {
    setBookings(current => current.filter(booking => booking.id !== id));
  };

  return (
    <section className="bookings-page">
      <div className="bookings-header">
        <h1>Tus Reservas</h1>
        <p>Consulta aquí tus viajes reservados y el estado de cada boleto.</p>
      </div>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <article key={booking.id} className="booking-card">
            <div className="booking-top">
              <h2>{booking.route}</h2>
              <span className={`booking-status booking-status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="booking-details">
              <div>
                <strong>Fecha:</strong> {booking.date}
              </div>
              <div>
                <strong>Hora:</strong> {booking.time}
              </div>
              <div>
                <strong>Asiento:</strong> {booking.seat}
              </div>
              <div>
                <strong>Precio:</strong> {booking.price}
              </div>
            </div>
            <button
              className="delete-booking-btn"
              type="button"
              onClick={() => handleDelete(booking.id)}
            >
              Eliminar reserva
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Bookings;
