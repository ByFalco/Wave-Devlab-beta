import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "./bgCard.json";

const VideoSection = () => {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      // Ottimizza le prestazioni dell'animazione Lottie
      lottieRef.current.setSpeed(0.5); // Rallenta l'animazione per migliorare le prestazioni
    }
  }, []);

  return (
    <section className="video-section">
      <div className="lottie-container">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
          className="lottie-animation"
        />
      </div>
      <div className="overlay-top"></div>
      <div className="overlay-bottom"></div>
    </section>
  );
};

export default VideoSection;
