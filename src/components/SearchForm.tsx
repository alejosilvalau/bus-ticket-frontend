import type { FormEvent } from "react";
import { useState } from "react";

type SearchFormProps = {
  onSearch?: (origin: string, destination: string, date: string) => void;
  cities?: string[];
};

type Field = "origin" | "destination";
type FieldState = Record<Field, string>;
type SuggestionsState = Record<Field, string[]>;
type ShowState = Record<Field, boolean>;

type AutocompleteInputProps = {
  field: Field;
  value: string;
  suggestions: string[];
  show: boolean;
  onChangeValue: (field: Field, value: string) => void;
  onSelectCity: (field: Field, city: string) => void;
  onFocus: (field: Field) => void;
};

const AutocompleteInput = ({
  field,
  value,
  suggestions,
  show,
  onChangeValue,
  onSelectCity,
  onFocus,
}: AutocompleteInputProps) => (
  <div className="autocomplete-container">
    <input
      type="text"
      placeholder={field === "origin" ? "Origen" : "Destino"}
      value={value}
      onChange={(e) => onChangeValue(field, e.target.value)}
      onFocus={() => onFocus(field)}
      required
    />
    {show && suggestions.length > 0 && (
      <ul className="suggestions">
        {suggestions.map((city) => (
          <li
            key={city}
            onClick={() => onSelectCity(field, city)}
            className="suggestion-item"
          >
            {city}
          </li>
        ))}
      </ul>
    )}
  </div>
);

function SearchForm({ onSearch, cities = [] }: SearchFormProps) {
  const [values, setValues] = useState<FieldState>({
    origin: "",
    destination: "",
  });
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionsState>({
    origin: [],
    destination: [],
  });
  const [show, setShow] = useState<ShowState>({
    origin: false,
    destination: false,
  });

  const filterCities = (input: string) =>
    cities.filter((city) =>
      city.toLowerCase().includes(input.toLowerCase())
    );

  const handleChange = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (value.trim()) {
      const filtered = filterCities(value);
      setSuggestions((prev) => ({ ...prev, [field]: filtered }));
      setShow((prev) => ({ ...prev, [field]: true }));
    } else {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      setShow((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSelect = (field: Field, city: string) => {
    setValues((prev) => ({ ...prev, [field]: city }));
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
    setShow((prev) => ({ ...prev, [field]: false }));
  };

  const handleFocus = (field: Field) => {
    if (suggestions[field].length > 0) {
      setShow((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(values.origin, values.destination, date);
    } else {
      alert("Búsqueda enviada (sin backend por ahora)");
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <AutocompleteInput
          field="origin"
          value={values.origin}
          suggestions={suggestions.origin}
          show={show.origin}
          onChangeValue={handleChange}
          onSelectCity={handleSelect}
          onFocus={handleFocus}
        />
        <AutocompleteInput
          field="destination"
          value={values.destination}
          suggestions={suggestions.destination}
          show={show.destination}
          onChangeValue={handleChange}
          onSelectCity={handleSelect}
          onFocus={handleFocus}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="search-btn">
        Buscar Pasajes
      </button>
    </form>
  );
}

export default SearchForm;