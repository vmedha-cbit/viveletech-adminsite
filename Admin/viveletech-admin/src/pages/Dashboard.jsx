import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {

    async function load() {
      const ref = doc(db, "counters", "stats");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setStats(snap.data());
      }
    }

    load();

  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>

      <h1>Vive Le Tech – Admin Dashboard</h1>

      <hr />

      <h3>Overall Stats</h3>

      <p>Total Registrations: {stats.totalRegistrations}</p>
      <p>Unique Participants: {stats.uniqueRegistrations}</p>

      <p>CBIT: {stats.cbitCount}</p>
      <p>Non-CBIT: {stats.nonCbitCount}</p>

      <hr />

      <h3>Events</h3>

      <Link to="/event/dsa-master">DSA Master</Link><br />
      <Link to="/event/cipherville">CipherVille</Link><br />
      <Link to="/event/ethitech-mania">EthitechMania</Link><br />
      <Link to="/event/all">All Events</Link><br />

      <br />

      <Link to="/participants">View Participants</Link>

    </div>
  );
}
