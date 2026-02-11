import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Participants() {

  const [list, setList] = useState([]);

  
  useEffect(() => {
    const cacheKey = "participants:list";
    const cacheTtlMs = 5 * 60 * 1000;

    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        if (Date.now() - parsed.savedAt > cacheTtlMs) return null;
        return parsed.list || null;
      } catch {
        return null;
      }
    };

    const writeCache = (items) => {
      try {
        const normalized = items.map(row => {
          const next = { ...row };
          if (next.registeredAt && typeof next.registeredAt.toDate === "function") {
            next.registeredAt = next.registeredAt.toDate().toISOString();
          }
          return next;
        });
        localStorage.setItem(cacheKey, JSON.stringify({
          savedAt: Date.now(),
          list: normalized
        }));
      } catch {
        // Ignore cache write errors.
      }
    };

    async function load() {
      const cached = readCache();
      if (cached) {
        setList(cached);
        return;
      }

      const snap = await getDocs(collection(db, "participants"));
      const items = snap.docs.map(d => d.data());
      setList(items);
      writeCache(items);
    }

    load();
  }, []);

  const formatRegisteredAt = (value) => {
    if (!value) return "";
    if (typeof value?.toDate === "function") return value.toDate().toLocaleString();
    if (typeof value === "string") {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString();
    }
    return "";
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Participants</h1>
          <p className="page-subtitle">Browse all registered attendees.</p>
        </div>
      </div>

      <section className="card">
        <div className="section-header">
          <h3 className="section-title">All registrations</h3>
          <span className="muted">{list.length} records</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>College</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => (
                <tr key={i} className="row-hover">
                  <td>
                    <Link className="link" to={`/profile/${p.email}`}>
                      {p.email}
                    </Link>
                  </td>
                  <td>{p.college}</td>
                  <td>
                    {formatRegisteredAt(p.registeredAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
