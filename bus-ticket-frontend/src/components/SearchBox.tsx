import { type FormEvent, useState } from "react";
import "./SearchBox.css";

function SearchBox() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`From: ${from} | To: ${to} | Date: ${date}`);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit">Search Trains</button>
    </form>
  );
}

export default SearchBox;
