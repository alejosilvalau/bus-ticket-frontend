import { useState } from 'react';
import './styles/App.css';

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Bilbao', 'Sevilla', 'Málaga', 'Zaragoza'];

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [suggestionsFrom, setSuggestionsFrom] = useState<string[]>([]);
  const [suggestionsTo, setSuggestionsTo] = useState<string[]>([]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFrom(value);
    setSuggestionsFrom(value ? CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase())) : []);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTo(value);
    setSuggestionsTo(value ? CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase())) : []);
  };

  const selectFrom = (city: string) => {
    setFrom(city);
    setSuggestionsFrom([]);
  };

  const selectTo = (city: string) => {
    setTo(city);
    setSuggestionsTo([]);
  };
  return (
    <div className="App">
      <header className="main-header">
        <div className="logo">BusTickets</div>
        <nav className="main-nav">
          <button className="nav-btn active">Bus</button>
        </nav>
        <span className="login-link">Login</span>
      </header>

      <section className="search-section">
        <div className="search-box">
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="From" 
              className="search-input" 
              value={from}
              onChange={handleFromChange}
            />
            {suggestionsFrom.length > 0 && (
              <ul className="suggestions">
                {suggestionsFrom.map(city => (
                  <li key={city} onClick={() => selectFrom(city)}>{city}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="To" 
              className="search-input" 
              value={to}
              onChange={handleToChange}
            />
            {suggestionsTo.length > 0 && (
              <ul className="suggestions">
                {suggestionsTo.map(city => (
                  <li key={city} onClick={() => selectTo(city)}>{city}</li>
                ))}
              </ul>
            )}
          </div>

          <input type="date" className="search-input" />
          <button className="search-btn">Search</button>
        </div>
      </section>

      <section className="offers-section">
        <div className="offers-container">
          <div className="offer-card">
            <h3>🎉 Super Offer</h3>
            <p>Get up to <strong>30% OFF</strong> on your first booking</p>
          </div>
          <div className="offer-card">
            <h3>💰 Cashback</h3>
            <p>Earn <strong>$500 Cashback</strong> on bookings above $2000</p>
          </div>
          <div className="offer-card">
            <h3>🎁 Free Upgrade</h3>
            <p>Free AC seat upgrade on selected buses</p>
          </div>
        </div>
      </section>

      {/* Puedes agregar más secciones aquí si lo deseas */}
    </div>
  );
}

export default App;

