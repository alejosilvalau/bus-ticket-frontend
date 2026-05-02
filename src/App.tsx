import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Offers from "./pages/Offers";
import Login from "./pages/Login";
import { useHideNavbar } from "./pages/Route";
import "./styles/App.css";
import Edit from "./pages/Edit";

function AppContent() {
  const hideNavbar = useHideNavbar();

  return (
    <>
      {!hideNavbar && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editar" element={<Edit />} />

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
