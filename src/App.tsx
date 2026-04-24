import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Search from "./pages/Search";
import Login from "./pages/login";
import { useHideNavbar } from "./pages/Route";
import "./styles/App.css";

function AppContent() {
  const hideNavbar = useHideNavbar();

  return (
    <>
      {!hideNavbar && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
