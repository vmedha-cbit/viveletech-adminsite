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

    async function load() {

      let docs = [];

      if (event === "all") {

        const events = ["dsa-master", "cipherville", "ethitech-mania"];

        const snaps = await Promise.all(
          events.map(e =>
            getDocs(collection(db, e))
          )
        );

        snaps.forEach(s => {
          s.forEach(d => docs.push(d.data()));
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

      setList(docs);
      setStats({ cbit, noncbit, year });

    }

    load();

  }, [event]);

  return (
    <div style={{ padding: 20 }}>

      <h2>Event: {event}</h2>

      <hr />

      <h3>Analytics</h3>
         <p>Total : {stats.cbit + stats.noncbit}</p>
      <p>CBIT: {stats.cbit}</p>
      <p>Non-CBIT: {stats.noncbit}</p>

      <h4>Year-wise</h4>

      {Object.keys(stats.year).map(y => (
        <p key={y}>
          Year {y}: {stats.year[y]}
        </p>
      ))}

      <hr />

      <h3>Participants</h3>

      <table border="1" cellPadding="5">

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
  );
}
