import React, { useEffect } from "react";

export default function CenterModal({ open, title, message, onClose }) {
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <button style={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#161b33",
    padding: "28px",
    borderRadius: "18px",
    width: "90%",
    maxWidth: "420px",
    color: "#fff",
    textAlign: "center",
    animation: "scaleIn 0.25s ease",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "10px",
  },
  message: {
    color: "#cbd5e1",
    marginBottom: "20px",
    whiteSpace: "pre-wrap",
  },
  button: {
    padding: "10px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },
};
