import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Assistant() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/dashboard")}
        style={styles.backBtn}
      >
        <ArrowLeft size={18} /> BACK TO DASHBOARD
      </button>
      
    

      <div style={styles.chatContainer}>
        <iframe
          src="http://localhost:3001"
          title="AI Career Assistant Chatbot"
          style={styles.iframe}
        />
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "#05070a",
    color: "#fff"
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "10px"
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "30px"
  },

  chatContainer: {
    width: "100%",
    height: "700px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none"
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "14px",
    color: "#10b981",
    fontWeight: "800",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "30px",
    transition: "all 0.3s ease",
    letterSpacing: "1px",
    textTransform: "uppercase"
  }
};