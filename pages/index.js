import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetch("https://pepepica12.github.io/alma_did/did.json")
      .then(res => res.json())
      .then(data => {
        setServices(data.service);

        // Conectar automáticamente a cada servicio
        data.service.forEach(s => {
          if (s.type === "BackendService") {
            fetch(s.serviceEndpoint + "/api/ejemplo") // Ajusta la ruta real
              .then(res => res.json())
              .then(apiData => setResponses(prev => ({ ...prev, [s.id]: apiData })))
              .catch(err => console.error("Error en", s.id, err));
          }

          if (s.type === "TelemetryService") {
            fetch(s.serviceEndpoint + "/metrics") // Ajusta la ruta real
              .then(res => res.json())
              .then(metrics => setResponses(prev => ({ ...prev, [s.id]: metrics })))
              .catch(err => console.error("Error en", s.id, err));
          }

          if (s.type === "FrontendService") {
            // No se consume, se enlaza
            setResponses(prev => ({ ...prev, [s.id]: "Frontend enlazado" }));
          }
        });
      })
      .catch(err => console.error("Error cargando DID:", err));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Plataforma Soberana Multifuncional</h1>
      <ul>
        {services.map(s => (
          <li key={s.id}>
            <strong>{s.id}</strong> →{" "}
            <a href={s.serviceEndpoint} target="_blank" rel="noopener noreferrer">
              {s.serviceEndpoint}
            </a>
            <pre>
              {responses[s.id]
                ? JSON.stringify(responses[s.id], null, 2)
                : "Esperando datos..."}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
