import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronUp,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ isOpen, onClose, onInteraction, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleInteraction = () => {
    onInteraction();
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <div
      className={`modal-popup ${isOpen ? "open" : ""} ${
        isClosing ? "closing" : ""
      }`}
      onMouseMove={handleInteraction}
      onMouseDown={handleInteraction}
      onKeyDown={handleInteraction}
      tabIndex="0"
    >
      <div className="modal-header">
        <div className="modal-title" onClick={handleToggle}>
          <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
          <span>Cos'è il Watermark Wave?</span>
        </div>
        <div className="modal-controls">
          <button className="close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <button className="toggle-button" onClick={handleToggle}>
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </button>
        </div>
      </div>
      <div className={`modal-body ${isExpanded ? "expanded" : ""}`}>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
