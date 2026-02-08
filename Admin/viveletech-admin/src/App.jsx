import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventPage from "./pages/EventPage";
import Participants from "./pages/Participants";
import Profile from "./pages/Profile";

function App() {

  const [user, setUser] = useState(false);

  if (!user) return <Login setUser={setUser} />;

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/event/:event" element={<EventPage />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/profile/:email" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
