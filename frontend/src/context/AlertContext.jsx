import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext(null);

// Custom hook
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return context;
};

export function AlertProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const showAlert = (title, message) => {
    setTitle(title);
    setMessage(message);
    setOpen(true);
  };

  const closeAlert = () => {
    setOpen(false);
    setTitle("");
    setMessage("");
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* ALERT UI */}
      {open && (
        <div style={styles.overlay} onClick={closeAlert}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.title}>{title}</h2>
            <p style={styles.message}>{message}</p>

            <button style={styles.button} onClick={closeAlert}>
              OK
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

/* Inline styles (you can move to CSS later) */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  title: {
    marginBottom: "12px",
    fontSize: "20px",
  },
  message: {
    marginBottom: "20px",
    fontSize: "16px",
    opacity: 0.9,
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};
