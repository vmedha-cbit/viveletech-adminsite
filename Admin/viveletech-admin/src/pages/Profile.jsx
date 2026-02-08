import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

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
          getDocs(collection(db, e))
        )
      );

      let result = [];

      snaps.forEach(s => {

        s.forEach(d => {

          const data = d.data();

          if (data.email === email) {
            result.push(data);
          }

        });

      });

      setList(result);

    }

    load();

  }, [email]);

  return (
    <div style={{ padding: 20 }}>

      <h2>Participant Profile</h2>

      <p>Email: {email}</p>

      <hr />

      {list.length === 0 && (
        <p>No registrations found.</p>
      )}

      {list.map((p, i) => (

        <div key={i}>

          <h4>{p.fullName}</h4>

          <p>Event: {p.event || "N/A"}</p>
          <p>College: {p.college}</p>
          <p>Branch: {p.branch}</p>
          <p>Year: {p.year}</p>
          <p>Phone: {p.phoneNumber}</p>
          <p>Status: {p.paymentStatus}</p>

          <hr />

        </div>

      ))}

    </div>
  );
}
