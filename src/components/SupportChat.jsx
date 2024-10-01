import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faPaperPlane,
  faTimes,
  faChevronUp,
  faChevronDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
import "../styles/SupportChat.css";

const SupportChat = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [chatStatus, setChatStatus] = useState("idle");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBotOnline, setIsBotOnline] = useState(false);
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);

  useImperativeHandle(ref, () => ({
    openChat: () => setIsOpen(true),
  }));

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SERVER_URL);

      socketRef.current.on("chatPending", ({ chatId }) => {
        console.log("Chat in attesa di approvazione:", chatId);
        setChatStatus("pending");
        setChatId(chatId);
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            message: "La tua richiesta di chat è in attesa di approvazione...",
          },
        ]);
      });

      socketRef.current.on("chatAccepted", ({ chatId, message }) => {
        console.log("Chat accettata:", chatId);
        setChatStatus("active");
        setChatStarted(true);
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            message:
              "La tua chat è stata accettata. Un operatore sarà con te a breve.",
          },
        ]);
      });

      socketRef.current.on("chatRejected", ({ message }) => {
        console.log("Chat rifiutata");
        setChatStatus("rejected");
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            message:
              "Ci dispiace, la tua richiesta di chat è stata rifiutata. Riprova più tardi.",
          },
        ]);
        setTimeout(() => {
          setChatStatus("idle");
          setChatId(null);
          setMessages([]);
          setChatStarted(false);
        }, 5000);
      });

      socketRef.current.on("chatExpired", () => {
        console.log("La richiesta di chat è scaduta");
        setChatStatus("expired");
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            message:
              "La tua richiesta di chat è scaduta. Per favore, invia una nuova richiesta.",
          },
        ]);
        setTimeout(() => {
          setChatStatus("idle");
          setChatId(null);
          setMessages([]);
          setChatStarted(false);
        }, 5000);
      });

      socketRef.current.on("newMessage", ({ sender, message }) => {
        console.log("Nuovo messaggio ricevuto nel client:", {
          sender,
          message,
        });
        setMessages((prevMessages) => [...prevMessages, { sender, message }]);
        if (sender === "agent" && !isOpen && !isMinimized) {
          setUnreadMessages((prev) => prev + 1);
        }
      });

      socketRef.current.on("botStatus", ({ isOnline }) => {
        setIsBotOnline(isOnline);
      });

      socketRef.current.on("chatClosed", ({ message }) => {
        setMessages((prev) => [...prev, { sender: "system", message }]);
        setChatStatus("closed");
        setTimeout(() => {
          setChatStatus("idle");
          setChatId(null);
          setMessages([]);
          setChatStarted(false);
        }, 5000);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off("chatPending");
          socketRef.current.off("chatAccepted");
          socketRef.current.off("chatRejected");
          socketRef.current.off("chatExpired");
          socketRef.current.off("newMessage");
          socketRef.current.off("botStatus");
          socketRef.current.off("chatClosed");
          socketRef.current.disconnect();
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatId && socketRef.current) {
      socketRef.current.emit("joinChat", { chatId });
      console.log("Client si è unito alla chat:", chatId);
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = (e) => {
    e.preventDefault();
    const userAgent = navigator.userAgent;
    socketRef.current.emit("requestChat", {
      clientId,
      name,
      email,
      description,
      userAgent,
    });
    setChatStarted(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && chatId) {
      const newMessage = { sender: "user", message: message.trim() };
      socketRef.current.emit("sendMessage", { chatId, ...newMessage });
      // Rimuovi questa riga per evitare la duplicazione
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const toggleChatSize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setUnreadMessages(0);
    }
  };

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const italyTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Rome" })
      );
      const day = italyTime.getDay();
      const hours = italyTime.getHours();
      const minutes = italyTime.getMinutes();
      const currentTime = hours * 60 + minutes;

      if (day >= 1 && day <= 5) {
        // Dal lunedì al venerdì
        setIsBotOnline(currentTime >= 12 * 60 && currentTime < 18 * 60);
      } else if (day === 6) {
        // Sabato
        setIsBotOnline(currentTime >= 11 * 60 && currentTime < 14 * 60);
      } else {
        // Domenica
        setIsBotOnline(false);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Controlla ogni minuto

    return () => clearInterval(interval);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadMessages(0);
    // Dispatch dell'evento personalizzato per chiudere il modal
    window.dispatchEvent(new Event("closeModal"));
  };

  // Aggiungi questo useEffect per gestire la classe 'chat-open' sul body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("chat-open");
    } else {
      document.body.classList.remove("chat-open");
    }

    // Cleanup nel caso il componente venga smontato mentre è aperto
    return () => {
      document.body.classList.remove("chat-open");
    };
  }, [isOpen]);

  return (
    <>
      <motion.button
        className="support-chat-toggle"
        onClick={handleOpenChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faComments} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`support-chat-container ${
              isMinimized ? "minimized" : ""
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="support-chat-header">
              <h3>
                Supporto Wave
                <span
                  className={`status-bot ${isBotOnline ? "online" : "offline"}`}
                ></span>
                {unreadMessages > 0 && (
                  <span className="notification-icon">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="notification-count">{unreadMessages}</span>
                  </span>
                )}
              </h3>
              <div>
                <button className="chat-resize" onClick={toggleChatSize}>
                  <FontAwesomeIcon
                    icon={isMinimized ? faChevronUp : faChevronDown}
                  />
                </button>
                <button onClick={() => setIsOpen(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            <div className="support-chat-body">
              {isBotOnline ? (
                !chatStarted ? (
                  <form onSubmit={handleStartChat} className="start-chat-form">
                    <input
                      type="text"
                      placeholder="ID Cliente (opzionale)"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Indirizzo Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Come possiamo aiutarti?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit">Inizia Chat</button>
                  </form>
                ) : (
                  <>
                    <div className="chat-messages">
                      {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                          <strong>
                            {msg.sender === "user"
                              ? "Tu"
                              : msg.sender === "agent"
                              ? "Agente"
                              : "Sistema"}
                            :
                          </strong>{" "}
                          {msg.message}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    {chatStatus === "active" && (
                      <form
                        onSubmit={handleSendMessage}
                        className="chat-input-form"
                      >
                        <div className="input-with-button">
                          <input
                            type="text"
                            placeholder="Scrivi un messaggio..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button type="submit">
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )
              ) : (
                <div className="offline-message">
                  <h4>Supporto non disponibile</h4>
                  <p>
                    Il nostro team di assistenza è al momento offline. Saremo
                    lieti di assistervi durante i nostri orari lavorativi.
                  </p>
                  <div className="working-hours">
                    <h5>Orari di supporto</h5>
                    <ul>
                      <li>
                        <span>Lun - Ven</span> <span>12:00 - 18:00</span>
                      </li>
                      <li>
                        <span>Sabato</span> <span>11:00 - 14:00</span>
                      </li>
                      <li>
                        <span>Domenica</span> <span>Chiuso</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default SupportChat;
