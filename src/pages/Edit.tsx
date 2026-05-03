import React, { useState, type FormEvent } from "react";
import "../styles/Edit.css";

interface Route {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  busType: string;
  price: number;
  seats: number;
  driver: string;
}

interface Locality {
  id: string;
  name: string;
  province: string;
  postal_code: string;
}

interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  email: string;
}
interface Bus {
  id: string;
  plate: string;
  total_capacity: number;
  bus_type: string;
  is_active: boolean;
}

type TabType = "routes" | "localities" | "drivers" | "bus";

function Edit() {
  const [activeTab, setActiveTab] = useState<TabType>("routes");

  // ===== RUTAS =====
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "1",
      origin: "Buenos Aires",
      destination: "Córdoba",
      departureTime: "08:00",
      arrivalTime: "14:30",
      busType: "Cama",
      price: 1500,
      seats: 50,
      driver: "Juan Pérez",
    },
  ]);

  const [routeEditingId, setRouteEditingId] = useState<string | null>(null);
  const [routeFormData, setRouteFormData] = useState<Route>({
    id: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    busType: "",
    price: 0,
    seats: 0,
    driver: "",
  });

  // ===== LOCALIDADES =====
  const [localities, setLocalities] = useState<Locality[]>([
    { id: "1", name: "Buenos Aires", province: "Buenos Aires", postal_code: "1000" },
    { id: "2", name: "Córdoba", province: "Córdoba", postal_code: "5000" },
  ]);

  const [localityEditingId, setLocalityEditingId] = useState<string | null>(null);
  const [localityFormData, setLocalityFormData] = useState<Locality>({
    id: "",
    name: "",
    province: "",
    postal_code: "",
  });

  // ===== CONDUCTORES =====
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "Juan Pérez",
      license: "LIC123456",
      phone: "+54 911 2345678",
      email: "juan@busticket.com",
      
    },
  ]);

  const [driverEditingId, setDriverEditingId] = useState<string | null>(null);
  const [driverFormData, setDriverFormData] = useState<Driver>({
    id: "",
    name: "",
    license: "",
    phone: "",
    email: "",
   
  });

  // ===== HANDLERS RUTAS =====
  const handleRouteInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRouteFormData({
      ...routeFormData,
      [name]: name === "price" || name === "seats" ? parseFloat(value) : value,
    });
  };

  const handleRouteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (routeEditingId) {
      setRoutes(
        routes.map((route) => (route.id === routeEditingId ? routeFormData : route))
      );
      setRouteEditingId(null);
    } else {
      setRoutes([...routes, { ...routeFormData, id: Date.now().toString() }]);
    }
    setRouteFormData({
      id: "",
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      busType: "",
      price: 0,
      seats: 0,
      driver: "",
    });
  };

  const handleRouteEdit = (route: Route) => {
    setRouteFormData(route);
    setRouteEditingId(route.id);
  };

  const handleRouteDelete = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  const handleRouteCancel = () => {
    setRouteEditingId(null);
    setRouteFormData({
      id: "",
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      busType: "",
      price: 0,
      seats: 0,
      driver: "",
    });
  };

  // ===== HANDLERS LOCALIDADES =====
  const handleLocalityInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalityFormData({ ...localityFormData, [name]: value });
  };

  const handleLocalitySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (localityEditingId) {
      setLocalities(
        localities.map((locality) =>
          locality.id === localityEditingId ? localityFormData : locality
        )
      );
      setLocalityEditingId(null);
    } else {
      setLocalities([...localities, { ...localityFormData, id: Date.now().toString() }]);
    }
    setLocalityFormData({ id: "", name: "", province: "", postal_code: "" });
  };

  const handleLocalityEdit = (locality: Locality) => {
    setLocalityFormData(locality);
    setLocalityEditingId(locality.id);
  };

  const handleLocalityDelete = (id: string) => {
    setLocalities(localities.filter((locality) => locality.id !== id));
  };

  const handleLocalityCancel = () => {
    setLocalityEditingId(null);
    setLocalityFormData({ id: "", name: "", province: "", postal_code: "" });
  };

  // ===== HANDLERS CONDUCTORES =====
  const handleDriverInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDriverFormData({ ...driverFormData, [name]: value });
  };

  const handleDriverSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (driverEditingId) {
      setDrivers(
        drivers.map((driver) =>
          driver.id === driverEditingId ? driverFormData : driver
        )
      );
      setDriverEditingId(null);
    } else {
      setDrivers([...drivers, { ...driverFormData, id: Date.now().toString() }]);
    }
    setDriverFormData({ id: "", name: "", license: "", phone: "", email: ""});
  };

  const handleDriverEdit = (driver: Driver) => {
    setDriverFormData(driver);
    setDriverEditingId(driver.id);
  };

  const handleDriverDelete = (id: string) => {
    setDrivers(drivers.filter((driver) => driver.id !== id));
  };

  const handleDriverCancel = () => {
    setDriverEditingId(null);
    setDriverFormData({ id: "", name: "", license: "", phone: "", email: "" });
  };

  return (
    <div className="edit-container">
      <div className="edit-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona rutas, localidades y conductores</p>
      </div>

      {/* TABS */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "routes" ? "active" : ""}`}
          onClick={() => setActiveTab("routes")}
        >
          🚌 Rutas
        </button>
        <button
          className={`tab-button ${activeTab === "localities" ? "active" : ""}`}
          onClick={() => setActiveTab("localities")}
        >
          📍 Localidades
        </button>
        <button
          className={`tab-button ${activeTab === "drivers" ? "active" : ""}`}
          onClick={() => setActiveTab("drivers")}
        >
          👤 Conductores
        </button>
        <button
          className={`tab-button ${activeTab === "bus" ? "active" : ""}`}
          onClick={() => setActiveTab("bus")}
        >
          🚍 Buses y Asientos
        </button>
      </div>

      {/* ===== TAB RUTAS ===== */}
      {activeTab === "routes" && (
        <div className="tab-content">
          <form className="edit-form" onSubmit={handleRouteSubmit}>
            <div className="form-group">
              <label htmlFor="origin">Origen *</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={routeFormData.origin}
                onChange={handleRouteInputChange}
                placeholder="Ej: Buenos Aires"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destino *</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={routeFormData.destination}
                onChange={handleRouteInputChange}
                placeholder="Ej: Córdoba"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departureTime">Hora de Salida *</label>
                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={routeFormData.departureTime}
                  onChange={handleRouteInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="arrivalTime">Hora de Llegada *</label>
                <input
                  type="time"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={routeFormData.arrivalTime}
                  onChange={handleRouteInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Precio ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={routeFormData.price}
                  onChange={handleRouteInputChange}
                  placeholder="Ej: 1500"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seats">Asientos Disponibles *</label>
                <input
                  type="number"
                  id="seats"
                  name="seats"
                  value={routeFormData.seats}
                  onChange={handleRouteInputChange}
                  placeholder="Ej: 50"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="busType">Tipo de Bus *</label>
              <select
                id="busType"
                name="busType"
                value={routeFormData.busType}
                onChange={handleRouteInputChange}
                required
                className="form-select"
              >
                <option value="">Selecciona tipo de bus</option>
                <option value="Cama">Cama</option>
                <option value="Semicama">Semicama</option>
                <option value="Ejecutivo">Ejecutivo</option>
                <option value="Estándar">Estándar</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="driver">Chofer *</label>
              <input
                type="text"
                id="driver"
                name="driver"
                value={routeFormData.driver}
                onChange={handleRouteInputChange}
                placeholder="Nombre del chofer"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {routeEditingId ? "Actualizar Ruta" : "Crear Ruta"}
              </button>
              {routeEditingId && (
                <button type="button" className="btn-cancel" onClick={handleRouteCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="routes-list">
            <h2>Rutas Registradas</h2>
            {routes.length === 0 ? (
              <p className="empty-message">No hay rutas registradas</p>
            ) : (
              <div className="routes-grid">
                {routes.map((route) => (
                  <div key={route.id} className="route-card">
                    <div className="route-header">
                      <h3>{route.origin} → {route.destination}</h3>
                      <span className="route-badge">{route.busType}</span>
                    </div>
                    <div className="route-details">
                      <div className="detail-item">
                        <span className="detail-label">Salida:</span>
                        <span className="detail-value">{route.departureTime}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Llegada:</span>
                        <span className="detail-value">{route.arrivalTime}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Precio:</span>
                        <span className="detail-value">${route.price}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Asientos:</span>
                        <span className="detail-value">{route.seats}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Chofer:</span>
                        <span className="detail-value">{route.driver}</span>
                      </div>
                    </div>
                    <div className="route-actions">
                      <button className="btn-edit" onClick={() => handleRouteEdit(route)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleRouteDelete(route.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB LOCALIDADES ===== */}
      {activeTab === "localities" && (
        <div className="tab-content">
          <form className="edit-form" onSubmit={handleLocalitySubmit}>
            <div className="form-group">
              <label htmlFor="locality-name">Nombre de la Localidad *</label>
              <input
                type="text"
                id="locality-name"
                name="name"
                value={localityFormData.name}
                onChange={handleLocalityInputChange}
                placeholder="Ej: Buenos Aires"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="province">Provincia *</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={localityFormData.province}
                  onChange={handleLocalityInputChange}
                  placeholder="Ej: Buenos Aires"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code">Código Postal *</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={localityFormData.postal_code}
                  onChange={handleLocalityInputChange}
                  placeholder="Ej: 1000"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {localityEditingId ? "Actualizar Localidad" : "Crear Localidad"}
              </button>
              {localityEditingId && (
                <button type="button" className="btn-cancel" onClick={handleLocalityCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="items-list">
            <h2>Localidades Registradas</h2>
            {localities.length === 0 ? (
              <p className="empty-message">No hay localidades registradas</p>
            ) : (
              <div className="items-grid">
                {localities.map((locality) => (
                  <div key={locality.id} className="item-card">
                    <div className="item-header">
                      <h3>📍 {locality.name}</h3>
                    </div>
                    <div className="item-details">
                      <div className="detail-item">
                        <span className="detail-label">Provincia:</span>
                        <span className="detail-value">{locality.province}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Código Postal:</span>
                        <span className="detail-value">{locality.postal_code}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleLocalityEdit(locality)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleLocalityDelete(locality.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB CONDUCTORES ===== */}
      {activeTab === "drivers" && (
        <div className="tab-content">
          <form className="edit-form" onSubmit={handleDriverSubmit}>
            <div className="form-group">
              <label htmlFor="driver-name">Nombre del Conductor *</label>
              <input
                type="text"
                id="driver-name"
                name="name"
                value={driverFormData.name}
                onChange={handleDriverInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="license">Licencia *</label>
                <input
                  type="text"
                  id="license"
                  name="license"
                  value={driverFormData.license}
                  onChange={handleDriverInputChange}
                  placeholder="Ej: LIC123456"
                  required
                />
              </div>

              
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={driverFormData.phone}
                  onChange={handleDriverInputChange}
                  placeholder="Ej: +54 911 2345678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={driverFormData.email}
                  onChange={handleDriverInputChange}
                  placeholder="Ej: juan@busticket.com"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {driverEditingId ? "Actualizar Conductor" : "Crear Conductor"}
              </button>
              {driverEditingId && (
                <button type="button" className="btn-cancel" onClick={handleDriverCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="items-list">
            <h2>Conductores Registrados</h2>
            {drivers.length === 0 ? (
              <p className="empty-message">No hay conductores registrados</p>
            ) : (
              <div className="items-grid">
                {drivers.map((driver) => (
                  <div key={driver.id} className="item-card">
                    <div className="item-header">
                      <h3>👤 {driver.name}</h3>
                    </div>
                    <div className="item-details">
                      <div className="detail-item">
                        <span className="detail-label">Licencia:</span>
                        <span className="detail-value">{driver.license}</span>
                      </div>
                    
                      <div className="detail-item">
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{driver.phone}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{driver.email}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleDriverEdit(driver)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleDriverDelete(driver.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* ===== TAB Bus y Asientos ===== */}
      {activeTab === "bus" && (
        <div className="tab-content">
          <h2>Gestión de Buses y Asientos</h2>
          <p>Próximamente...</p>
        </div>
      )}


    </div>
  );
}

export default Edit;
