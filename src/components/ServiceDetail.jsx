import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import servicesData from "../data/servicesData"; // Assicurati di avere un file separato per i dati dei servizi
import "../styles/ServicesDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const ServiceDetail = () => {
  const { serviceType } = useParams();
  const normalizedServiceType = serviceType.replace("-", "").toLowerCase();
  const service = servicesData.find(
    (service) =>
      service.id.replace("-", "").toLowerCase() === normalizedServiceType
  );
  const [showExamples, setShowExamples] = useState(false);

  console.log("serviceType:", serviceType); // Debug: verifica il valore di serviceType
  console.log("normalizedServiceType:", normalizedServiceType); // Debug: verifica il valore di normalizedServiceType
  console.log("service:", service); // Debug: verifica l'oggetto service

  if (!service) {
    return <div>Servizio non trovato</div>;
  }

  const serviceButtons = {
    retail: [
      "Servizio fotografico",
      "Sistema recensioni",
      "Programma fedeltà clienti",
    ],
    ristorazione: ["QR-code", "Modulo prenotazioni", "Integrazione delivery"],
    ecommerce: [
      "Gestione ordini",
      "Gestione spedizioni",
      "Gestione multi store",
    ],
  };

  console.log("serviceButtons:", serviceButtons); // Debug: verifica l'oggetto serviceButtons
  console.log(
    "serviceButtons[normalizedServiceType]:",
    serviceButtons[normalizedServiceType]
  ); // Debug: verifica i pulsanti per il normalizedServiceType

  return (
    <div className="service-detail-container">
      <aside className="categories-column">
        <div className="button-group-detail">
          <button onClick={() => window.history.back()}>Indietro</button>
          <button onClick={() => setShowExamples(!showExamples)}>Esempi</button>
        </div>
        <hr />
        <div className="service-buttons-detail">
          {serviceButtons[normalizedServiceType]?.map((text, index) => (
            <button key={index} className="service-button-detail">
              {text}
            </button>
          ))}
        </div>
      </aside>
      <main className="service-content-detail">
        <nav className="breadcrumb">
          <span>Categorie</span>
          <FontAwesomeIcon icon={faAngleRight} className="arrow-right-detail" />
          <span>{service.title}</span>
        </nav>
        <h1>{service.title}</h1>
        {showExamples && (
          <div className="service-grid-detail">
            {service.images.map((image, index) => (
              <div key={index} className="service-card-detail">
                <img
                  src={image}
                  alt={`${service.title} example ${index + 1}`}
                  className="service-example-image-detail"
                />
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ServiceDetail;
