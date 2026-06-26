import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobFinder() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Initial UI state setup, matching HTML behavior
    setJobs([]);
  }, []);

  const searchJobs = async (roleInput = role, locationInput = location, page = 1) => {
    // Reset or append logic based on page
    if (page === 1) {
      setJobs([]);
      setCurrentPage(1);
      setHasSearched(true);
      setHasMore(true);
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5001/jobs?role=${encodeURIComponent(roleInput)}&location=${encodeURIComponent(locationInput)}&page=${page}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await res.json();
      const newJobs = data.jobs || [];

      if (page === 1) {
        setJobs(newJobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
      }

      if (newJobs.length === 0) {
        setHasMore(false);
      }

    } catch (err) {
      console.error("Error loading jobs", err);
      setError("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (quickRole) => {
    setRole(quickRole);
    searchJobs(quickRole, location, 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchJobs(role, location, 1);
    }
  };

  const loadMoreJobs = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchJobs(role, location, nextPage);
  };

  return (
    <div style={styles.body}>
      <div style={styles.bgGradient} />
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />
      <div style={{ ...styles.blob, ...styles.blob3 }} />
      <div style={styles.gridPattern} />
      
      <div style={styles.containerWrapper}>
        <button 
          onClick={() => navigate("/dashboard")} 
          style={styles.backBtn}
        >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Career Lens Job Finder</h1>
            <p style={styles.headerSubtitle}>Discover live jobs based on your skills and career interests</p>
          </div>

          <div style={styles.trending}>
            <span style={styles.trendingSpan} onClick={() => quickSearch('AI Engineer')}>AI Engineer</span>
            <span style={styles.trendingSpan} onClick={() => quickSearch('Data Scientist')}>Data Scientist</span>
            <span style={styles.trendingSpan} onClick={() => quickSearch('Cyber Security Analyst')}>Cyber Security</span>
            <span style={styles.trendingSpan} onClick={() => quickSearch('Cloud Engineer')}>Cloud Engineer</span>
            <span style={styles.trendingSpan} onClick={() => quickSearch('Web Developer')}>Web Developer</span>
          </div>

          <div style={styles.searchSection}>
            <input 
              style={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyPress={handleKeyPress}
              list="career-list" 
              placeholder="Career" 
            />
            <datalist id="career-list">
                <option value="Data Scientist" />
                <option value="AI Engineer" />
                <option value="Machine Learning Engineer" />
                <option value="Software Developer" />
                <option value="Cyber Security Analyst" />
                <option value="Cloud Engineer" />
                <option value="Web Developer" />
                <option value="Data Analyst" />
            </datalist>

            <input 
              style={styles.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              list="country-list" 
              placeholder="Country" 
            />
            <datalist id="country-list">
                <option value="India" />
                <option value="USA" />
                <option value="Canada" />
                <option value="UK" />
                <option value="Singapore" />
            </datalist>

            <button style={styles.searchButton} onClick={() => searchJobs(role, location, 1)}>
              Search Jobs
            </button>
          </div>

          {hasSearched && !loading && !error && (
            <div style={styles.jobsCount}>
              {jobs.length} jobs found
            </div>
          )}

          <div style={styles.jobsContainer}>
            {!hasSearched && !loading && (
              <div style={styles.exploreMessage}>
                Explore jobs here 🔍
              </div>
            )}

            {jobs.map((job, idx) => {
              const title = job.job_title || "Job Title";
              const company = job.employer_name || "Company";
              const city = job.job_city || "";
              const country = job.job_country || "";
              const apply = job.job_apply_link || "#";
              const type = (job.job_employment_type || "FULL_TIME").replace("_", " ");

              return (
                <div key={idx} style={styles.jobCard}>
                  <div style={styles.jobTitle}>{title}</div>
                  <div style={styles.company}>{company}</div>
                  <div style={styles.locationInfo}>📍 {city} {country}</div>
                  <div style={styles.tag}>{type}</div>
                  <a style={styles.applyBtn} href={apply} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </div>
              );
            })}

            {loading && (
              <p style={styles.loading}>Loading jobs...</p>
            )}

            {error && (
              <p style={styles.loading}>{error}</p>
            )}

            {hasSearched && jobs.length > 0 && hasMore && !loading && (
              <div style={styles.exploreMoreWrapper}>
                <button style={styles.exploreMoreBtn} onClick={loadMoreJobs}>
                  Explore More Jobs
                </button>
              </div>
            )}
            
            {hasSearched && !hasMore && jobs.length > 0 && !loading && (
              <div style={styles.exploreMoreWrapper}>
                <button style={{...styles.exploreMoreBtn, opacity: 0.6, cursor: 'not-allowed'}} disabled>
                  No More Jobs
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "Inter, Arial, sans-serif",
    background: "#05070a",
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    overflowX: "hidden",
  },
  bgGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.15), transparent 50%)",
    zIndex: 0,
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)",
    backgroundSize: "50px 50px",
    zIndex: 1,
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.3,
    zIndex: 1,
  },
  blob1: {
    width: "500px",
    height: "500px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    top: "-150px",
    left: "-150px",
  },
  blob2: {
    width: "400px",
    height: "400px",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    bottom: "-100px",
    right: "-100px",
  },
  blob3: {
    width: "350px",
    height: "350px",
    background: "linear-gradient(135deg, #ec4899, #f43f5e)",
    top: "40%",
    right: "10%",
  },
  containerWrapper: {
    paddingTop: "20px",
    position: "relative",
    zIndex: 1
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s",
    position: "absolute",
    left: "20px",
    top: "20px",
    zIndex: 10
  },
  header: {
    textAlign: "center",
    padding: "40px 20px",
    marginTop: "40px"
  },
  headerTitle: {
    fontSize: "42px",
    margin: 0,
    background: "linear-gradient(135deg, #fff, #c7d2fe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "900"
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    marginTop: "10px",
    fontSize: "16px",
  },
  trending: {
    textAlign: "center",
    marginBottom: "25px",
  },
  trendingSpan: {
    display: "inline-block",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "20px",
    margin: "5px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: ".3s",
  },
  searchSection: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "20px",
  },
  input: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    minWidth: "220px",
    outline: "none",
    backdropFilter: "blur(10px)",
  },
  searchButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },
  jobsCount: {
    width: "90%",
    maxWidth: "1100px",
    margin: "0 auto 15px auto",
    color: "rgba(255,255,255,0.7)",
    fontSize: "15px",
    fontWeight: "600"
  },
  jobsContainer: {
    width: "90%",
    maxWidth: "1100px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    paddingBottom: "50px",
  },
  exploreMessage: {
    gridColumn: "1/-1",
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    fontSize: "18px",
    marginTop: "60px"
  },
  jobCard: {
    background: "rgba(255,255,255,0.95)",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
    overflow: "hidden"
  },
  jobTitle: {
    fontSize: "20px",
    color: "#111827",
    marginBottom: "8px",
    fontWeight: "800",
  },
  company: {
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px"
  },
  locationInfo: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "8px",
    fontWeight: "500"
  },
  tag: {
    display: "inline-block",
    padding: "6px 12px",
    background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
    color: "#111827",
    borderRadius: "8px",
    fontSize: "11px",
    marginTop: "16px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  applyBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "24px",
    width: "100%",
    padding: "14px 24px",
    background: "linear-gradient(135deg, #111827, #374151)",
    borderRadius: "12px",
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "700",
    transition: "all 0.3s"
  },
  loading: {
    textAlign: "center",
    gridColumn: "1/-1",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500"
  },
  exploreMoreWrapper: {
    gridColumn: "1/-1",
    textAlign: "center",
    marginTop: "20px"
  },
  exploreMoreBtn: {
    padding: "14px 32px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #111827, #374151)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px"
  }
};
