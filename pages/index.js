import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
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
            setResponses(prev => ({ ...prev, [s.id]: "Frontend enlazado" }));
          }
        });
      })
      .catch(err => console.error("Error cargando DID:", err));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Plataforma Soberana Multifuncional</h1>

      {/* Menú dinámico */}
      <nav style={{ marginBottom: "2rem" }}>
        {services.map(s => (
          <button
            key={s.id}
            style={{
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              background: activeService === s.id ? "#444" : "#888",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => setActiveService(s.id)}
          >
            {s.id.replace("#", "").toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Contenido dinámico */}
      <div>
        {activeService ? (
          <div>
            <h2>Servicio activo: {activeService}</h2>
            <pre>
              {responses[activeService]
                ? JSON.stringify(responses[activeService], null, 2)
                : "Esperando datos..."}
            </pre>
          </div>
        ) : (
          <p>Selecciona un servicio del menú para comenzar.</p>
        )}
      </div>
    </div>
  );
}
