import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import CustomCursor from "./components/CustomCursor";
import "./App.css";
import "./styles/ContactGold.css";
import "./styles/QuoteForm.css";
import "./styles/ResponsiveMain.css";
import LogoNavbar from "./assets/logo-navbar.png";

//componenti homepage//
import ProjectsSection from "./components/ProjectsSection";
import WhyUsSection from "./components/WhyUsSection";
import ProcessSection from "./components/ProcessSection";
import PricingSection from "./components/PricingSection";
import FaqSection from "./components/FaqSection";
import ServicesSection from "./components/ServicesSection";
import ServiceDetail from "./components/ServiceDetail";

import ScrollDownAnimation from "./components/ScrollDownAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faComments,
  faHouse,
  faFileCode,
  faInfoCircle,
  faEnvelope,
  faUserCircle,
  faPaperPlane,
  faPhoneAlt,
  faUserClock,
  faAt,
  faCircleNotch,
  faCircleXmark,
  faCircleCheck,
  faArrowRight,
  faArrowLeft,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import SupportChat from "./components/SupportChat";
import GoldenGlowEffect from "./components/GoldenGlowEffect";
import { motion, AnimatePresence } from "framer-motion";
import QuoteForm from "./components/QuoteForm";

// Importa le immagini SVG
import HomeIcon from "./assets/icon/Home.svg";
import EsempiIcon from "./assets/icon/Esempi.svg";
import AboutUsIcon from "./assets/icon/aboutus.svg";
import ContactIcon from "./assets/icon/Contact.svg";
import PianiIcon from "./assets/icon/PianiButton.svg";
import LoginIcon from "./assets/icon/Login.svg";
import PlayCircle from "./assets/icon/PlayCircle.svg";

const TypingEffect = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const getRandomTypingDelay = () => Math.random() * 50 + 50; // 50-100ms
    const getRandomDeletingDelay = () => Math.random() * 30 + 30; // 30-60ms
    const getPauseDelay = () => Math.random() * 1000 + 1000; // 1-2s

    const timeout = setTimeout(
      () => {
        if (isPausing) {
          setIsPausing(false);
          setIsDeleting(true);
        } else {
          setCurrentText((prev) => {
            if (!isDeleting) {
              if (prev === currentWord) {
                setIsPausing(true);
                return prev;
              }
              return currentWord.slice(0, prev.length + 1);
            } else {
              if (prev === "") {
                setIsDeleting(false);
                setCurrentWordIndex(
                  (prevIndex) => (prevIndex + 1) % words.length
                );
                return "";
              }
              return prev.slice(0, -1);
            }
          });
        }
      },
      isPausing
        ? getPauseDelay()
        : isDeleting
        ? getRandomDeletingDelay()
        : getRandomTypingDelay()
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPausing, currentWordIndex, words]);

  return (
    <span className="typing-container">
      &#123; {currentText}
      <span className="cursor"></span> &#125;
    </span>
  );
};

// Componente NavLink personalizzato
// NavItem component
const NavItem = ({ to, icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className={`nav-item ${isActive ? "active" : ""}`}>
      {to.startsWith("#") ? (
        <ScrollLink
          to={to.substring(1)}
          smooth="true"
          duration={500}
          className="nav-link clickable"
          onClick={onClick}
        >
          <img src={icon} alt="" className="nav-icon" />
          <span>{children}</span>
        </ScrollLink>
      ) : (
        <Link to={to} className="nav-link clickable" onClick={onClick}>
          <img src={icon} alt="" className="nav-icon" />
          <span>{children}</span>
        </Link>
      )}
    </li>
  );
};

// Componente Navbar
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrolled]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [sidebarOpen]);

  // Close sidebar when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handlePianiClick = (event) => {
    event.preventDefault();
    if (isHome) {
      const priceSection = document.getElementById("price-section"); // Assicurati che l'ID sia corretto
      if (priceSection) {
        const start = window.scrollY;
        const end = priceSection.getBoundingClientRect().top + start - 50; // Scroll leggermente più in alto
        const duration = 800;
        const startTime = performance.now();

        function easeInOutCubic(t) {
          return t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        function animate(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easeProgress = easeInOutCubic(progress);

          window.scrollTo(0, start + (end - start) * easeProgress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      }
    } else {
      window.location.href = "/#price-section";
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavItemClick = () => {
    setSidebarOpen(false);
  };

  const NavMenu = () => (
    <>
      {!isHome && (
        <NavItem to="/" icon={HomeIcon} onClick={handleNavItemClick}>
          Home
        </NavItem>
      )}
      <NavItem to="/progetti" icon={EsempiIcon} onClick={handleNavItemClick}>
        Progetti
      </NavItem>
      <NavItem to="/about" icon={AboutUsIcon} onClick={handleNavItemClick}>
        About Us
      </NavItem>
      <NavItem to="/contact" icon={ContactIcon} onClick={handleNavItemClick}>
        Contatti
      </NavItem>
    </>
  );

  return (
    <div className={`navbar-container ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-wrapper">
        {" "}
        {/* Aggiungi questa riga */}
        <nav className="navbar">
          <div className="navbar-logo">
            <img src={LogoNavbar} alt="Wave Logo" />
          </div>
          {!isMobile && (
            <>
              <ul className="navbar-menu">
                <NavMenu />
              </ul>
              <div className="navbar-buttons">
                <button
                  onClick={handlePianiClick}
                  className="navbar-button piani clickable"
                >
                  <img src={PianiIcon} alt="Piani" className="piani-icon" />
                  <span>Piani</span>
                </button>
                <Link to="/login" className="auth-link clickable">
                  <span className="auth-text">Login</span>
                  <img src={LoginIcon} alt="Login" className="login-icon" />
                </Link>
              </div>
            </>
          )}
          {isMobile && (
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
            </button>
          )}
        </nav>
        {isMobile && (
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <ul className="navbar-menu">
              <NavMenu />
            </ul>
            <div className="navbar-buttons">
              <button
                onClick={handlePianiClick}
                className="navbar-button piani"
              >
                <FontAwesomeIcon icon={faLayerGroup} className="fa-icon" />
                <span>Piani</span>
              </button>
              <Link
                to="/login"
                className="auth-link"
                onClick={handleNavItemClick}
              >
                <span className="auth-text">Login</span>
                <img src={LoginIcon} alt="Login" className="login-icon" />
              </Link>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Aggiungi questa riga */}
    </div>
  );
};

const MemoizedTypingEffect = React.memo(TypingEffect); // Utilizzo React.memo per ottimizzare il rendering

// Header Component
const Header = () => {
  const scrollToProjects = (event) => {
    event.preventDefault();
    const projectsSection = document.getElementById("projects-section");
    if (projectsSection) {
      smoothScrollTo(projectsSection);
    }
  };

  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev % 4) + 1);
    }, 1500); // Cambia immagine ogni 3 secondi

    return () => clearInterval(interval);
  }, []);

  const smoothScrollTo = (targetElement, duration = 800) => {
    const start = window.pageYOffset;
    const target = targetElement.getBoundingClientRect().top + start;
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animate(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, start + (target - start) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  };

  return (
    <header className="header">
      <GoldenGlowEffect />
      <motion.img
        src="src/assets/pallini1.svg"
        alt="Pallini 1"
        className="pallini pallini-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          ease: "easeOut",
        }}
      />
      <motion.img
        src="src/assets/pallini2.svg"
        alt="Pallini 2"
        className="pallini pallini-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          ease: "easeOut",
        }}
      />
      <motion.img
        src="src/assets/icon1.png"
        alt="Icona 1"
        className="floating-icon left-top"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: [0, -5, 0],
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.6, -0.05, 0.01, 0.99],
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      />
      <motion.img
        src="src/assets/icon3.png"
        alt="Icona 2"
        className="floating-icon left-bottom"
        initial={{ opacity: 0, x: -100, y: 100 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1,
          delay: 0.4,
          ease: "backOut",
          y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, x: -10 }}
      />
      <motion.img
        src="src/assets/icon2.png"
        alt="Icona 3"
        className="floating-icon right-top"
        initial={{ opacity: 0, scale: 2, y: -100 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -5, 0],
        }}
        transition={{
          duration: 1.2,
          delay: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, rotate: -5 }}
      />
      <motion.img
        src="src/assets/icon4.png"
        alt="Icona 4"
        className="floating-icon right-bottom"
        initial={{ opacity: 0, scale: 0, rotate: 90 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1,
          delay: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 10,
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, y: -10 }}
      />
      <motion.div
        className="centered-image-container"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <img
          src="src/assets/pallini-logo.svg"
          alt="Logo Pallini"
          className="centered-image static-image"
        />
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={`src/assets/lvl${currentImage}.png`}
            alt={`Livello ${currentImage}`}
            className="centered-image dynamic-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <motion.div
          className="square-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="square-mini-container">
            <div className="square-content">
              <img
                src="src/assets/logo-v2.png"
                alt="Logo Wave"
                className="square-logo"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="slogan"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h1>
          <span className="highlight">
            <MemoizedTypingEffect
              words={["Realizza", "Rinnova", "Ottimizza"]}
            />
          </span>
          <br />
        </h1>
        <p>il tuo sito web ideale.</p>
      </motion.div>
      <motion.div
        className="cta-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <img
          src="src/assets/line-left.svg"
          alt="Line Left"
          className="line-left"
        />
        <img
          src="src/assets/chip.svg"
          alt="Chip Left"
          className="chip chip-left"
        />
        <div className="buttons-container">
          <button
            className="cta-button secondary clickable"
            onClick={scrollToProjects}
          >
            Esplora esempi
          </button>
          <button className="cta-button primary clickable">
            <img src={PlayCircle} alt="Play" className="fa-icon" />
            Guarda il video
          </button>
        </div>
        <img
          src="src/assets/line-right.svg"
          alt="Line Right"
          className="line-right"
        />
        <img
          src="src/assets/chip.svg"
          alt="Chip Right"
          className="chip chip-right"
        />
      </motion.div>
      <motion.div
        className="quote-form-container"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1.1,
          delay: 0.5,
          ease: [0.645, 0.045, 0.355, 1.0],
        }}
      >
        <img src="src/assets/line2.svg" alt="Line 2" className="line2" />
        <QuoteForm />
        <img src="src/assets/line.svg" alt="Line" className="line" />
      </motion.div>
      <motion.div
        className="scroll-down-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.1 }}
      >
        <ScrollDownAnimation />
      </motion.div>
    </header>
  );
};
// Footer Component
const Footer = () => (
  <footer className="footer">
    <p>&copy; 2024 Wave. All rights reserved.</p>
  </footer>
);

// Home Page
const Home = () => {
  const homeRef = useRef(null);

  useEffect(() => {
    const createSparkles = () => {
      const sparklesContainer = homeRef.current;
      const sparkleCount = 50;

      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 4}s`;
        sparklesContainer.appendChild(sparkle);
      }
    };

    createSparkles();
  }, []);

  return (
    <div className="home" ref={homeRef}>
      <Header />
      <WhyUsSection />
      <div id="projects-section">
        <ProjectsSection />
      </div>
      <ProcessSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
};

// Example Page
const Examples = () => (
  <div className="examples">
    <h2>Our Work</h2>
    {/* Add your examples here */}
  </div>
);

// About Us Page
const AboutUs = () => (
  <div className="about-us">
    <h2>About Wave</h2>
    <p>We specialize in creating web presence for physical businesses.</p>
  </div>
);

// Sezione Contatti migliorata e più professionale
const Contact = () => {
  const supportChatRef = useRef(null);

  const handleStartChat = () => {
    if (supportChatRef.current && supportChatRef.current.openChat) {
      supportChatRef.current.openChat();
    }
  };

  return (
    <div className="contact-page">
      <h2 className="contact-title">Contatti</h2>
      <div className="contact-content">
        <div className="contact-form-container contact-gold">
          <h3>
            <FontAwesomeIcon icon={faEnvelope} className="fa-icon" />
            Contattaci via E-mail
          </h3>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nome e Cognome</label>
              <input type="text" id="name" placeholder="Mario Rossi" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Indirizzo Email</label>
              <input
                type="email"
                id="email"
                placeholder="mariorossi@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Numero di telefono</label>
              <input type="tel" id="phone" placeholder="+39 " />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Oggetto</label>
              <input
                type="text"
                id="subject"
                placeholder="Richiesta informazioni"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Come possiamo aiutarti?</label>
              <textarea
                id="message"
                placeholder="Scrivi qui il tuo messaggio..."
                required
              ></textarea>
            </div>
            <button type="submit" className="contact-submit-button">
              Invia messaggio
            </button>
          </form>
        </div>
        <div className="contact-info-container">
          <div className="contact-info-card">
            <h3>Info Generali</h3>
            <div className="contact-items">
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FontAwesomeIcon
                    icon={faPhoneAlt}
                    className="fa-icon"
                    fontSize="1.2rem"
                  />
                </div>
                <div>
                  <p>Telefono</p>
                  <a href="tel:+393792472335">+39 379 247 2335</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FontAwesomeIcon
                    icon={faAt}
                    className="fa-icon"
                    fontSize="1.2rem"
                  />
                </div>
                <div>
                  <p>Email</p>
                  <a href="mailto:wave.devlab@gmail.com">
                    wave.devlab@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FontAwesomeIcon
                    icon={faDiscord}
                    className="fa-icon"
                    fontSize="1.2rem"
                  />
                </div>
                <div>
                  <p>Discord</p>
                  <a
                    href="https://discord.gg/bQC87pfH35"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Unisciti al nostro server
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-info-card">
            <h3>Orari di Assistenza</h3>
            <div className="support-hours">
              <div className="day-group">
                <p className="day">Lunedì - Venerdì</p>
                <p className="hours">12:00 - 18:00</p>
              </div>
              <div className="day-group">
                <p className="day">Sabato</p>
                <p className="hours">11:00 - 14:00</p>
              </div>
              <div className="day-group">
                <p className="day">Domenica</p>
                <p className="hours">Chiuso</p>
              </div>
            </div>
            <div className="support-note">
              <FontAwesomeIcon icon={faUserClock} className="fa-icon" />
              <p>
                Risponderemo alle nuove richieste entro le successive 24 ore
                lavorative.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="cta-section">
        <h3>Hai bisogno di assistenza immediata?</h3>
        <button className="contact-button" onClick={handleStartChat}>
          Inizia Chat
        </button>
      </div>

      <SupportChat ref={supportChatRef} />
    </div>
  );
};

// Componente interno che usa useLocation
const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#price-section") {
      setTimeout(() => {
        const priceSection = document.getElementById("price-section");
        if (priceSection) {
          priceSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  return (
    <div className="app">
      <Navbar />
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/progetti" element={<ServicesSection />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services/:serviceType" element={<ServiceDetail />} />
      </Routes>
      <Footer />
      <SupportChat key={Date.now()} />
    </div>
  );
};

// Componente App principale
const App = () => {
  return (
    <Router>
      <CustomCursor />
      <AppContent />
    </Router>
  );
};

export default App;
