import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventPage from "./pages/EventPage";
import Participants from "./pages/Participants";
import Profile from "./pages/Profile";

function App() {

  const [user, setUser] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adminAuthed");
    if (saved === "true") setUser(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    setUser(false);
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <div className="brand-mark">VL</div>
            <div>
              <div className="brand-title">Vive Le Tech</div>
              <div className="brand-subtitle">Admin Dashboard</div>
            </div>
          </div>
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/event/all"
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              Events
            </NavLink>
            <NavLink
              to="/participants"
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              Participants
            </NavLink>
          </nav>
          <button className="button ghost" onClick={handleLogout}>Log out</button>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/event/:event" element={<EventPage />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/profile/:email" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
