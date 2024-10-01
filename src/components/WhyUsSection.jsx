import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Importa motion da framer-motion
import { useInView } from "react-intersection-observer"; // Importa useInView
import "../styles/WhyUsSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faChartLine,
  faHeadset,
  faPlay,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Prova from "../assets/prova.png";

const WhyUsSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const handlePlayClick = () => {
    const mainCard = document.querySelector(".main-card");
    mainCard.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      setIsVideoOpen(true);
      document.body.classList.add("video-open");
      setTimeout(() => {
        setShowCloseButton(true);
      }, 900);
    }, 50);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation(); // Evita che il clic sul pulsante di chiusura venga interpretato come un clic sulla main card
    setIsVideoOpen(false);
    document.body.classList.remove("video-open");
    setShowCloseButton(false);
    document.dispatchEvent(new Event("videoClosed")); // Aggiunto
  };

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
      navbar.classList.add("navbar-hidden");
      setTimeout(() => {
        navbar.classList.add("display-none");
      }, 1000);
    } else {
      document.body.style.overflow = "auto";
      navbar.classList.remove("display-none");
      setTimeout(() => {
        navbar.classList.remove("navbar-hidden");
      }, 10);
    }
  }, [isVideoOpen]);

  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
  });
  const { ref: glowRef, inView: glowInView } = useInView({ triggerOnce: true });
  const { ref: mainCardRef, inView: mainCardInView } = useInView({
    triggerOnce: true,
  });
  const { ref: miniCardsRef, inView: miniCardsInView } = useInView({
    triggerOnce: true,
  });

  return (
    <motion.section
      id="why-us-section"
      className="why-us-section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="why-us-header"
        ref={headerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <h1>
          Potenzia la tua presenza online e offline con soluzioni innovative e
          personalizzate.
        </h1>
      </motion.div>
      <motion.div
        className="why-us-glow-effect"
        ref={glowRef}
        initial={{ opacity: 0 }}
        animate={glowInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      ></motion.div>
      <motion.div
        className="main-card"
        ref={mainCardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={mainCardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        onClick={handlePlayClick}
      >
        <div className="main-card-content">
          <img
            src={Prova}
            alt="Anteprima del video"
            className="video-wave-preview"
          />
          <button className="play-video-button" onClick={handlePlayClick}>
            <FontAwesomeIcon icon={faPlay} className="icon" />
          </button>
          {isVideoOpen && (
            <div className="video-wave-overlay">
              <button
                className={`close-video-button ${
                  showCloseButton ? "visible" : ""
                }`}
                onClick={handleCloseClick}
              >
                <FontAwesomeIcon icon={faTimes} className="icon" />
              </button>
              <div className="video-wave-container">
                <iframe
                  width="80%"
                  height="80%"
                  src="https://www.youtube.com/embed/IulZBY8wxTE?autoplay=1&controls=1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <motion.div
        className="mini-cards-container"
        ref={miniCardsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={miniCardsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="mini-card"
          initial={{ opacity: 0, y: 50 }}
          animate={miniCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="mini-card-content">
            <div className="icon-container">
              <FontAwesomeIcon icon={faServer} />
            </div>
            <h3>Servizi Inclusi</h3>
            <p>
              Hosting e dominio gratuiti per un anno con ogni tipo di piano
              wave.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="mini-card"
          initial={{ opacity: 0, y: 50 }}
          animate={miniCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="mini-card-content">
            <div className="icon-container">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <h3>Assistenza 24/7</h3>
            <p>
              Supporto dedicato in ogni momento per garantire il successo del
              tuo progetto.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="mini-card"
          initial={{ opacity: 0, y: 50 }}
          animate={miniCardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="mini-card-content">
            <div className="icon-container">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3>Dashboard WAVE Pro</h3>
            <p>
              Gestione e analisi avanzate del tuo sito in un'unica piattaforma.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default WhyUsSection;
