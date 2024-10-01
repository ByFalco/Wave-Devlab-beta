import React, { useEffect, useRef } from "react";

const GoldenGlowEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const container = containerRef.current;

      if (container) {
        const effects = container.querySelectorAll(".golden-glow-effect");
        const line = container.querySelector(".golden-glow-line");
        const overlay = container.querySelector(".golden-glow-overlay");

        const opacity = Math.max(0, 1 - scrollPosition / windowHeight);

        effects.forEach((effect, index) => {
          effect.style.opacity = opacity;
          effect.style.transform = `translateY(${
            scrollPosition * (0.1 * (index + 1))
          }px)`;
        });

        line.style.opacity = Math.min(1, opacity + 0.2);
        overlay.style.opacity = Math.max(0, opacity - 0.3);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="golden-glow-container">
      <div className="golden-glow-line"></div>
      <div className="golden-glow-effect golden-glow-effect-1"></div>
      <div className="golden-glow-effect golden-glow-effect-2"></div>
      <div className="golden-glow-effect golden-glow-effect-3"></div>
      <div className="golden-glow-overlay"></div>
    </div>
  );
};

export default GoldenGlowEffect;
