import { useState } from "react";
import "../styles/App.css";

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Bilbao', 'Sevilla', 'Málaga', 'Zaragoza'];

const Search = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [suggestionsFrom, setSuggestionsFrom] = useState<string[]>([]);
  const [suggestionsTo, setSuggestionsTo] = useState<string[]>([]);
  
  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setFrom(value);
    setSuggestionsFrom(
      value ? CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase())) : []
    );
  }

  function handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTo(value);
    setSuggestionsTo(
      value ? CITIES.filter(c => c.toLowerCase().includes(value.toLowerCase())) : []
    );
  };

  return (
    <section className="search-section">
      <div className="search-box">

        <input type="text"
          placeholder="From"
          value={from}
          onChange={handleFromChange}
        />

        <input type="text"
          placeholder="To"
          value={to}
          onChange={handleToChange}
        />

        <input type="date" />
        <button>Search</button>

      </div>
    </section>
  );
};

export default Search;
