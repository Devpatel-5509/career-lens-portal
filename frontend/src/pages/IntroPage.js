import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, Brain, Zap, Rocket, ChevronRight, TrendingUp, Users, Award } from "lucide-react";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05070a",
        color: "#ffffff",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(109, 93, 252, 0.15) 0%, transparent 50%)',
        animation: 'float1 20s ease-in-out infinite'
      }}></div>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        animation: 'float2 25s ease-in-out infinite'
      }}></div>
      
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(20px, 20px) rotate(5deg); }
            66% { transform: translate(-15px, 10px) rotate(-5deg); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-20px, -10px) rotate(-5deg); }
            66% { transform: translate(15px, 15px) rotate(5deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(109, 93, 252, 0.5)); }
            50% { filter: drop-shadow(0 0 20px rgba(109, 93, 252, 0.8)); }
          }
        `}
      </style>

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 10
        }}
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 30px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #6d5dfc 0%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 50px rgba(109, 93, 252, 0.4)",
            animation: "pulse 3s ease-in-out infinite",
            position: "relative"
          }}
        >
          <Sparkles size={48} color="#fff" />
          <div style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "36px",
            height: "36px",
            background: "#eab308",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "glow 2s ease-in-out infinite"
          }}>
            <Brain size={20} color="#000" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontSize: "4rem",
            fontWeight: "900",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-1px"
          }}
        >
          Career Lens
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontSize: "1.3rem",
            color: "#94a3b8",
            maxWidth: "720px",
            margin: "0 auto 50px",
            lineHeight: "1.7",
            fontWeight: "500"
          }}
        >
          Your intelligent AI companion that helps you explore, 
          understand, and shape your future career with clarity and confidence.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() => navigate("/login")}
          style={{
            padding: "18px 48px",
            fontSize: "1.1rem",
            fontWeight: "800",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #6d5dfc 0%, #ec4899 100%)",
            color: "#ffffff",
            boxShadow: "0 15px 40px rgba(109, 93, 252, 0.4)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden"
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 50px rgba(109, 93, 252, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          Get Started
          <ChevronRight size={20} />
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #ec4899 0%, #6d5dfc 100%)",
              transition: "left 0.5s ease"
            }}
          />
        </motion.button>
      </motion.div>

      {/* FEATURES GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          maxWidth: "1200px",
          margin: "100px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          position: "relative",
          zIndex: 10
        }}
      >
        {[
          {
            icon: <Target size={32} />,
            title: "🎯 Career Clarity",
            text: "We help you understand your strengths, interests, and opportunities so you can make informed career decisions.",
            color: "#6d5dfc",
            bgColor: "rgba(109, 93, 252, 0.1)"
          },
          {
            icon: <TrendingUp size={32} />,
            title: "📈 Smart Growth",
            text: "Career Lens is designed to grow with you — from student life to professional success with personalized roadmaps.",
            color: "#10b981",
            bgColor: "rgba(16, 185, 129, 0.1)"
          },
          {
            icon: <Brain size={32} />,
            title: "🧠 AI-Powered Insights",
            text: "Our platform is built with AI logic, data analytics, and real-world career insights to guide you at every step.",
            color: "#ec4899",
            bgColor: "rgba(236, 72, 153, 0.1)"
          },
          {
            icon: <Rocket size={32} />,
            title: "🚀 Accelerated Learning",
            text: "Access personalized course recommendations and skill development paths to fast-track your career growth.",
            color: "#eab308",
            bgColor: "rgba(234, 179, 8, 0.1)"
          },
          {
            icon: <Users size={32} />,
            title: "🤝 Community Network",
            text: "Connect with mentors, industry experts, and peers who share your career aspirations and goals.",
            color: "#8b5cf6",
            bgColor: "rgba(139, 92, 246, 0.1)"
          },
          {
            icon: <Award size={32} />,
            title: "🏆 Career Recognition",
            text: "Get certified for your skills and achievements with credentials that matter to employers worldwide.",
            color: "#3b82f6",
            bgColor: "rgba(59, 130, 246, 0.1)"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            whileHover={{ 
              y: -10,
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)"
            }}
            style={{
              background: "rgba(22, 27, 51, 0.6)",
              backdropFilter: "blur(10px)",
              padding: "36px 30px",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              textAlign: "center",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{
              width: "64px",
              height: "64px",
              background: item.bgColor,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: `1px solid ${item.color}33`
            }}>
              <div style={{ color: item.color }}>
                {item.icon}
              </div>
            </div>
            
            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                marginBottom: "16px",
                color: "#fff"
              }}
            >
              {item.title}
            </h3>
            <p style={{ 
              lineHeight: "1.6", 
              color: "#94a3b8",
              fontSize: "1rem"
            }}>
              {item.text}
            </p>
            
            {/* Decorative Corner */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40px",
              height: "40px",
              borderTop: `2px solid ${item.color}`,
              borderRight: `2px solid ${item.color}`,
              borderTopRightRadius: "24px"
            }}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* VISION SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          maxWidth: "900px",
          margin: "120px auto 0",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
          background: "rgba(22, 27, 51, 0.4)",
          padding: "50px 40px",
          borderRadius: "24px",
          border: "1px solid rgba(109, 93, 252, 0.2)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 20px",
          background: "rgba(109, 93, 252, 0.1)",
          border: "1px solid rgba(109, 93, 252, 0.2)",
          borderRadius: "100px",
          marginBottom: "30px"
        }}>
          <Zap size={20} color="#a78bfa" />
          <span style={{ 
            color: "#a78bfa", 
            fontWeight: "700",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            Our Vision
          </span>
        </div>

        <h2
          style={{
            fontSize: "2.8rem",
            fontWeight: "900",
            marginBottom: "24px",
            background: "linear-gradient(135deg, #fff 30%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Building Career Clarity
        </h2>

        <p
          style={{
            fontSize: "1.2rem",
            color: "#cbd5e1",
            lineHeight: "1.8",
            maxWidth: "700px",
            margin: "0 auto"
          }}
        >
          Career Lens exists to remove confusion from career decisions.
          We believe every individual deserves a clear direction, confidence in
          their choices, and access to the right guidance at the right time.
        </p>
      </motion.div>

      {/* CALL TO ACTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          maxWidth: "900px",
          margin: "80px auto 0",
          textAlign: "center",
          position: "relative",
          zIndex: 10
        }}
      >
        <div style={{
          background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
          borderRadius: "24px",
          padding: "50px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          boxShadow: "0 20px 50px rgba(109, 93, 252, 0.4)"
        }}>
          <h3 style={{
            fontSize: "2.2rem",
            fontWeight: "900",
            color: "#fff",
            margin: 0
          }}>
            Ready to Transform Your Career?
          </h3>
          <p style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            margin: 0
          }}>
            Join thousands who've found their path with Career Lens AI.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "16px 40px",
              fontSize: "1rem",
              fontWeight: "800",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              background: "#ffffff",
              color: "#6d5dfc",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <Rocket size={20} />
            Start Your Journey Today
          </button>
        </div>
      </motion.div>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{
          marginTop: "100px",
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.9rem",
          padding: "30px 0",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 10
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}>
          {["Home", "About", "Features", "Contact", "Privacy", "Terms"].map((item, index) => (
            <a 
              key={index}
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                transition: "color 0.3s ease",
                fontWeight: "500"
              }}
              onMouseOver={(e) => e.target.style.color = "#fff"}
              onMouseOut={(e) => e.target.style.color = "#94a3b8"}
            >
              {item}
            </a>
          ))}
        </div>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Career Lens · Designed for the future career seekers
        </p>
        <p style={{ margin: "10px 0 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
          An AI-powered career guidance platform
        </p>
      </motion.div>
    </div>
  );
};

export default IntroPage;