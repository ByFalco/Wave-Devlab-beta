import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/ServicesSection.css";
import servicesData from "../data/servicesData"; // Importa i dati dei servizi

const ServicesSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (service) => {
    navigate(`/services/${service.title.toLowerCase()}`);
  };

  return (
    <section className="services-section">
      <div className="services-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          I Nostri Progetti Web
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Scopri i nostri esempi di siti web moderni e responsive per ogni
          settore.
        </motion.p>
        <div className="services-glow-effect"></div>
      </div>
      <div className="services-grid">
        {servicesData.map((service, index) => (
          <motion.div
            key={index}
            className="service-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
            onClick={() => handleCardClick(service)}
          >
            <div className="service-header">
              <img
                src={service.icon}
                alt={`${service.title} icon`}
                className="service-icon"
              />
              <h3>{service.title}</h3>
              <span className="template-count">{service.templates}</span>
            </div>
            <p>{service.description}</p>
            <div className="service-images">
              {service.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={`${service.title} example ${imgIndex + 1}`}
                  className="service-example-image"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
