import React from "react";
import { motion } from "framer-motion";
import "../styles/ProcessSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPencilRuler,
  faCode,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import lineLeft from "../assets/line-left.svg";
import lineRight from "../assets/line-right.svg";
import chip from "../assets/chip.svg";

const ProcessSection = () => {
  return (
    <motion.section
      className="process-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="process-section-subtitle"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
      >
        Processi
      </motion.div>
      <motion.div
        className="process-section-header"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="process-images-container">
          <img
            src={lineLeft}
            alt="Process Line Left"
            className="process-line-left"
          />
          <img
            src={chip}
            alt="Process Chip Left"
            className="process-chip-left"
          />
          <h1>Il Nostro Approccio Unico</h1>
          <p>
            Scopri come trasformiamo le idee in realtà digitali. Il nostro
            processo è progettato per unire innovazione e praticità, garantendo
            risultati che superano le aspettative. Con un focus su eccellenza
            tecnica e valore, seguiamo ogni passo con te.
          </p>
          <img
            src={lineRight}
            alt="Process Line Right"
            className="process-line-right"
          />
          <img
            src={chip}
            alt="Process Chip Right"
            className="process-chip-right"
          />
        </div>
      </motion.div>
      <div className="process-cards-container">
        <div className="process-row">
          <motion.div
            className="process-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="process-card-content">
              <div className="process-card-wrapper">
                <div className="icon-container">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <div className="process-card-right-box">Step 01</div>
              </div>
              <h3>Consulenza Strategica</h3>
              <p>
                Analizziamo la tua visione e definiamo obiettivi chiari per il
                tuo sito web, ottimizzando la presenza online della tua
                attività.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="process-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="process-card-content">
              <div className="process-card-wrapper">
                <div className="icon-container">
                  <FontAwesomeIcon icon={faPencilRuler} />
                </div>
                <div className="process-card-right-box">Step 02</div>
              </div>
              <h3>Design e Branding</h3>
              <p>
                Creiamo la tua identità visiva con design responsive e contenuti
                fotografici professionali che catturano l'essenza del tuo brand.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="process-row">
          <motion.div
            className="process-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <div className="process-card-content">
              <div className="process-card-wrapper">
                <div className="icon-container">
                  <FontAwesomeIcon icon={faCode} />
                </div>
                <div className="process-card-right-box">Step 03</div>
              </div>
              <h3>Sviluppo e Integrazione</h3>
              <p>
                Sviluppiamo il tuo sito personalizzato, integrando funzionalità
                avanzate e la dashboard Wave per monitorare le performance.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="process-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          >
            <div className="process-card-content">
              <div className="process-card-wrapper">
                <div className="icon-container">
                  <FontAwesomeIcon icon={faRocket} />
                </div>
                <div className="process-card-right-box">Step 04</div>
              </div>
              <h3>Lancio e Supporto</h3>
              <p>
                Pubblichiamo il tuo sito ottimizzato per SEO e forniamo
                assistenza dedicata per assicurare il successo della tua
                presenza online.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProcessSection;
