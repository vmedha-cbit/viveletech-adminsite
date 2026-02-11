import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function EventPage() {

  const { event } = useParams();

  const [list, setList] = useState([]);
  const [stats, setStats] = useState({
    cbit: 0,
    noncbit: 0,
    year: {}
  });

  useEffect(() => {

    const cacheKey = `event-analytics:${event}`;
    const cacheTtlMs = 5 * 60 * 1000;

    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        if (Date.now() - parsed.savedAt > cacheTtlMs) return null;
        return parsed;
      } catch {
        return null;
      }
    };

    const writeCache = (payload) => {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          savedAt: Date.now(),
          list: payload.list,
          stats: payload.stats
        }));
      } catch {
        // Ignore cache write errors.
      }
    };

    async function load() {

      const cached = readCache();
      if (cached) {
        setList(cached.list || []);
        setStats(cached.stats || { cbit: 0, noncbit: 0, year: {} });
        return;
      }

      let docs = [];

      if (event === "all") {

        const events = ["dsa-master", "cipherville", "ethitech-mania"];

        const snaps = await Promise.all(
          events.map(e => getDocs(collection(db, e)))
        );

        snaps.forEach(snap => {
          snap.forEach(d => docs.push(d.data()));
        });

      } else {

        const snap = await getDocs(
          collection(db, event)
        );

        snap.forEach(d => docs.push(d.data()));
      }

      // Analytics
      let cbit = 0;
      let noncbit = 0;
      let year = {};

      docs.forEach(d => {

        if (d.college === "CBIT") cbit++;
        else noncbit++;

        year[d.year] = (year[d.year] || 0) + 1;
      });

      const nextStats = { cbit, noncbit, year };
      setList(docs);
      setStats(nextStats);
      writeCache({ list: docs, stats: nextStats });

    }

    load();

  }, [event]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Analytics</h1>
          <p className="page-subtitle">Current view: {event}</p>
        </div>
      </div>

      <section className="split-grid">
        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Totals</h3>
            <span className="muted">All registrations in this view</span>
          </div>
          <div className="stat-stack">
            <div>
              <p className="stat-label">Total</p>
              <p className="stat-value">{stats.cbit + stats.noncbit}</p>
            </div>
            <div>
              <p className="stat-label">CBIT</p>
              <p className="stat-value">{stats.cbit}</p>
            </div>
            <div>
              <p className="stat-label">Non-CBIT</p>
              <p className="stat-value">{stats.noncbit}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Year-wise breakdown</h3>
            <span className="muted">Participants by academic year</span>
          </div>
          <div className="chip-grid">
            {Object.keys(stats.year).length === 0 && (
              <p className="muted">No year data available.</p>
            )}
            {Object.keys(stats.year).map(y => (
              <div key={y} className="chip">
                <span>Year {y}</span>
                <strong>{stats.year[y]}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-header">
          <h3 className="section-title">Participants</h3>
          <span className="muted">{list.length} records</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>College</th>
                <th>Year</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => (
                <tr key={i}>
                  <td>{p.fullName}</td>
                  <td>{p.college}</td>
                  <td>{p.year}</td>
                  <td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
