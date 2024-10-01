import React, { forwardRef, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/PricingSection.css";
import PriceCardImage from "../assets/PriceCard.svg"; // Importa l'immagine SVG
import CheckIcon from "../assets/icon/check.svg"; // Importa l'icona SVG locale

const PricingCard = forwardRef(
  (
    {
      title,
      price,
      description,
      features,
      onSelect,
      isDiscounted,
      isBestValue,
      isAnimating, // Aggiungi questa prop
      isPriceAnimating, // Aggiungi questa prop
      delay, // Aggiungi questa prop
    },
    ref
  ) => {
    const cardRef = useRef(null);
    const priceRef = useRef(null);
    const [displayedPrice, setDisplayedPrice] = useState(price);

    useEffect(() => {
      const card = cardRef.current;
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", angle + "rad");
      };

      card.addEventListener("mousemove", handleMouseMove);
      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    useEffect(() => {
      if (isAnimating) {
        setTimeout(() => {
          cardRef.current.classList.add("fade-out");
          setTimeout(() => {
            cardRef.current.classList.remove("fade-out");
          }, 700); // Durata dell'animazione aumentata a 700ms
        }, delay);
      }
    }, [isAnimating, delay]);

    useEffect(() => {
      if (isPriceAnimating) {
        setTimeout(() => {
          priceRef.current.classList.add("fade-out");
          setTimeout(() => {
            priceRef.current.classList.remove("fade-out");
            setDisplayedPrice(isDiscounted ? Math.round(price * 0.7) : price);
            priceRef.current.classList.add("fade-in");
          }, 700); // Durata dell'animazione aumentata a 700ms
        }, delay);
      } else {
        setDisplayedPrice(isDiscounted ? Math.round(price * 0.7) : price);
      }
    }, [isPriceAnimating, isDiscounted, price, delay]);

    const handleSelect = () => {
      onSelect(title);
      const quoteForm = document.querySelector(".quote-form");
      if (quoteForm) {
        const start = window.scrollY;
        const end = quoteForm.getBoundingClientRect().top + start;
        const offset = window.innerHeight / 2 - quoteForm.offsetHeight / 2; // Calcola l'offset per centrare il modulo
        const targetPosition = end - offset;
        const duration = 1500; // Durata dello scroll in millisecondi
        const startTime = performance.now();

        function easeInOutCubic(t) {
          return t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        function animateScroll(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easeProgress = easeInOutCubic(progress);

          window.scrollTo(0, start + (targetPosition - start) * easeProgress);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            quoteForm.classList.add("highlight-effect");
            setTimeout(() => {
              quoteForm.classList.remove("highlight-effect");
            }, 3000); // Rimuove la classe dopo 3 secondi
          }
        }

        requestAnimationFrame(animateScroll);
      }
    };

    return (
      <motion.div
        className={`price-card ${isBestValue ? "best-value" : ""}`}
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.8, delay: delay * 0.001, ease: "easeOut" }}
      >
        {isBestValue && <div className="best-value-badge">Popolare</div>}
        <img
          src={PriceCardImage}
          alt="Price Card"
          className="price-card-image"
        />
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <p className="description">{description}</p>
          <p className="price" ref={priceRef}>
            {displayedPrice}
            <span className="euro-symbol">€</span> {/* Aggiungi questa linea */}
          </p>
        </div>
        <ul className="features">
          {features.map((feature, index) => (
            <li key={index}>
              <img src={CheckIcon} alt="Check Icon" className="feature-icon" />{" "}
              {/* Modifica questa linea */}
              {feature}
            </li>
          ))}
        </ul>
        <div className="cta-button-container">
          <button
            className={`cta-button ${isBestValue ? "best-value-button" : ""}`}
            onClick={handleSelect}
          >
            Scegli Piano
          </button>
        </div>
      </motion.div>
    );
  }
);

export default PricingCard;
