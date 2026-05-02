import { createContext, useContext, useState, useEffect } from "react";

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos en ms

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string;
  login: (email: string) => void;
  logout: () => void;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Al cargar la app, verificar si hay sesión guardada y si no expiró
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const loginTime = localStorage.getItem("loginTime");

    if (savedEmail && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed < SESSION_DURATION) {
        setUserEmail(savedEmail);
        setIsAuthenticated(true);
      } else {
        // Ya expiró, limpiar
        localStorage.removeItem("userEmail");
        localStorage.removeItem("loginTime");
      }
    }
  }, []);

  // Verificar expiración cada minuto mientras la app está abierta
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      if (!loginTime) return;

      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed >= SESSION_DURATION) {
        logout();
      }
    }, 60 * 1000); // chequea cada 1 minuto

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = (email: string) => {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("loginTime", Date.now().toString());
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginTime");
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userEmail,
      login,
      logout,
      isLoginOpen,
      openLogin: () => setIsLoginOpen(true),
      closeLogin: () => setIsLoginOpen(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}