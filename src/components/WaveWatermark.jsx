import React, { useState, useEffect } from "react";

const WaveWatermark = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <a
      href="https://wavedev.it"
      target="_blank"
      rel="noopener noreferrer"
      className={`wave-watermark ${isVisible ? "visible" : ""}`}
    >
      <div className="wave-content">
        <img
          src="https://i.postimg.cc/Kv51b5VF/Progetto-senza-titolo-2024-09-05-T194016-729.png"
          alt="Wave Logo"
          className="wave-logo"
        />
        <span className="wave-text"> By Wave</span>
      </div>
      <div className="light-effect"></div>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap");

        .wave-watermark {
          position: fixed;
          bottom: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 21px;
          padding: 12px 24px;
          text-decoration: none;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease-out;
          box-shadow: 0 8px 32px 0 rgba(255, 215, 0, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
          overflow: hidden;
          pointer-events: auto;
          z-index: 9999; // Aggiunto per garantire che sia sopra ogni elemento
          backdrop-filter: none; // Rimosso l'effetto sfocato
        }

        .wave-watermark.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .wave-content {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .wave-logo {
          width: 28px;
          height: 28px;
          margin-right: 12px;
        }

        .wave-text {
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .light-effect {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0) 50%
          );
          transform: rotate(45deg);
          transition: all 0.6s ease-out;
        }

        .wave-watermark:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px 0 rgba(255, 215, 0, 0.5);
        }

        .wave-watermark:hover .light-effect {
          top: -50%;
          left: -50%;
        }

        @media (max-width: 768px) {
          .wave-watermark {
            bottom: 15px;
            left: 15px;
            padding: 10px 20px;
          }

          .wave-logo {
            width: 24px;
            height: 24px;
          }

          .wave-text {
            font-size: 14px;
          }
        }
      `}</style>
    </a>
  );
};

export default WaveWatermark;
