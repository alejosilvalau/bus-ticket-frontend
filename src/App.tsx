import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Offers from "./pages/Offers";
import Search from "./pages/Search";
import Login from "./pages/login";
import "./styles/App.css";


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Offers />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
