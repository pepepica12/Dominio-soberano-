import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Cargar DID desde GitHub Pages
    fetch("https://pepepica12.github.io/alma_did/did.json")
      .then(res => res.json())
      .then(data => {
        setServices(data.service);

        // Conectar automáticamente a todos los servicios declarados en el DID
        data.service.forEach(s => {
          // Ejemplo: si es backend, intenta consumir un endpoint
          if (s.type === "BackendService") {
            fetch(s.serviceEndpoint + "/api/ejemplo") // Ajusta la ruta real de tu backend
              .then(res => res.json())
              .then(apiData => {
                setResponses(prev => ({ ...prev, [s.id]: apiData }));
              })
              .catch(err => console.error("Error conectando a", s.id, err));
          }

          // Ejemplo: si es TelemetryService, intenta consumir datos
          if (s.type === "TelemetryService") {
            fetch(s.serviceEndpoint + "/metrics") // Ajusta la ruta real de tu telemetría
              .then(res => res.json())
              .then(metrics => {
                setResponses(prev => ({ ...prev, [s.id]: metrics }));
              })
              .catch(err => console.error("Error conectando a", s.id, err));
          }
        });
      })
      .catch(err => console.error("Error cargando DID:", err));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Plataforma Soberana: did:alma:root</h1>

      <h2>Servicios conectados:</h2>
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
