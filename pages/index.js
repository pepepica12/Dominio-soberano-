import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    // Cargar DID
    fetch("https://pepepica12.github.io/alma_did/did.json")
      .then(res => res.json())
      .then(data => {
        setServices(data.service);

        // Buscar el backend en Render dentro del DID
        const backend = data.service.find(s => s.id === "#backend-render");
        if (backend) {
          fetch(backend.serviceEndpoint + "/api/ejemplo") // Ajusta la ruta real de tu backend
            .then(res => res.json())
            .then(apiData => setBackendData(apiData))
            .catch(err => console.error("Error conectando al backend:", err));
        }
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
          </li>
        ))}
      </ul>

      <h2>Datos desde el backend Render:</h2>
      <pre>{backendData ? JSON.stringify(backendData, null, 2) : "Cargando..."}</pre>
    </div>
  );
}
