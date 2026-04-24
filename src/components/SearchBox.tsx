import { type FormEvent, useState } from "react";
import "../styles/SearchBox.css";

function SearchBox() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Buscando: De ${from} a ${to} en ${date}`);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="¿De dónde?"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="¿A dónde?"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBox;
