import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [dailyCounts, setDailyCounts] = useState([]);
  const [exporting, setExporting] = useState(false);

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

 

  const normalizeValue = (value) => {
    if (value && typeof value.toDate === "function") {
      return value.toDate().toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(v => normalizeValue(v)).join(", ");
    }
    if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return value ?? "";
  };

  const normalizeRow = (row) => (
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, normalizeValue(value)])
    )
  );

  const handleExportAll = async () => {
    setExporting(true);

    try {
      const collectionMap = {
        participants: "participants",
        dsa_master: "dsa-master",
        cipherville: "cipherville",
        ethitech_mania: "ethitech-mania",
        counters: "counters"
      };

      const workbook = XLSX.utils.book_new();

      const entries = Object.entries(collectionMap);

      for (const [sheetName, collectionName] of entries) {
        const snap = await getDocs(collection(db, collectionName));
        const rows = snap.docs.map(d => normalizeRow({ id: d.id, ...d.data() }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }

      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `viveletech-admin-${stamp}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  if (!stats) {
    return (
      <div className="page">
        <div className="card">
          <p className="muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const maxCount = dailyCounts.reduce((max, row) => Math.max(max, row.count), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Live registration overview for Vive Le Tech.</p>
        </div>
        <button
          className="button primary"
          onClick={handleExportAll}
          disabled={exporting}
        >
          {exporting ? "Exporting..." : "Export All Collections"}
        </button>
      </div>

      <section className="card-grid">
        <div className="card stat-card">
          <p className="stat-label">Total Registrations</p>
          <p className="stat-value">{stats.totalRegistrations}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Unique Participants</p>
          <p className="stat-value">{stats.uniqueRegistrations}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">CBIT Registrations</p>
          <p className="stat-value">{stats.cbitCount}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Non-CBIT Registrations</p>
          <p className="stat-value">{stats.nonCbitCount}</p>
        </div>
      </section>

      <section className="split-grid">
        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Registrations per day</h3>
            <span className="muted">Based on participants collection</span>
          </div>
          {dailyCounts.length === 0 ? (
            <p className="muted">No daily registration data available.</p>
          ) : (
            <div className="chart">
              {dailyCounts.map(row => (
                <div key={row.date} className="chart-row">
                  <span className="chart-label">{row.date}</span>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill"
                      style={{ width: `${Math.round((row.count / maxCount) * 100)}%` }}
                    />
                  </div>
                  <span className="chart-value">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h3 className="section-title">Quick navigation</h3>
            <span className="muted">Jump to event analytics</span>
          </div>
          <div className="button-grid">
            <Link className="button secondary" to="/event/dsa-master">DSA Master</Link>
            <Link className="button secondary" to="/event/cipherville">CipherVille</Link>
            <Link className="button secondary" to="/event/ethitech-mania">EthitechMania</Link>
            <Link className="button secondary" to="/event/all">All Events</Link>
            <Link className="button ghost" to="/participants">View Participants</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
