import React, { useState } from 'react';
import '../styles/Bus.css';

interface BusTab {
  id: number;
  busNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: number;
}

const Bus: React.FC = () => {
  const [buses] = useState<BusTab[]>([
    {
      id: 1,
      busNumber: 'BUS-001',
      departure: '08:00',
      arrival: '14:30',
      duration: '6h 30m',
      price: 45.99,
      seats: 12,
    },
    {
      id: 2,
      busNumber: 'BUS-002',
      departure: '10:15',
      arrival: '16:45',
      duration: '6h 30m',
      price: 39.99,
      seats: 5,
    },
    {
      id: 3,
      busNumber: 'BUS-003',
      departure: '14:00',
      arrival: '20:30',
      duration: '6h 30m',
      price: 50.00,
      seats: 20,
    },
  ]);

  return (
    <div className="bus-tab">
      <h2>Autobuses Disponibles</h2>
      <div className="bus-list">
        {buses.map((bus) => (
          <div key={bus.id} className="bus-card">
            <div className="bus-header">
              <span className="bus-number">{bus.busNumber}</span>
              <span className="bus-price">${bus.price}</span>
            </div>
            <div className="bus-details">
              <div className="time-info">
                <p><strong>{bus.departure}</strong> → <strong>{bus.arrival}</strong></p>
                <p className="duration">{bus.duration}</p>
              </div>
              <div className="seats-info">
                <p>Asientos disponibles: <strong>{bus.seats}</strong></p>
              </div>
            </div>
            <button className="select-btn">Seleccionar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bus;