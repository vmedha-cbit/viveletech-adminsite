import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Participants() {

  const [list, setList] = useState([]);

  useEffect(() => {

    async function load() {

      const snap = await getDocs(
        collection(db, "participants")
      );

      setList(
        snap.docs.map(d => d.data())
      );
    }

    load();

  }, []);

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
                    {p.registeredAt?.toDate
                      ? p.registeredAt.toDate().toLocaleString()
                      : ""}
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
