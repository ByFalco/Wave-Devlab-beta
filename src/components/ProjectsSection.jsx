import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../styles/ProjectsSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import lineLeftProjects from "../assets/line-left.svg";
import lineProjects from "../assets/line.svg";
import chipLeftProjects from "../assets/chip.svg";
import exampleImage from "../assets/example.png";
import example5Image from "../assets/example5.png";

const ProjectsSection = () => {
  const [isVariantA, setIsVariantA] = useState(true);
  const navigate = useNavigate(); // Inizializza useNavigate

  useEffect(() => {
    const showVariantA = Math.random() < 0.5;
    setIsVariantA(showVariantA);
  }, []);

  const projects = [
    { id: 1, image: exampleImage },
    { id: 2, image: exampleImage },
    { id: 3, image: example5Image },
    { id: 4, image: example5Image },
    { id: 5, image: exampleImage },
    { id: 6, image: example5Image },
    { id: 7, image: exampleImage },
    { id: 8, image: example5Image },
    { id: 9, image: exampleImage },
    { id: 10, image: example5Image },
    { id: 11, image: example5Image },
    { id: 12, image: exampleImage },
    { id: 13, image: exampleImage },
    { id: 14, image: example5Image },
    { id: 15, image: exampleImage },
    { id: 16, image: example5Image },
    // Aggiungi più progetti secondo necessità
  ];

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  // Funzione di navigazione per le categorie
  const navigateToCategory = (category) => {
    navigate(`/services/${category}`);
  };

  // Funzione di navigazione per "Scopri i nostri esempi"
  const navigateToProgetti = () => {
    navigate("/progetti");
  };

  return (
    <motion.section
      className="projects-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="projects-content">
        <div className="top-right-shadow"></div>
        <div className="bottom-right-shadow"></div>
        <div className="bottom-left-shadow"></div>
        <div className="bottom-shadow"></div>
        <motion.img
          src={lineLeftProjects}
          alt="Line Left projects"
          className="line-left-projects"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.img
          src={chipLeftProjects}
          alt="Chip Left projects"
          className="chip chip-left-projects"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.img
          src={lineProjects}
          alt="Line projects"
          className="line-projects"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.div
          className={`projects-text ${isVariantA ? "" : "variant-b"}`}
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h3
            className="projects-subtitle"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Progetti
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {isVariantA ? (
              <>
                <h2 className="projects-title">
                  Design che trasforma la tua presenza online.
                </h2>
                <p className="projects-description">
                  Distinguiti. Innovati. Domina il digitale. Esplora i nostri
                  progetti per categoria e lasciati ispirare dalle nostre
                  soluzioni su misura.
                </p>
              </>
            ) : (
              <>
                <h2 className="projects-title">
                  Web design che cattura l'essenza del tuo business.
                </h2>
                <p className="projects-description">
                  Semplice. Efficace. Indimenticabile. Scopri il nostro
                  portfolio diviso per settori e lasciati ispirare dalle nostre
                  soluzioni su misura.
                </p>
              </>
            )}
          </motion.div>
          <div className="projects-categories">
            {["retail", "ristorazione", "ecommerce"].map((category, index) => (
              <motion.div
                key={category}
                variants={buttonVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
              >
                <button
                  className="category-button"
                  onClick={() => navigateToCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </motion.div>
            ))}
          </div>
          <div className="services-button">
            <button onClick={navigateToProgetti}>
              Scopri i nostri esempi
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="icon"
              />
            </button>
          </div>
        </motion.div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`project-item project-item-${project.id}`}
            >
              <motion.img
                src={project.image}
                alt={`Project ${project.id}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
