
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Offers from "./pages/Offers";
import LoginPage from "./pages/Login";
import Edit from "./pages/Edit";
import { useHideNavbar } from "./pages/Route";
import "./styles/App.css";

function AppContent() {
  const hideNavbar = useHideNavbar();
  return (
    <>
      {!hideNavbar && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/login" element={<LoginPage />} />
      
        <Route path="/editar" element={<Edit />} />
      

      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}