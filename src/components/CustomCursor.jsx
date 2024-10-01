import React, { useEffect, useRef, useState } from "react";
import "../styles/CustomCursor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringMainCard, setIsHoveringMainCard] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end;
  };

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      cursorPosition.current.x = lerp(
        cursorPosition.current.x,
        mousePosition.current.x,
        0.2
      );
      cursorPosition.current.y = lerp(
        cursorPosition.current.y,
        mousePosition.current.y,
        0.2
      );

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPosition.current.x}px`;
        cursorRef.current.style.top = `${cursorPosition.current.y}px`;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseenter", onMouseEnter);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseout", onMouseOut);
      document.addEventListener("videoClosed", onVideoClosed); // Aggiunto
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("videoClosed", onVideoClosed); // Aggiunto
    };

    const onMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => {
      setIsActive(true);
    };

    const onMouseUp = () => {
      setIsActive(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseOver = (e) => {
      if (e.target.closest("a, button, .clickable")) {
        setIsHovering(true);
      }

      if (e.target.closest(".main-card")) {
        setIsHoveringMainCard(true);
      }

      if (e.target.closest(".video-wave-overlay")) {
        setIsVideoOpen(true);
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest("a, button, .clickable")) {
        setIsHovering(false);
      }

      if (e.target.closest(".main-card")) {
        setIsHoveringMainCard(false);
      }

      if (e.target.closest(".video-wave-overlay")) {
        setIsVideoOpen(false);
      }
    };

    const onVideoClosed = () => {
      setIsVideoOpen(false);
      setIsHovering(false); // Aggiunto per resettare lo stato di hover
    };

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  useEffect(() => {
    if (!isVideoOpen) {
      setIsHoveringMainCard(false);
    }
  }, [isVideoOpen]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isActive ? "active" : ""} ${
        isVisible ? "visible" : "hidden"
      } ${isHovering ? "hover-element" : ""} ${
        isHoveringMainCard ? "hover-main-card" : ""
      } ${isVideoOpen ? "video-open" : ""}`}
    >
      {isHoveringMainCard && !isVideoOpen && (
        <FontAwesomeIcon icon={faPlay} className="play-black-icon" />
      )}
    </div>
  );
};

export default CustomCursor;
