import React from "react";
import Lottie from "lottie-react";
import { Link as ScrollLink } from "react-scroll";
import scrollDownAnimation from "./scrolldown.json"; // Assicurati di avere il percorso corretto

const ScrollDownAnimation = () => {
  return (
    <ScrollLink
      to="why-us-section"
      smooth={true}
      duration={600}
      className="scroll-down-animation"
    >
      <Lottie
        animationData={scrollDownAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 50, height: 250 }} // Modifica le dimensioni come preferisci
      />
    </ScrollLink>
  );
};

export default ScrollDownAnimation;
