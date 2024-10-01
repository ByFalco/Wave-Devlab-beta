import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"; // Importa framer-motion
import "../styles/FaqSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import lineFaq from "../assets/line-faq.png"; // Importa l'immagine
import lineFaqLeft from "../assets/line-faq-left.png"; // Importa l'immagine
import Chip from "../assets/chip.svg"; // Importa l'immagine

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef(null);

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.style.maxHeight = isOpen
        ? `${answerRef.current.scrollHeight}px`
        : "0px";
    }
  }, [isOpen]);

  return (
    <motion.div
      className={`faq-item ${isOpen ? "open" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className="faq-toggle">
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </div>
      <div className="faq-divider"></div>
      <div className="faq-answer" ref={answerRef}>
        <div className="faq-answer-content">{answer}</div>
      </div>
    </motion.div>
  );
};

const FaqSection = () => {
  const faqData = [
    {
      question: "Cosa include il piano WAVE Base?",
      answer:
        "Il piano WAVE Base include SEO locale ottimizzato, assistenza prioritaria per 3 mesi, fino a 5 pagine Web responsive, servizio fotografico professionale, integrazione Google My Business e monitoraggio base delle performance.",
    },
    {
      question: "Quali sono i vantaggi del piano WAVE Standard?",
      answer:
        "Il piano WAVE Standard offre SEO avanzato con targeting locale, assistenza prioritaria per 6 mesi, fino a 10 pagine Web personalizzate, servizio fotografico e video teaser, design personalizzato con branding, integrazione QR code e accesso alla Dashboard WAVE Pro.",
    },
    {
      question: "Cosa comprende il piano WAVE Premium?",
      answer:
        "Il piano WAVE Premium include SEO completo, assistenza prioritaria dedicata per 12 mesi, pagine Web illimitate con architettura avanzata, servizio fotografico e video teaser, design su misura con UX/UI ottimizzata, integrazione CRM e automazione marketing, strategia omnichannel personalizzata e accesso alla Dashboard WAVE Pro.",
    },
    {
      question:
        "Quali sono le caratteristiche del piano WAVE Starter per E-Commerce?",
      answer:
        "Il piano WAVE Starter per E-Commerce include un catalogo fino a 50 prodotti, assistenza prioritaria per 3 mesi, design responsive ottimizzato per conversioni, integrazione gateway pagamenti sicuri, SEO di base per prodotti chiave e ottimizzazione delle schede prodotto.",
    },
    {
      question: "Cosa offre il piano WAVE Business per E-Commerce?",
      answer:
        "Il piano WAVE Business per E-Commerce offre un catalogo fino a 500 prodotti, assistenza prioritaria per 6 mesi, gestione inventario avanzata, SEO e-commerce ottimizzato, design personalizzato con focus UX, funzionalità upsell e cross-sell e accesso alla Dashboard WAVE Pro.",
    },
    {
      question:
        "Quali sono i benefici del piano WAVE Enterprise per E-Commerce?",
      answer:
        "Il piano WAVE Enterprise per E-Commerce include prodotti illimitati con gestione varianti avanzata, assistenza prioritaria dedicata per 12 mesi, gestione multi-store, SEO completo, design su misura con A/B testing, integrazione CRM e automazione marketing, integrazione ERP e sincronizzazione real-time e accesso alla Dashboard WAVE Pro.",
    },
  ];

  const halfLength = Math.ceil(faqData.length / 2);
  const leftColumn = faqData.slice(0, halfLength);
  const rightColumn = faqData.slice(halfLength);

  return (
    <motion.section
      className="faq-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="faq-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={lineFaqLeft} // Usa la variabile dell'immagine
          alt="linea sinistra"
          className="faq-header-image left"
        />
        <img
          src={Chip} // Usa la variabile dell'immagine
          alt="chip sinistra"
          className="chip-faq left"
        />
        <div className="faq-header-subtitle">FAQ's</div>
        <h2>Domande Frequenti</h2>
        <p className="faq-description">
          Trova risposte alle domande comuni sui piani WAVE e le loro
          caratteristiche.
        </p>
        <img
          src={lineFaq} // Usa la variabile dell'immagine
          alt="linea destra"
          className="faq-header-image right"
        />
        <img
          src={Chip} // Usa la variabile dell'immagine
          alt="chip destra"
          className="chip-faq right"
        />
      </motion.div>
      <div className="faq-columns">
        <div className="faq-column">
          {leftColumn.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        <div className="faq-column">
          {rightColumn.map((faq, index) => (
            <FaqItem
              key={index + halfLength}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FaqSection;
