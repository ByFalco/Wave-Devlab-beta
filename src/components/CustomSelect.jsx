import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "../styles/CustomSelect.css";

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (selectRef.current) {
        const rect = selectRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    updatePosition();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  const renderOptions = () => {
    return ReactDOM.createPortal(
      <ul
        ref={optionsRef}
        className="select-options"
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          zIndex: 9999,
        }}
      >
        {options.map((option) => (
          <li
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={value === option.value ? "selected" : ""}
          >
            {option.label}
          </li>
        ))}
      </ul>,
      document.body
    );
  };

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="select-header" onClick={handleToggle}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`select-arrow ${isOpen ? "open" : ""}`}
        />
      </div>
      {isOpen && renderOptions()}
    </div>
  );
};

export default CustomSelect;
