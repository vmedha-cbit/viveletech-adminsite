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
    <div style={{ padding: 20 }}>

      <h2>All Participants</h2>

      <hr />

      <table border="1" cellPadding="5">

        <thead>
          <tr>
            <th>Email</th>
            <th>College</th>
            <th>Registered</th>
          </tr>
        </thead>

        <tbody>

          {list.map((p, i) => (

            <tr key={i}>

              <td>
                <Link to={`/profile/${p.email}`}>
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
  );
}
