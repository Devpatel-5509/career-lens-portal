import React from "react";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
        color: "#fff",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        Explore Career Options 🚀
      </h1>

      <p style={{ maxWidth: "600px", opacity: 0.9 }}>
        This is the Explore page. From here you can browse jobs, career paths,
        AI insights, and more.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "12px 22px",
          borderRadius: "10px",
          border: "none",
          fontWeight: "700",
          cursor: "pointer",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
        }}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default Explore;
