import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "./CustomSelect";
import lineQuoteImage from "../assets/line-quote.png"; // Importa l'immagine

const businessTypes = [
  "Ristorante/Bar",
  "Negozio al dettaglio",
  "Servizi professionali",
  "Salute e benessere",
  "Artigianato",
  "Tecnologia/Startup",
  "Educazione/Formazione",
  "Turismo/Ospitalità",
  "Altro",
];

const plans = ["Start", "Next", "Pro"];

const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    sector: "",
    plan: "",
    questions: "",
  });
  const [emailStatus, setEmailStatus] = useState("idle"); // "idle", "loading", "valid", "invalid"
  const [errors, setErrors] = useState({});
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false); // Stato per tracciare il completamento della barra di caricamento
  const navigate = useNavigate();

  const isEmailValid = emailStatus === "valid";

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailStatus("loading");
      setShowProgressBar(value.length > 0);
      setTimeout(() => {
        if (validateEmail(value)) {
          setEmailStatus("valid");
        } else {
          setEmailStatus("invalid");
        }
      }, 600);
    }

    // Rimuovi l'errore quando l'utente inizia a selezionare un'opzione
    if (name === "sector" || name === "plan") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault(); // Previene l'invio del modulo
    if (step === 2 && !formData.sector) {
      setErrors((prev) => ({
        ...prev,
        sector: "Seleziona un'opzione per continuare",
      }));
      return;
    }
    if (step === 3 && !formData.plan) {
      setErrors((prev) => ({
        ...prev,
        plan: "Seleziona un piano per continuare",
      }));
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form submitted:", formData);
  };

  useEffect(() => {
    if (loadingComplete) {
      navigate("/conferma-preventivo");
    }
  }, [loadingComplete, navigate]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    out: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  const inputVariants = {
    focus: { scale: 1.01, boxShadow: "0px 0px 8px rgba(255,215,0,0.6)" },
    blur: { scale: 1, boxShadow: "none" },
  };

  const buttonVariants = {
    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95, boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" },
    disabled: {
      scale: 1,
      opacity: 0.5,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      transition: { duration: 0.2 },
    },
  };

  const iconButtonVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.5,
      opacity: 1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.9, rotate: -5 },
    disabled: {
      scale: 1,
      opacity: 0.5,
      transition: { duration: 0.2 },
    },
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { width: `${(step / 4) * 100}%` },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.7,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const renderEmailIcon = () => {
    switch (emailStatus) {
      case "loading":
        return (
          <motion.div
            className="email-icon loading"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FontAwesomeIcon icon={faSpinner} />
          </motion.div>
        );
      case "valid":
        return (
          <motion.div
            className="email-icon valid"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </motion.div>
        );
      case "invalid":
        return (
          <motion.div
            className="email-icon invalid"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="step-content"
          >
            <h2>Richiedi un preventivo senza impegno</h2>
            <motion.div className="input-wrapper">
              <motion.input
                type="email"
                name="email"
                placeholder="Inserisci la tua email"
                value={formData.email}
                onChange={handleChange}
                variants={inputVariants}
                whileFocus="focus"
                whileBlur="blur"
              />
              {renderEmailIcon()}
              <motion.button
                type="button"
                onClick={handleNext}
                className={`icon-button ${!isEmailValid ? "disabled" : ""}`}
                variants={iconButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={!isEmailValid ? "disabled" : "initial"}
                disabled={!isEmailValid}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </motion.button>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="step-content"
          >
            <h2>Di che cosa ti occupi?</h2>
            <div className="progress-bar">
              <div className="progress" style={{ width: "33%" }}></div>
            </div>
            <CustomSelect
              options={businessTypes.map((type) => ({
                value: type,
                label: type,
              }))}
              value={formData.sector}
              onChange={(value) => handleSelectChange("sector", value)}
              placeholder="Seleziona un'opzione"
            />
            {errors.sector && <p className="error-message">{errors.sector}</p>}
            <div className="button-group">
              <motion.button
                type="button" // Cambiato da 'submit' a 'button'
                onClick={handleBack}
                className="back-button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Indietro
              </motion.button>
              <motion.button
                type="button" // Cambiato da 'submit' a 'button'
                onClick={handleNext}
                className="next-button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Avanti <FontAwesomeIcon icon={faArrowRight} />
              </motion.button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="step-content"
          >
            <h2>Quale piano ti interessa?</h2>
            <div className="progress-bar">
              <div className="progress" style={{ width: "66%" }}></div>
            </div>
            <CustomSelect
              options={plans.map((plan) => ({ value: plan, label: plan }))}
              value={formData.plan}
              onChange={(value) => handleSelectChange("plan", value)}
              placeholder="Seleziona un piano"
            />
            {errors.plan && <p className="error-message">{errors.plan}</p>}
            <div className="button-group">
              <motion.button
                onClick={handleBack}
                className="back-button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Indietro
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="next-button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Avanti <FontAwesomeIcon icon={faArrowRight} />
              </motion.button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="step-content"
          >
            <h2>Parlaci della tua attività </h2>
            <div className="progress-bar">
              <div className="progress" style={{ width: "100%" }}></div>
            </div>
            <textarea
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              placeholder="Fornisci maggiori dettagli sul tuo business e sulle tue esigenze..."
            />
            <div className="button-group">
              <motion.button
                onClick={handleBack}
                className="back-button"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Indietro
              </motion.button>
              <div className="right-buttons">
                <motion.button
                  onClick={handleSubmit}
                  className="skip-button"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Salta
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  className="submit-button"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Invia <FontAwesomeIcon icon={faPaperPlane} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSubmitting ? (
        <motion.div
          key="form"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="quote-form-container">
            <motion.div
              className="quote-form"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img
                src={lineQuoteImage}
                alt="Quote Background"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "490px",
                  objectFit: "cover",
                  opacity: 0.325,
                  zIndex: 0,
                }}
              />
              {(step > 1 || showProgressBar) && (
                <motion.div
                  className="progress-bar"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                />
              )}
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </form>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Ci pensiamo noi!
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="thank-you"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="quote-form"
        >
          <div key="uniqueKey">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Grazie per la tua richiesta!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stiamo elaborando i tuoi dati...
            </motion.p>
            <motion.div
              className="loading-bar"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              onAnimationComplete={() => setLoadingComplete(true)} // Aggiorna lo stato al termine dell'animazione
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteForm;
