import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";
import Modal from "./Modal";
import byWaveImage from "../assets/waveWatermark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "./CustomSelect";
import "../styles/PricingSection.css";
import bannerPrice from "../assets/banner-price.png"; // Importa l'immagine

const retailPlans = [
  {
    title: "Start",
    price: 499,
    description: "Per piccoli negozi locali",
    features: [
      "Sito vetrina semplice",
      "Mappa del negozio",
      "Modulo contatti facile",
      "Servizio fotografico base",
      "Link ai social media",
    ],
  },
  {
    title: "Next",
    price: 899,
    description: "Per negozi in espansione",
    features: [
      "Catalogo prodotti online",
      "Gestione promozioni e offerte",
      "SEO per negozi",
      "Recensioni clienti",
      "Servizio fotografico professionale",
      "Integrazione newsletter",
    ],
  },
  {
    title: "Pro",
    price: 1799,
    description: "Per grandi negozi o catene",
    features: [
      "Vendita online",
      "Gestione magazzino",
      "Programma fedeltà clienti",
      "Analytics avanzati",
      "Servizio fotografico completo",
      "Integrazioni personalizzate",
    ],
  },
];

const eCommercePlans = [
  {
    title: "Start",
    price: 499,
    description: "Per piccoli e-commerce",
    features: [
      "Negozio online semplice",
      "Gestione ordini di base",
      "Ottimizzazione mobile",
      "Integrazione social media",
    ],
  },
  {
    title: "Next",
    price: 799,
    description: "Per e-commerce in crescita",
    features: [
      "Catalogo avanzato con filtri",
      "SEO per e-commerce",
      "Gestione avanzata delle spedizioni",
      "Recensioni dei clienti",
      "Integrazione email marketing",
    ],
  },
  {
    title: "Pro",
    price: 1699,
    description: "Per grandi e-commerce",
    features: [
      "E-commerce completo",
      "Gestione multistore",
      "Sistema di fidelizzazione clienti",
      "Analytics avanzati",
      "Integrazioni personalizzate",
    ],
  },
];

const ristorazionePlans = [
  {
    title: "Start",
    price: 599,
    description: "Per piccoli ristoranti o locali",
    features: [
      "Sito web semplice",
      "Menù digitale con QR code",
      "Mappa del ristorante",
      "Servizio fotografico base",
      "Link ai social media",
    ],
  },
  {
    title: "Next",
    price: 999,
    description: "Per ristoranti in espansione",
    features: [
      "Modulo prenotazioni online",
      "Ordine al tavolo online",
      "SEO per ristoranti",
      "Recensioni clienti",
      "Servizio fotografico professionale",
      "Integrazione newsletter",
    ],
  },
  {
    title: "Pro",
    price: 1999,
    description: "Per grandi ristoranti o catene",
    features: [
      "Sistema di prenotazione avanzato",
      "Funzioni per asporto e delivery",
      "Programma di fidelizzazione clienti",
      "Analytics avanzati",
      "Servizio fotografico completo",
      "Integrazioni personalizzate",
    ],
  },
];

const PricingSection = () => {
  const [selectedPlanType, setSelectedPlanType] = useState("retail");
  const [isTagged, setIsTagged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPriceAnimating, setIsPriceAnimating] = useState(false);
  const [plans, setPlans] = useState(retailPlans);
  const [animationComplete, setAnimationComplete] = useState(true); // Aggiungi questo stato
  const sectionRef = useRef(null);
  const timerRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  const planTypeOptions = [
    { value: "retail", label: "Retail" },
    { value: "ristorazione", label: "Ristorazione" },
    { value: "ecommerce", label: "E-commerce" },
  ];

  const getSelectedPlans = () => {
    switch (selectedPlanType) {
      case "retail":
        return retailPlans;
      case "ristorazione":
        return ristorazionePlans;
      case "ecommerce":
        return eCommercePlans;
      default:
        return retailPlans;
    }
  };

  const getPlanTypeDescription = () => {
    switch (selectedPlanType) {
      case "retail":
        return "Siti web per negozi fisici";
      case "ristorazione":
        return "Siti web per ristoranti e locali";
      case "ecommerce":
        return "Siti web per vendite online";
      default:
        return "Siti web per negozi fisici";
    }
  };

  const toggleTag = useCallback(() => {
    setIsTagged((prev) => !prev);
    triggerPriceAnimation();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
  }, []);

  const handleModalInteraction = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
  }, []);

  const handleSelectPlan = (planTitle) => {
    console.log(`Piano selezionato: ${planTitle}`);
  };

  const handleMouseEnterWatermark = useCallback(() => {
    timerRef.current = setTimeout(() => {
      openModal();
    }, 300);
    autoCloseTimerRef.current = setTimeout(() => {
      if (!isModalOpen) {
        setIsModalOpen(false);
      }
    }, 5000);
  }, [openModal, isModalOpen]);

  const handleMouseLeaveWatermark = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
  }, []);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setAnimationComplete(false); // Imposta l'animazione come non completata
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationComplete(true); // Imposta l'animazione come completata
    }, 700); // Durata dell'animazione aumentata a 700ms
  };

  const triggerPriceAnimation = () => {
    setIsPriceAnimating(true);
    setTimeout(() => {
      setIsPriceAnimating(false);
    }, 700); // Durata dell'animazione aumentata a 700ms
  };

  const handlePlanTypeChange = (value) => {
    setSelectedPlanType(value);
    triggerAnimation();

    setTimeout(() => {
      switch (value) {
        case "retail":
          setPlans(retailPlans);
          break;
        case "ristorazione":
          setPlans(ristorazionePlans);
          break;
        case "ecommerce":
          setPlans(eCommercePlans);
          break;
        default:
          setPlans(retailPlans);
      }
    }, 700); // Durata dell'animazione aumentata a 700ms
  };

  useEffect(() => {
    if (animationComplete) {
      setPlans(getSelectedPlans());
    }
  }, [animationComplete, selectedPlanType]);

  // Listener per l'evento personalizzato 'closeModal'
  useEffect(() => {
    const closeModalHandler = () => setIsModalOpen(false);
    window.addEventListener("closeModal", closeModalHandler);
    return () => {
      window.removeEventListener("closeModal", closeModalHandler);
    };
  }, []);

  return (
    <>
      <motion.div
        className="pricing-section"
        id="price-section"
        ref={sectionRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="main-price-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <img
            src={bannerPrice}
            alt="Banner Sinistra"
            className="banner-left"
          />
          <div className="plan-selector">
            <span className="label">Tipo di Piano</span>
            <CustomSelect
              className="custom-select"
              options={planTypeOptions}
              value={selectedPlanType}
              onChange={handlePlanTypeChange}
              placeholder="Seleziona Piano"
            />
            <p className="plan-description">{getPlanTypeDescription()}</p>
          </div>
          <div className="main-price-title-container">
            <div className="main-price-title">Prezzi e Piani</div>
            <p className="main-price-description">
              Trova il piano perfetto per le tue esigenze
              <br />e fai crescere il tuo business.
            </p>
          </div>
          <div className="discount-switch">
            <span className="label">TAG Wave</span>
            <label className="switch">
              <input type="checkbox" checked={isTagged} onChange={toggleTag} />
              <span className="slider round"></span>
            </label>
            <p className="tag-description">
              {isTagged
                ? "Sconto del 30% con il nostro "
                : "Prezzo pieno senza "}
              <span
                className="watermark-link"
                onClick={openModal}
                onMouseEnter={handleMouseEnterWatermark}
                onMouseLeave={handleMouseLeaveWatermark}
              >
                watermark
              </span>
            </p>
          </div>
          <img src={bannerPrice} alt="Banner Destra" className="banner-right" />
        </motion.div>
        <motion.div
          className="sector-cards"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              onSelect={handleSelectPlan}
              isDiscounted={isTagged}
              isBestValue={index === 1}
              isAnimating={isAnimating}
              isPriceAnimating={isPriceAnimating}
              delay={index * 150} // Aumenta il ritardo incrementale a 150ms
            />
          ))}
        </motion.div>
      </motion.div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onInteraction={handleModalInteraction}
      >
        <div className="modal-content">
          <div className="modal-image">
            <img
              src={byWaveImage}
              alt="Watermark Wave"
              className="watermark-wave-image"
            />
          </div>
          <div className="modal-text">
            <p>
              Il <strong>Watermark Wave</strong> è un piccolo tag posizionato in
              basso a sinistra nel tuo sito, che include il testo "By Wave".
            </p>
            <h3>Vantaggi</h3>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCheckCircle} />
                Tag discreto e professionale
              </li>
              <li>
                <FontAwesomeIcon icon={faCheckCircle} />
                Certifica la qualità del nostro lavoro
              </li>
              <li>
                <FontAwesomeIcon icon={faCheckCircle} />
                Sconto del 30% sul prezzo finale
              </li>
            </ul>
            <h4>Perché scegliere il Watermark Wave?</h4>
            <p>
              Accettando di includere il nostro watermark, potrai beneficiare di
              un risparmio significativo, mantenendo al contempo un design
              pulito e professionale per il tuo sito.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PricingSection;
