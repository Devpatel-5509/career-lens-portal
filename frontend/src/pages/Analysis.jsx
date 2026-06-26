import React, { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { 
  Sparkles, Brain, Target, Check, Award, Zap, Code, 
  Palette, Database, Shield, Gamepad2, BarChart3, 
  ArrowLeft, TrendingUp, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Analysis() {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const handleReset = () => {
    setSelectedSkills([]);
    setSelectedInterests([]);
    setExperienceLevel("");
    localStorage.removeItem("userAnalysis");
  };

  const skillCategories = {
    "Programming": [
      { name: "Python", icon: Code, color: "#3776AB" },
      { name: "JavaScript", icon: Code, color: "#F7DF1E" },
      { name: "React", icon: Code, color: "#61DAFB" },
      { name: "Java", icon: Code, color: "#007396" },
      { name: "C++", icon: Code, color: "#00599C" }
    ],
    "Tech & Data": [
      { name: "AI/ML", icon: Brain, color: "#FF6B6B" },
      { name: "SQL", icon: Database, color: "#4479A1" },
      { name: "Cloud Computing", icon: Zap, color: "#FF9900" },
      { name: "DevOps", icon: Zap, color: "#2496ED" },
      { name: "Blockchain", icon: Shield, color: "#F7931A" }
    ],
    "Design & Creative": [
      { name: "UI/UX Design", icon: Palette, color: "#FF4785" },
      { name: "Graphic Design", icon: Palette, color: "#00C4CC" },
      { name: "3D Modeling", icon: Palette, color: "#E87D0D" },
      { name: "Animation", icon: Palette, color: "#9B59B6" }
    ]
  };

  const interestOptions = [
    { name: "Software Dev", icon: Code },
    { name: "Data Science", icon: BarChart3 },
    { name: "Cybersecurity", icon: Shield },
    { name: "Fintech", icon: TrendingUp },
    { name: "Gaming", icon: Gamepad2 },
    { name: "Product Management", icon: Target },
    { name: "AI Research", icon: Brain },
    { name: "Web3", icon: Zap }
  ];

  const experienceLevels = [
    { level: "Beginner", years: "0-1 years", description: "Just starting my journey" },
    { level: "Intermediate", years: "1-3 years", description: "Building my expertise" },
    { level: "Advanced", years: "3-5 years", description: "Experienced professional" },
    { level: "Expert", years: "5+ years", description: "Industry veteran" }
  ];

  // Ensure a fresh start on component mount
  useEffect(() => {
    // We explicitly clear everything so the user starts fresh
    setSelectedSkills([]);
    setSelectedInterests([]);
    setExperienceLevel("");
    
    // We still set fetchLoading to false so the UI shows
    setFetchLoading(false);
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleItem = (item, list, setList) => {
    list.includes(item) 
      ? setList(list.filter(i => i !== item)) 
      : setList([...list, item]);
  };

  const handleStartAnalysis = async () => {
    // Validate form
    if (!selectedSkills.length) {
      setError("Please select at least one skill");
      return;
    }
    if (!selectedInterests.length) {
      setError("Please select at least one interest");
      return;
    }
    if (!experienceLevel) {
      setError("Please select your experience level");
      return;
    }

    setLoading(true);
    setError("");

    const analysisData = {
      selectedSkills,
      selectedInterests,
      experienceLevel
    };

    // Save to localStorage as backup
    localStorage.setItem("userAnalysis", JSON.stringify(analysisData));

    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
      alert("Please login to save your analysis and get personalized recommendations");
      navigate("/login", { 
        state: { 
          from: "/analysis",
          analysisData 
        }
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/analysis/save-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(analysisData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save analysis");
      }

      console.log("✅ Analysis saved successfully:", data.message);
      
      // Sync to localStorage as well
      localStorage.setItem("userAnalysis", JSON.stringify(analysisData));
      
      // Success - navigate to recommendations with immediate state
      navigate("/recommendations", { state: { analysis: analysisData } });

    } catch (error) {
      console.error("❌ Error saving analysis:", error);
      setError(error.message || "Failed to save analysis. Using local backup.");
      
      // navigate immediately with local state even on error
      navigate("/recommendations", { state: { analysis: analysisData } });
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = selectedSkills.length > 0 && selectedInterests.length > 0 && experienceLevel;

  if (fetchLoading) {
    return (
      <PageLayout>
        <div style={styles.loadingContainer}>
          <Loader2 size={48} style={styles.spinner} />
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          
          {/* Back to Dashboard Button */}
          <div style={styles.backButtonContainer}>
            <button 
              onClick={() => navigate("/dashboard")}
              style={styles.backButton}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
            <button 
              onClick={handleReset}
              style={{...styles.backButton, borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444"}}
            >
              <RefreshCw size={18} />
              Reset Selections
            </button>
          </div>

          <div style={styles.titleSection}>
            <h1 style={styles.title}>Skill & Interest Analysis</h1>
            <p style={styles.subtitle}>Let AI analyze your unique profile and craft a personalized career roadmap</p>
          </div>

          {/* Progress Indicator */}
          <div style={styles.progressBar}>
            <div style={styles.progressStep}>
              <div style={{...styles.stepCircle, ...(selectedSkills.length > 0 ? styles.stepActive : {})}}>
                <Brain size={16} />
              </div>
              <span style={styles.stepLabel}>Skills</span>
            </div>
            <div style={styles.progressLine}></div>
            <div style={styles.progressStep}>
              <div style={{...styles.stepCircle, ...(selectedInterests.length > 0 ? styles.stepActive : {})}}>
                <Target size={16} />
              </div>
              <span style={styles.stepLabel}>Interests</span>
            </div>
            <div style={styles.progressLine}></div>
            <div style={styles.progressStep}>
              <div style={{...styles.stepCircle, ...(experienceLevel ? styles.stepActive : {})}}>
                <Award size={16} />
              </div>
              <span style={styles.stepLabel}>Experience</span>
            </div>
          </div>

          {/* Stats Cards - Shows 0 by default now */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}><Brain size={24} style={{color: "#8b5cf6"}} /></div>
              <div>
                <div style={styles.statNumber}>{selectedSkills.length}</div>
                <div style={styles.statLabel}>Skills Selected</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}><Target size={24} style={{color: "#ec4899"}} /></div>
              <div>
                <div style={styles.statNumber}>{selectedInterests.length}</div>
                <div style={styles.statLabel}>Interests Chosen</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}><Sparkles size={24} style={{color: "#eab308"}} /></div>
              <div>
                <div style={styles.statNumber}>{isFormComplete ? "100%" : "0%"}</div>
                <div style={styles.statLabel}>Profile Complete</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorContainer}>
              <AlertCircle size={20} color="#ef4444" />
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {/* SKILLS SECTION - All unselected by default */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleWrapper}>
                <div style={styles.iconWrapper}><Brain size={24} /></div>
                <div>
                  <h3 style={styles.sectionTitleText}>Your Technical Skills</h3>
                  <p style={styles.sectionSubtitleText}>Select all the skills you're proficient in</p>
                </div>
              </div>
            </div>

            {Object.entries(skillCategories).map(([category, skills]) => (
              <div key={category} style={styles.categorySection}>
                <h4 style={styles.categoryTitle}>{category}</h4>
                <div style={styles.grid}>
                  {skills.map(skill => {
                    const Icon = skill.icon;
                    const isSelected = selectedSkills.includes(skill.name);
                    return (
                      <button
                        key={skill.name}
                        onClick={() => toggleItem(skill.name, selectedSkills, setSelectedSkills)}
                        style={{...styles.skillPill, ...(isSelected ? styles.selectedPill : {})}}
                      >
                        <Icon size={18} style={{color: isSelected ? "#fff" : skill.color}} />
                        {skill.name}
                        {isSelected && <Check size={16} style={{marginLeft: "auto"}} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* INTERESTS SECTION - All unselected by default */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleWrapper}>
                <div style={{...styles.iconWrapper, background: "linear-gradient(135deg, #db2777, #f472b6)"}}><Target size={24} /></div>
                <div>
                  <h3 style={styles.sectionTitleText}>Career Interests</h3>
                  <p style={styles.sectionSubtitleText}>What fields excite you the most?</p>
                </div>
              </div>
            </div>
            <div style={styles.interestGrid}>
              {interestOptions.map(interest => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.name);
                return (
                  <button
                    key={interest.name}
                    onClick={() => toggleItem(interest.name, selectedInterests, setSelectedInterests)}
                    style={{...styles.interestCard, ...(isSelected ? styles.selectedInterestCard : {})}}
                  >
                    <div style={styles.interestIconWrapper}><Icon size={32} /></div>
                    <div style={styles.interestName}>{interest.name}</div>
                    {isSelected && <div style={styles.checkBadge}><Check size={14} /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXPERIENCE LEVEL SECTION - None selected by default */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleWrapper}>
                <div style={{...styles.iconWrapper, background: "linear-gradient(135deg, #eab308, #f59e0b)"}}><Award size={24} /></div>
                <div>
                  <h3 style={styles.sectionTitleText}>Experience Level</h3>
                  <p style={styles.sectionSubtitleText}>How would you describe your current expertise?</p>
                </div>
              </div>
            </div>
            <div style={styles.experienceGrid}>
              {experienceLevels.map(exp => {
                const isSelected = experienceLevel === exp.level;
                return (
                  <button
                    key={exp.level}
                    onClick={() => setExperienceLevel(exp.level)}
                    style={{...styles.experienceCard, ...(isSelected ? styles.selectedExperienceCard : {})}}
                  >
                    <div style={styles.experienceLevel}>{exp.level}</div>
                    <div style={styles.experienceYears}>{exp.years}</div>
                    <div style={styles.experienceDesc}>{exp.description}</div>
                    {isSelected && <div style={styles.experienceCheck}><Check size={20} /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.actionSection}>
            <button 
              onClick={handleStartAnalysis}
              disabled={!isFormComplete || loading}
              style={{
                ...styles.analyzeBtn, 
                opacity: isFormComplete && !loading ? 1 : 0.5, 
                cursor: isFormComplete && !loading ? "pointer" : "not-allowed"
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} style={styles.spinner} />
                  Saving Analysis...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Generate My Career Path
                </>
              )}
            </button>
            <p style={styles.helperText}>
              {!selectedSkills.length && "Select at least one skill • "}
              {!selectedInterests.length && "Select at least one interest • "}
              {!experienceLevel && "Select your experience level"}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const styles = {
  pageWrapper: {
    background: "#05070a",
    minHeight: "100vh",
    width: "100%",
    padding: "60px 0",
    marginTop: "-20px"
  },
  container: { 
    maxWidth: "1000px", 
    margin: "0 auto", 
    padding: "0 20px",
    position: "relative"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#fff"
  },
  loadingText: {
    fontSize: "18px",
    color: "#fff",
    marginTop: "20px"
  },
  spinner: {
    animation: "spin 1s linear infinite"
  },
  backButtonContainer: {
    position: "absolute",
    top: "10px",
    left: "-180px", // Increased to accommodate two buttons
    zIndex: 10,
    display: "flex",
    gap: "12px"
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    background: "rgba(22, 27, 51, 0.8)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    textDecoration: "none"
  },
  titleSection: { textAlign: "center", marginBottom: "40px" },
  title: { 
    fontSize: "36px", 
    fontWeight: "800", 
    color: "#fff", 
    marginBottom: "10px",
    background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: { fontSize: "16px", color: "#94a3b8" },
  progressBar: {
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: "40px",
    padding: "24px", 
    background: "#161b33", 
    borderRadius: "20px", 
    border: "1px solid rgba(109, 93, 252, 0.2)"
  },
  progressStep: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  stepCircle: {
    width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0d1124", border: "2px solid rgba(255,255,255,0.1)", color: "#666"
  },
  stepActive: {
    background: "linear-gradient(135deg, #6d5dfc, #764ba2)", 
    borderColor: "#6d5dfc", 
    color: "#fff", 
    boxShadow: "0 0 15px rgba(109,93,252,0.4)"
  },
  stepLabel: { fontSize: "12px", color: "#94a3b8", fontWeight: "600" },
  progressLine: { 
    width: "80px", 
    height: "2px", 
    background: "rgba(255,255,255,0.1)", 
    margin: "0 16px", 
    marginBottom: "24px" 
  },
  statsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
    gap: "16px", 
    marginBottom: "40px" 
  },
  statCard: {
    padding: "24px", 
    background: "#161b33", 
    borderRadius: "20px", 
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex", 
    alignItems: "center", 
    gap: "16px", 
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
  },
  statIcon: { 
    width: "48px", 
    height: "48px", 
    borderRadius: "12px", 
    background: "rgba(255,255,255,0.05)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  statNumber: { fontSize: "28px", fontWeight: "900", color: "#fff" },
  statLabel: { fontSize: "13px", color: "#94a3b8" },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 20px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    marginBottom: "24px"
  },
  errorText: {
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "600"
  },
  section: { 
    marginBottom: "48px", 
    background: "rgba(22, 27, 51, 0.4)", 
    padding: "32px", 
    borderRadius: "24px",
    border: "1px solid rgba(109, 93, 252, 0.1)", 
    backdropFilter: "blur(10px)"
  },
  sectionHeader: { marginBottom: "24px" },
  sectionTitleWrapper: { display: "flex", alignItems: "center", gap: "16px" },
  iconWrapper: {
    width: "56px", height: "56px", borderRadius: "16px", 
    background: "linear-gradient(135deg, #6d5dfc, #764ba2)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
  },
  sectionTitleText: { fontSize: "24px", fontWeight: "800", color: "#fff", margin: 0 },
  sectionSubtitleText: { fontSize: "14px", color: "#94a3b8", margin: "4px 0 0 0" },
  categorySection: { marginBottom: "24px" },
  categoryTitle: { 
    fontSize: "14px", 
    color: "#6d5dfc", 
    marginBottom: "12px", 
    fontWeight: "700", 
    textTransform: "uppercase", 
    letterSpacing: "1px" 
  },
  grid: { display: "flex", flexWrap: "wrap", gap: "12px" },
  skillPill: {
    padding: "12px 20px", 
    borderRadius: "14px", 
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#0d1124", 
    color: "#94a3b8", 
    cursor: "pointer", 
    transition: "all 0.3s ease",
    display: "flex", 
    alignItems: "center", 
    gap: "10px", 
    fontSize: "14px", 
    fontWeight: "600"
  },
  selectedPill: { 
    background: "linear-gradient(135deg, #6d5dfc, #4a3aff)", 
    color: "#fff", 
    borderColor: "#6d5dfc", 
    boxShadow: "0 4px 15px rgba(109,93,252,0.4)" 
  },
  interestGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", 
    gap: "16px" 
  },
  interestCard: {
    padding: "24px", 
    borderRadius: "20px", 
    border: "1px solid rgba(255,255,255,0.08)", 
    background: "#0d1124",
    cursor: "pointer", 
    transition: "all 0.3s ease", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "12px", 
    position: "relative"
  },
  selectedInterestCard: { 
    background: "rgba(236, 72, 153, 0.1)", 
    borderColor: "#ec4899", 
    boxShadow: "0 0 20px rgba(236,72,153,0.2)" 
  },
  interestIconWrapper: {
    width: "64px", 
    height: "64px", 
    borderRadius: "16px", 
    background: "rgba(255,255,255,0.03)",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    color: "#fff"
  },
  interestName: { fontSize: "15px", fontWeight: "700", color: "#fff" },
  checkBadge: {
    position: "absolute", 
    top: "12px", 
    right: "12px", 
    width: "24px", 
    height: "24px", 
    borderRadius: "50%",
    background: "#ec4899", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    color: "#fff"
  },
  experienceGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
    gap: "16px" 
  },
  experienceCard: {
    padding: "24px", 
    borderRadius: "20px", 
    border: "1px solid rgba(255,255,255,0.08)", 
    background: "#0d1124",
    cursor: "pointer", 
    transition: "all 0.3s ease", 
    position: "relative"
  },
  selectedExperienceCard: { 
    background: "rgba(234, 179, 8, 0.1)", 
    borderColor: "#eab308", 
    boxShadow: "0 0 20px rgba(234,179,8,0.2)" 
  },
  experienceLevel: { fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "4px" },
  experienceYears: { fontSize: "14px", color: "#eab308", marginBottom: "8px", fontWeight: "700" },
  experienceDesc: { fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" },
  experienceCheck: {
    position: "absolute", 
    top: "20px", 
    right: "20px", 
    width: "32px", 
    height: "32px", 
    borderRadius: "50%",
    background: "#eab308", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    color: "#000"
  },
  actionSection: { 
    marginTop: "48px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "12px" 
  },
  analyzeBtn: {
    padding: "20px 60px", 
    borderRadius: "16px", 
    border: "none", 
    background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
    color: "#fff", 
    fontWeight: "800", 
    fontSize: "18px", 
    display: "flex", 
    alignItems: "center", 
    gap: "12px",
    transition: "all 0.3s ease", 
    boxShadow: "0 10px 30px rgba(109,93,252,0.4)"
  },
  helperText: {
    color: "#94a3b8",
    fontSize: "13px",
    marginTop: "8px"
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}