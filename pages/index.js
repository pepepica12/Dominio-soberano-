import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("https://pepepica12.github.io/alma_did/did.json")
      .then(res => res.json())
      .then(data => setServices(data.service))
      .catch(err => console.error("Error cargando DID:", err));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Plataforma Soberana: did:alma:root</h1>
      <ul>
        {services.map(s => (
          <li key={s.id}>
            <strong>{s.id}</strong> →{" "}
            <a href={s.serviceEndpoint} target="_blank" rel="noopener noreferrer">
              {s.serviceEndpoint}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
