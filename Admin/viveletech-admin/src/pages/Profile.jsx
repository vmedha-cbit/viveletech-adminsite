import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { query, where } from "firebase/firestore";
export default function Profile() {

  const { email } = useParams();

  const [list, setList] = useState([]);

  useEffect(() => {

  async function load() {

    const events = [
      "dsa-master",
      "cipherville",
      "ethitech-mania"
    ];

    const snaps = await Promise.all(
      events.map(e =>
        getDocs(
          query(
            collection(db, e),
            where("email", "==", email)
          )
        )
      )
    );

    let result = [];

    snaps.forEach(s => {
      s.forEach(d => result.push(d.data()));
    });

    setList(result);
  }

  load();

}, [email]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Participant Profile</h1>
          <p className="page-subtitle">{email}</p>
        </div>
      </div>

      {list.length === 0 && (
        <div className="card">
          <p className="muted">No registrations found.</p>
        </div>
      )}

      {list.map((p, i) => (
        <div key={i} className="card profile-card">
          <div className="section-header">
            <h3 className="section-title">{p.fullName}</h3>
            <span className="status-pill">{p.paymentStatus || "Pending"}</span>
          </div>

          <div className="profile-grid">
            <div>
              <p className="stat-label">Event</p>
              <p className="profile-value">{p.event || "N/A"}</p>
            </div>
            <div>
              <p className="stat-label">College</p>
              <p className="profile-value">{p.college}</p>
            </div>
            <div>
              <p className="stat-label">Branch</p>
              <p className="profile-value">{p.branch}</p>
            </div>
            <div>
              <p className="stat-label">Year</p>
              <p className="profile-value">{p.year}</p>
            </div>
            <div>
              <p className="stat-label">Phone</p>
              <p className="profile-value">{p.phoneNumber}</p>
            </div>
            <div>
              <p className="stat-label">Email</p>
              <p className="profile-value">{p.email}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
