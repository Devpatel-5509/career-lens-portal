import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { 
  TrendingUp, 
  DollarSign, 
  ChevronRight, 
  Star, 
  Rocket, 
  BookOpen, 
  Sparkles,
  ArrowLeft,
  Clock,
  Users,
  Target,
  Award,
  Briefcase,
  Zap,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Calendar,
  MapPin,
  Brain,
  Code,
  Database,
  Shield,
  Gamepad2,
  Palette,
  Terminal,
  Server,
  Cpu,
  Cloud,
  Network,
  Lock,
  Smartphone,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [upskillCourses, setUpskillCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = JSON.parse(localStorage.getItem("userAnalysis"));
      setAnalysis(data);
      
      if (data && data.selectedSkills) {
        setLoading(true);
        try {
          const query = data.selectedSkills.join(" ");
          const response = await fetch(`http://localhost:5000/api/jobs/search-jobs?query=${encodeURIComponent(query)}`);
          const result = await response.json();
          
          if (result && result.results) {
            // Map Adzuna API results to UI format
            const mappedJobs = result.results.map((job, idx) => ({
              id: job.id || idx,
              title: job.title,
              match: Math.floor(Math.random() * 20) + 75, // Simulated match for UI
              salary: job.salary_min ? `$${Math.round(job.salary_min/1000)}k - $${Math.round(job.salary_max/1000)}k` : "$80k - $120k",
              demand: "High",
              growth: "+15%",
              timeline: "3-6 months",
              openings: "1,200+",
              location: job.location.display_name,
              skillsNeeded: data.selectedSkills.slice(0, 3),
              currentSkills: data.selectedSkills.slice(0, 2),
              description: job.description.substring(0, 150) + "...",
              companies: [job.company.display_name],
              color: idx % 2 === 0 ? "#6d5dfc" : "#fc5d9d",
              gradient: idx % 2 === 0 ? "linear-gradient(135deg, #6d5dfc, #764ba2)" : "linear-gradient(135deg, #fc5d9d, #ff9a56)",
              icon: Briefcase,
              url: job.redirect_url
            }));
            setCareerPaths(mappedJobs);
          } else {
            setCareerPaths(generateDynamicCareerPaths(data));
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setCareerPaths(generateDynamicCareerPaths(data));
        } finally {
          setLoading(false);
        }

        // Generate dynamic upskill courses locally still, or fetch from courses API
        setUpskillCourses(generateDynamicCourses(data));
      } else {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Function to generate dynamic career paths based on user analysis
  const generateDynamicCareerPaths = (userData) => {
    const { selectedSkills = [], selectedInterests = [], experienceLevel = "Beginner" } = userData;
    
    // Calculate match score based on skills and interests
    const calculateMatch = (requiredSkills, relatedInterests) => {
      let match = 70; // Base match
      
      // Add points for matching skills
      const skillMatch = selectedSkills.filter(skill => 
        requiredSkills.some(reqSkill => 
          skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
          reqSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      
      match += skillMatch * 8; // 8 points per matching skill
      
      // Add points for matching interests
      const interestMatch = selectedInterests.filter(interest =>
        relatedInterests.some(relInterest =>
          interest.toLowerCase().includes(relInterest.toLowerCase()) ||
          relInterest.toLowerCase().includes(interest.toLowerCase())
        )
      ).length;
      
      match += interestMatch * 5; // 5 points per matching interest
      
      // Adjust based on experience level
      const levelBonus = {
        "Beginner": 0,
        "Intermediate": 5,
        "Advanced": 10,
        "Expert": 15
      };
      
      match += levelBonus[experienceLevel] || 0;
      
      // Ensure match is within 50-98 range
      return Math.min(Math.max(Math.round(match), 50), 98);
    };

    // Get salary range based on experience level and field
    const getSalaryRange = (field, baseRange) => {
      const multipliers = {
        "Beginner": [0.6, 0.8],
        "Intermediate": [0.8, 1.0],
        "Advanced": [1.0, 1.3],
        "Expert": [1.2, 1.5]
      };
      
      const multiplier = multipliers[experienceLevel] || [1, 1];
      const low = Math.round(baseRange[0] * multiplier[0]);
      const high = Math.round(baseRange[1] * multiplier[1]);
      return `$${low}k - $${high}k`;
    };

    // Get timeline based on skill gap and experience
    const getTimeline = (requiredSkills, currentSkills) => {
      const skillGap = requiredSkills.filter(skill => 
        !currentSkills.some(currentSkill => 
          currentSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(currentSkill.toLowerCase())
        )
      ).length;
      
      const baseMonths = {
        "Beginner": 18,
        "Intermediate": 12,
        "Advanced": 8,
        "Expert": 6
      };
      
      const additionalMonths = skillGap * 2;
      const totalMonths = (baseMonths[experienceLevel] || 12) + additionalMonths;
      
      if (totalMonths < 6) return "3-6 months";
      if (totalMonths < 12) return "6-12 months";
      if (totalMonths < 18) return "12-18 months";
      return "18-24 months";
    };

    // All possible career paths
    const allCareerPaths = [
      // Programming/Development Paths
      {
        id: 1,
        title: "Senior Full Stack Developer",
        requiredSkills: ["React", "JavaScript", "Node.js", "TypeScript", "Next.js", "GraphQL", "AWS", "Docker"],
        relatedInterests: ["Software Dev", "Web3", "Product Management"],
        baseSalaryRange: [120, 180],
        demand: "High",
        growth: "+32%",
        companies: ["Google", "Meta", "Amazon", "Netflix", "Stripe", "Airbnb"],
        description: "Build end-to-end applications with modern frameworks",
        color: "#6d5dfc",
        gradient: "linear-gradient(135deg, #6d5dfc, #764ba2)",
        icon: Code
      },
      {
        id: 2,
        title: "AI/ML Engineer",
        requiredSkills: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "Machine Learning", "Data Science", "LLM"],
        relatedInterests: ["AI Research", "Data Science", "Fintech"],
        baseSalaryRange: [130, 220],
        demand: "Explosive",
        growth: "+156%",
        companies: ["OpenAI", "Anthropic", "Microsoft", "NVIDIA", "Google", "Meta"],
        description: "Design and implement cutting-edge AI solutions",
        color: "#fc5d9d",
        gradient: "linear-gradient(135deg, #fc5d9d, #ff9a56)",
        icon: Brain
      },
      {
        id: 3,
        title: "Mobile App Developer",
        requiredSkills: ["React Native", "JavaScript", "iOS Development", "Android Development", "Mobile UI/UX"],
        relatedInterests: ["Software Dev", "Product Management", "Gaming"],
        baseSalaryRange: [90, 160],
        demand: "High",
        growth: "+28%",
        companies: ["Apple", "Google", "Meta", "Uber", "Spotify", "Snapchat"],
        description: "Build cross-platform mobile applications",
        color: "#10b981",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        icon: Smartphone
      },
      
      // Data Paths
      {
        id: 4,
        title: "Data Scientist",
        requiredSkills: ["Python", "SQL", "Pandas", "Statistics", "Machine Learning", "Data Visualization"],
        relatedInterests: ["Data Science", "Fintech", "AI Research"],
        baseSalaryRange: [110, 180],
        demand: "High",
        growth: "+36%",
        companies: ["Amazon", "Netflix", "Spotify", "LinkedIn", "Meta", "Goldman Sachs"],
        description: "Extract insights from data to drive business decisions",
        color: "#3b82f6",
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        icon: BarChart3
      },
      {
        id: 5,
        title: "Data Engineer",
        requiredSkills: ["Python", "SQL", "Big Data", "ETL", "Spark", "Data Warehousing", "Cloud"],
        relatedInterests: ["Data Science", "Software Dev", "Fintech"],
        baseSalaryRange: [115, 185],
        demand: "Very High",
        growth: "+45%",
        companies: ["Amazon", "Microsoft", "Uber", "Airbnb", "Netflix", "Databricks"],
        description: "Build and maintain data infrastructure",
        color: "#8b5cf6",
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
        icon: Database
      },
      
      // Cloud/DevOps Paths
      {
        id: 6,
        title: "Cloud Solutions Architect",
        requiredSkills: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "CI/CD", "Security"],
        relatedInterests: ["Software Dev", "Cybersecurity"],
        baseSalaryRange: [130, 220],
        demand: "Very High",
        growth: "+42%",
        companies: ["Amazon", "Microsoft", "Google", "IBM", "Oracle", "Salesforce"],
        description: "Design and implement scalable cloud infrastructure",
        color: "#f59e0b",
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        icon: Cloud
      },
      {
        id: 7,
        title: "DevOps Engineer",
        requiredSkills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Linux", "Automation"],
        relatedInterests: ["Software Dev", "Cybersecurity"],
        baseSalaryRange: [110, 190],
        demand: "High",
        growth: "+38%",
        companies: ["Netflix", "Spotify", "Uber", "Etsy", "Target", "Adobe"],
        description: "Bridge development and operations for faster delivery",
        color: "#ef4444",
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        icon: Terminal
      },
      
      // Cybersecurity Paths
      {
        id: 8,
        title: "Cybersecurity Analyst",
        requiredSkills: ["Network Security", "Ethical Hacking", "SIEM", "Cryptography", "Compliance"],
        relatedInterests: ["Cybersecurity", "Fintech"],
        baseSalaryRange: [90, 160],
        demand: "Critical",
        growth: "+35%",
        companies: ["CrowdStrike", "Palo Alto Networks", "IBM", "Cisco", "Amazon", "Microsoft"],
        description: "Protect organizations from digital threats and attacks",
        color: "#84cc16",
        gradient: "linear-gradient(135deg, #84cc16, #65a30d)",
        icon: Shield
      },
      
      // Creative/Design Paths
      {
        id: 9,
        title: "UI/UX Designer",
        requiredSkills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
        relatedInterests: ["Product Management", "Software Dev"],
        baseSalaryRange: [80, 150],
        demand: "High",
        growth: "+22%",
        companies: ["Apple", "Google", "Figma", "Adobe", "Airbnb", "Spotify"],
        description: "Create intuitive and beautiful user experiences",
        color: "#ec4899",
        gradient: "linear-gradient(135deg, #ec4899, #db2777)",
        icon: Palette
      },
      
      // Game Development
      {
        id: 10,
        title: "Game Developer",
        requiredSkills: ["Unity", "C#", "C++", "Game Physics", "3D Graphics", "Game AI"],
        relatedInterests: ["Gaming", "Software Dev"],
        baseSalaryRange: [70, 150],
        demand: "Moderate",
        growth: "+18%",
        companies: ["Epic Games", "Activision", "EA", "Ubisoft", "Nintendo", "Sony"],
        description: "Create interactive gaming experiences and simulations",
        color: "#f97316",
        gradient: "linear-gradient(135deg, #f97316, #ea580c)",
        icon: Gamepad2
      }
    ];

    // Filter and calculate for user's current skills
    const userSkills = selectedSkills.map(skill => skill.toLowerCase());
    
    const calculatedPaths = allCareerPaths.map(path => {
      const matchScore = calculateMatch(path.requiredSkills, path.relatedInterests);
      
      // Determine current skills user already has for this path
      const currentSkills = path.requiredSkills.filter(skill => 
        userSkills.some(userSkill => 
          skill.toLowerCase().includes(userSkill) || 
          userSkill.includes(skill.toLowerCase())
        )
      ).slice(0, 3);
      
      // Determine skills needed (top 3 missing skills)
      const skillsNeeded = path.requiredSkills.filter(skill => 
        !currentSkills.some(currentSkill => 
          currentSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).slice(0, 3);
      
      return {
        id: path.id,
        title: path.title,
        match: matchScore,
        salary: getSalaryRange(path.title, path.baseSalaryRange),
        demand: path.demand,
        growth: path.growth,
        timeline: getTimeline(skillsNeeded, currentSkills),
        openings: getOpeningsCount(path.demand),
        location: getLocationPreference(path.title),
        skillsNeeded: skillsNeeded,
        currentSkills: currentSkills,
        description: path.description,
        companies: path.companies,
        color: path.color,
        gradient: path.gradient,
        icon: path.icon
      };
    });

    // Sort by match score and return top 3
    return calculatedPaths
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
  };

  // Helper functions
  const getOpeningsCount = (demand) => {
    const baseCount = 5000;
    const multipliers = {
      "Explosive": 2.5,
      "Very High": 2.0,
      "High": 1.5,
      "Critical": 1.8,
      "Moderate": 1.0
    };
    return Math.round(baseCount * (multipliers[demand] || 1)).toLocaleString();
  };

  const getLocationPreference = (title) => {
    if (title.includes("Developer") || title.includes("Engineer")) {
      return "Remote/Hybrid";
    }
    if (title.includes("AI") || title.includes("Data")) {
      return "Remote/On-site";
    }
    return "Hybrid";
  };

  // Generate dynamic courses based on user skills
  const generateDynamicCourses = (userData) => {
    const { selectedSkills = [] } = userData;
    
    const allCourses = [
      // Web Development
      {
        title: "Advanced React Patterns",
        provider: "Frontend Masters",
        duration: "8 hours",
        rating: 4.9,
        skills: ["React", "JavaScript", "TypeScript"],
        color: "#6d5dfc"
      },
      {
        title: "Full Stack Development Bootcamp",
        provider: "Codecademy",
        duration: "12 weeks",
        rating: 4.8,
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        color: "#3b82f6"
      },
      // AI/ML
      {
        title: "Machine Learning Specialization",
        provider: "Coursera",
        duration: "4 months",
        rating: 4.9,
        skills: ["Python", "Machine Learning", "TensorFlow"],
        color: "#ec4899"
      },
      {
        title: "Deep Learning with PyTorch",
        provider: "Udacity",
        duration: "3 months",
        rating: 4.7,
        skills: ["Python", "PyTorch", "Deep Learning"],
        color: "#f59e0b"
      },
      // Data Science
      {
        title: "Data Science with Python",
        provider: "DataCamp",
        duration: "10 weeks",
        rating: 4.6,
        skills: ["Python", "Pandas", "Statistics"],
        color: "#10b981"
      },
      // Cloud/DevOps
      {
        title: "AWS Solutions Architect",
        provider: "A Cloud Guru",
        duration: "20 hours",
        rating: 4.7,
        skills: ["AWS", "Cloud Computing", "Terraform"],
        color: "#f97316"
      },
      {
        title: "Docker & Kubernetes Mastery",
        provider: "Udemy",
        duration: "15 hours",
        rating: 4.8,
        skills: ["Docker", "Kubernetes", "DevOps"],
        color: "#8b5cf6"
      },
      // Cybersecurity
      {
        title: "Ethical Hacking Certification",
        provider: "Cybrary",
        duration: "6 weeks",
        rating: 4.5,
        skills: ["Security", "Ethical Hacking", "Network"],
        color: "#84cc16"
      },
      // Design
      {
        title: "UI/UX Design Fundamentals",
        provider: "Interaction Design Foundation",
        duration: "8 weeks",
        rating: 4.7,
        skills: ["UI/UX", "Figma", "Design"],
        color: "#ec4899"
      },
      // Game Development
      {
        title: "Unity Game Development",
        provider: "Udemy",
        duration: "10 weeks",
        rating: 4.6,
        skills: ["Unity", "C#", "Game Development"],
        color: "#f97316"
      }
    ];

    // Filter courses based on user skills
    if (selectedSkills.length === 0) return allCourses.slice(0, 3);
    
    const userSkills = selectedSkills.map(skill => skill.toLowerCase());
    
    const matchingCourses = allCourses.filter(course => 
      course.skills.some(courseSkill => 
        userSkills.some(userSkill => 
          courseSkill.toLowerCase().includes(userSkill) || 
          userSkill.includes(courseSkill.toLowerCase())
        )
      )
    );

    // Return top 3 matching courses, or all courses if no matches
    return matchingCourses.length > 0 ? matchingCourses.slice(0, 3) : allCourses.slice(0, 3);
  };

  const handleGetStarted = () => {
    if (careerPaths.length > 0 && selectedPath !== null) {
      const path = careerPaths[selectedPath];
      alert(`Starting your journey to become a ${path.title}!\n\nWe'll help you:\n• Learn ${path.skillsNeeded.join(", ")}\n• Build projects in ${path.timeline}\n• Connect with companies like ${path.companies.slice(0, 2).join(", ")}`);
    } else {
      alert("Please select a career path to get started!");
    }
  };

  return (
    <PageLayout>
      <div style={styles.pageWrapper}>
        {/* Animated background gradients */}
        <div style={styles.bgGradient1} />
        <div style={styles.bgGradient2} />
        <div style={styles.bgGradient3} />

        <div style={styles.container}>
          {/* Hero Header */}
          <div style={styles.heroSection}>
            <button 
              onClick={() => navigate("/dashboard")} 
              style={styles.backBtn}
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            
            <div style={styles.heroContent}>
              <div style={styles.heroBadge}>
                <Sparkles size={16} />
                <span>AI-Powered Career Intelligence</span>
              </div>
              <h1 style={styles.heroTitle}>Your Personalized Career Roadmap</h1>
              <p style={styles.heroSubtitle}>
                {analysis ? 
                  `Based on your ${analysis.selectedSkills?.length || 0} skills and ${analysis.selectedInterests?.length || 0} interests in ${analysis.experienceLevel || 'Beginner'} level` :
                  "We've analyzed your skills, interests, and experience level to find the perfect career paths for you"
                }
              </p>
            </div>

            {/* Quick Stats */}
            <div style={styles.quickStats}>
              <div style={styles.quickStatCard}>
                <div style={styles.statIconWrapper}>
                  <Target size={24} style={{color: "#6d5dfc"}} />
                </div>
                <div>
                  <div style={styles.statValue}>{careerPaths.length}</div>
                  <div style={styles.statLabel}>Career Paths</div>
                </div>
              </div>
              <div style={styles.quickStatCard}>
                <div style={styles.statIconWrapper}>
                  <Star size={24} style={{color: "#fdcb6e"}} />
                </div>
                <div>
                  <div style={styles.statValue}>
                    {careerPaths.length > 0 ? `${Math.max(...careerPaths.map(p => p.match))}%` : "0%"}
                  </div>
                  <div style={styles.statLabel}>Best Match</div>
                </div>
              </div>
              <div style={styles.quickStatCard}>
                <div style={styles.statIconWrapper}>
                  <TrendingUp size={24} style={{color: "#10b981"}} />
                </div>
                <div>
                  <div style={styles.statValue}>
                    {careerPaths.length > 0 ? careerPaths[0].salary.split(" - ")[1] : "$0k"}
                  </div>
                  <div style={styles.statLabel}>Top Salary</div>
                </div>
              </div>
              <div style={styles.quickStatCard}>
                <div style={styles.statIconWrapper}>
                  <Clock size={24} style={{color: "#fc5d9d"}} />
                </div>
                <div>
                  <div style={styles.statValue}>
                    {careerPaths.length > 0 ? careerPaths[0].timeline.split(" ")[0] : "0-6mo"}
                  </div>
                  <div style={styles.statLabel}>Timeline</div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Path Cards */}
          <div style={styles.pathsSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Recommended Career Paths</h2>
              <p style={styles.sectionSubtitle}>
                Ranked by match score and aligned with your profile
                {analysis && ` (${analysis.experienceLevel || 'Beginner'} Level)`}
              </p>
            </div>

            {careerPaths.length > 0 ? (
              <div style={styles.careerGrid}>
                {careerPaths.map((path, idx) => {
                  const PathIcon = path.icon || Code;
                  return (
                    <div 
                      key={path.id} 
                      style={{
                        ...styles.careerCard,
                        ...(selectedPath === idx ? styles.careerCardExpanded : {})
                      }}
                      onClick={() => setSelectedPath(selectedPath === idx ? null : idx)}
                    >
                      {/* Card Header */}
                      <div style={styles.cardTop}>
                        <div style={styles.cardTopLeft}>
                          <div style={styles.rankBadge} data-rank={idx + 1}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div style={styles.titleRow}>
                              <PathIcon size={20} style={{color: path.color, marginRight: "10px"}} />
                              <h3 style={styles.careerTitle}>{path.title}</h3>
                            </div>
                            <p style={styles.careerDesc}>{path.description}</p>
                          </div>
                        </div>
                        <div style={{
                          ...styles.matchScore,
                          background: path.gradient
                        }}>
                          <Star size={20} fill="#fff" color="#fff" />
                          <div>
                            <div style={styles.matchNumber}>{path.match}%</div>
                            <div style={styles.matchLabel}>Match</div>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div style={styles.metricsGrid}>
                        <div style={styles.metricItem}>
                          <DollarSign size={18} style={{color: "#10b981"}} />
                          <div>
                            <div style={styles.metricValue}>{path.salary}</div>
                            <div style={styles.metricLabel}>Salary Range</div>
                          </div>
                        </div>
                        <div style={styles.metricItem}>
                          <TrendingUp size={18} style={{color: path.color}} />
                          <div>
                            <div style={styles.metricValue}>{path.growth}</div>
                            <div style={styles.metricLabel}>Growth Rate</div>
                          </div>
                        </div>
                        <div style={styles.metricItem}>
                          <Briefcase size={18} style={{color: "#3b82f6"}} />
                          <div>
                            <div style={styles.metricValue}>{path.openings}</div>
                            <div style={styles.metricLabel}>Open Positions</div>
                          </div>
                        </div>
                        <div style={styles.metricItem}>
                          <Clock size={18} style={{color: "#f59e0b"}} />
                          <div>
                            <div style={styles.metricValue}>{path.timeline}</div>
                            <div style={styles.metricLabel}>Est. Timeline</div>
                          </div>
                        </div>
                      </div>

                      {/* Demand Badge */}
                      <div style={styles.demandSection}>
                        <div style={{
                          ...styles.demandBadge,
                          ...(path.demand === "Explosive" ? styles.demandExplosive : 
                              path.demand === "Very High" || path.demand === "Critical" ? styles.demandHigh : 
                              path.demand === "High" ? styles.demandMedium : styles.demandLow)
                        }}>
                          <Zap size={14} />
                          {path.demand} Demand
                        </div>
                        <div style={styles.locationBadge}>
                          <MapPin size={14} />
                          {path.location}
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div style={styles.skillsSection}>
                        <div style={styles.skillCategory}>
                          <div style={styles.skillCategoryHeader}>
                            <CheckCircle2 size={16} style={{color: "#10b981"}} />
                            <span>You Already Have</span>
                          </div>
                          <div style={styles.skillsList}>
                            {path.currentSkills.length > 0 ? (
                              path.currentSkills.map(skill => (
                                <span key={skill} style={{...styles.skillTag, ...styles.skillOwned}}>
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span style={{...styles.skillTag, ...styles.skillOwned}}>
                                {analysis?.selectedSkills?.[0] || "Transferable Skills"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={styles.skillCategory}>
                          <div style={styles.skillCategoryHeader}>
                            <Target size={16} style={{color: path.color}} />
                            <span>Skills to Learn</span>
                          </div>
                          <div style={styles.skillsList}>
                            {path.skillsNeeded.map(skill => (
                              <span key={skill} style={{
                                ...styles.skillTag, 
                                ...styles.skillNeeded,
                                borderColor: path.color
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Top Companies */}
                      {selectedPath === idx && (
                        <div style={styles.expandedSection}>
                          <div style={styles.companiesSection}>
                            <div style={styles.companiesHeader}>
                              <Award size={18} style={{color: path.color}} />
                              <span>Top Hiring Companies</span>
                            </div>
                            <div style={styles.companiesList}>
                              {path.companies.map(company => (
                                <div key={company} style={styles.companyTag}>
                                  {company}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={styles.cardActions}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (path.url) {
                              window.open(path.url, '_blank');
                            } else {
                              navigate("/courses", { 
                                state: { 
                                  skills: path.skillsNeeded,
                                  interests: analysis?.selectedInterests || [],
                                  level: analysis?.experienceLevel || "Beginner"
                                }
                              });
                            }
                          }}
                          style={{
                            ...styles.primaryBtn,
                            background: path.gradient
                          }}
                        >
                          <Rocket size={18} />
                          {path.url ? "View Job Listing" : "Start Learning Path"}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPath(selectedPath === idx ? null : idx);
                          }}
                          style={styles.secondaryBtn}
                        >
                          {selectedPath === idx ? "Show Less" : "Show More"}
                          <ChevronRight 
                            size={18} 
                            style={{
                              transform: selectedPath === idx ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.3s ease"
                            }} 
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.noPaths}>
                <Brain size={48} style={{color: "#6d5dfc", marginBottom: "20px"}} />
                <h3 style={{color: "#fff", marginBottom: "10px"}}>No career paths found</h3>
                <p style={{color: "#94a3b8", marginBottom: "20px"}}>
                  Complete your skill analysis to get personalized recommendations
                </p>
                <button 
                  onClick={() => navigate("/analysis")} 
                  style={styles.primaryBtn}
                >
                  Go to Analysis
                </button>
              </div>
            )}
          </div>

          {/* Learning Resources */}
          {upskillCourses.length > 0 && (
            <div style={styles.learningSection}>
              <div style={styles.learningSectionInner}>
                <div style={styles.learningHeader}>
                  <div style={styles.learningIcon}>
                    <BookOpen size={32} />
                  </div>
                  <div>
                    <h2 style={styles.learningTitle}>Accelerate Your Journey</h2>
                    <p style={styles.learningSubtitle}>
                      Top-rated courses to help you reach 100% match score faster
                    </p>
                  </div>
                </div>

                <div style={styles.coursesGrid}>
                  {upskillCourses.map((course, idx) => (
                    <div key={idx} style={styles.courseCard}>
                      <div style={styles.courseTop}>
                        <div style={{...styles.courseIcon, background: `${course.color}20`}}>
                          <BookOpen size={20} style={{color: course.color}} />
                        </div>
                        <div style={styles.courseRating}>
                          <Star size={14} fill="#fdcb6e" color="#fdcb6e" />
                          {course.rating}
                        </div>
                      </div>
                      <h4 style={styles.courseTitle}>{course.title}</h4>
                      <div style={styles.courseInfo}>
                        <span style={{...styles.courseProvider, color: course.color}}>
                          {course.provider}
                        </span>
                        <span style={styles.courseDuration}>
                          <Clock size={14} />
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate("/courses")}
                  style={styles.browseBtn}
                >
                  <Sparkles size={18} />
                  Browse All Recommended Courses
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div style={styles.ctaSection}>
            <div style={styles.ctaContent}>
              <Rocket size={48} style={{color: "#fff"}} />
              <h3 style={styles.ctaTitle}>Ready to Start Your Journey?</h3>
              <p style={styles.ctaText}>
                Take the first step towards your dream career. Get personalized mentorship and guidance.
              </p>
              <button 
                onClick={handleGetStarted}
                style={styles.ctaButton}
              >
                Get Started Now
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#0a0e1a",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px"
  },
  
  // Animated backgrounds
  bgGradient1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(109, 93, 252, 0.08) 0%, transparent 70%)",
    top: "-10%",
    left: "-10%",
    zIndex: 0,
    animation: "float 20s infinite ease-in-out"
  },
  bgGradient2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(252, 93, 157, 0.06) 0%, transparent 70%)",
    top: "30%",
    right: "-8%",
    zIndex: 0,
    animation: "float 25s infinite ease-in-out reverse"
  },
  bgGradient3: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(253, 203, 110, 0.05) 0%, transparent 70%)",
    bottom: "10%",
    left: "20%",
    zIndex: 0,
    animation: "float 30s infinite ease-in-out"
  },

  container: { 
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1
  },

  // Hero Section
  heroSection: {
    marginBottom: "60px"
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "30px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.08)",
      transform: "translateY(-2px)"
    }
  },
  heroContent: {
    textAlign: "center",
    marginBottom: "40px"
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, rgba(109, 93, 252, 0.15), rgba(252, 93, 157, 0.15))",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "100px",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "20px"
  },
  heroTitle: {
    fontSize: "56px",
    fontWeight: "900",
    letterSpacing: "-2px",
    margin: "0 0 16px 0",
    background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: "1.1"
  },
  heroSubtitle: { 
    color: "#94a3b8", 
    fontSize: "18px", 
    margin: 0,
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6"
  },

  // Quick Stats
  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    padding: "30px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  quickStatCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  statIconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1"
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
    fontWeight: "600"
  },

  // Paths Section
  pathsSection: {
    marginBottom: "60px"
  },
  sectionHeader: {
    marginBottom: "32px",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0"
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0
  },

  // Career Cards
  careerGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  careerCard: {
    background: "rgba(255,255,255,0.02)",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      background: "rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.12)",
      transform: "translateY(-4px)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
    }
  },
  careerCardExpanded: {
    background: "rgba(255,255,255,0.04)",
    borderColor: "rgba(109, 93, 252, 0.3)",
    boxShadow: "0 20px 60px rgba(109, 93, 252, 0.15)"
  },

  // Card Top
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    gap: "20px"
  },
  cardTopLeft: {
    display: "flex",
    gap: "16px",
    flex: 1
  },
  rankBadge: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
    color: "#6d5dfc",
    flexShrink: 0
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px"
  },
  careerTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    lineHeight: "1.2"
  },
  careerDesc: {
    color: "#94a3b8",
    fontSize: "15px",
    margin: 0,
    lineHeight: "1.5"
  },
  matchScore: {
    padding: "16px 20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#fff",
    flexShrink: 0
  },
  matchNumber: {
    fontSize: "24px",
    fontWeight: "900",
    lineHeight: "1"
  },
  matchLabel: {
    fontSize: "12px",
    opacity: 0.9,
    fontWeight: "600"
  },

  // Metrics Grid
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "24px"
  },
  metricItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  metricValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    lineHeight: "1"
  },
  metricLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px"
  },

  // Demand Section
  demandSection: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap"
  },
  demandBadge: {
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  demandExplosive: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.3)"
  },
  demandHigh: {
    background: "rgba(245, 158, 11, 0.15)",
    color: "#f59e0b",
    border: "1px solid rgba(245, 158, 11, 0.3)"
  },
  demandMedium: {
    background: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
    border: "1px solid rgba(16, 185, 129, 0.3)"
  },
  demandLow: {
    background: "rgba(148, 163, 184, 0.15)",
    color: "#94a3b8",
    border: "1px solid rgba(148, 163, 184, 0.3)"
  },
  locationBadge: {
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(59, 130, 246, 0.15)",
    color: "#3b82f6",
    border: "1px solid rgba(59, 130, 246, 0.3)"
  },

  // Skills Section
  skillsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "24px"
  },
  skillCategory: {
    background: "rgba(255,255,255,0.02)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  skillCategoryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  skillsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  skillTag: {
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600"
  },
  skillOwned: {
    background: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    border: "1px solid rgba(16, 185, 129, 0.3)"
  },
  skillNeeded: {
    background: "rgba(255,255,255,0.03)",
    color: "#cbd5e1",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  // Expanded Section
  expandedSection: {
    marginBottom: "24px"
  },
  companiesSection: {
    background: "rgba(255,255,255,0.02)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  companiesHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  companiesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  companyTag: {
    padding: "10px 18px",
    background: "rgba(109, 93, 252, 0.1)",
    color: "#a78bfa",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid rgba(109, 93, 252, 0.2)"
  },

  // Card Actions
  cardActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  primaryBtn: {
    flex: 1,
    minWidth: "200px",
    padding: "16px 28px",
    borderRadius: "14px",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
    }
  },
  secondaryBtn: {
    padding: "16px 28px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.08)",
      borderColor: "rgba(255,255,255,0.2)"
    }
  },

  // No Paths
  noPaths: {
    textAlign: "center",
    padding: "60px 40px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.05)"
  },

  // Learning Section
  learningSection: {
    marginBottom: "60px"
  },
  learningSectionInner: {
    padding: "40px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.08)"
  },
  learningHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px"
  },
  learningIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #6d5dfc, #fc5d9d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0
  },
  learningTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0"
  },
  learningSubtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    margin: 0
  },

  // Courses Grid
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "28px"
  },
  courseCard: {
    padding: "24px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      background: "rgba(255,255,255,0.05)"
    }
  },
  courseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  courseIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  courseRating: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff"
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 16px 0",
    lineHeight: "1.3"
  },
  courseInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px"
  },
  courseProvider: {
    fontSize: "13px",
    fontWeight: "600"
  },
  courseDuration: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600"
  },
  browseBtn: {
    width: "100%",
    padding: "18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #6d5dfc, #fc5d9d)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 30px rgba(109, 93, 252, 0.3)"
    }
  },

  // CTA Section
  ctaSection: {
    padding: "60px 40px",
    background: "linear-gradient(135deg, #6d5dfc, #fc5d9d)",
    borderRadius: "24px",
    position: "relative",
    overflow: "hidden"
  },
  ctaContent: {
    textAlign: "center",
    position: "relative",
    zIndex: 1
  },
  ctaTitle: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#fff",
    margin: "20px 0 12px 0"
  },
  ctaText: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.9)",
    margin: "0 0 32px 0",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6"
  },
  ctaButton: {
    padding: "18px 40px",
    borderRadius: "14px",
    border: "none",
    background: "#fff",
    color: "#6d5dfc",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
    }
  }
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(10px, 10px) rotate(5deg); }
      50% { transform: translate(-5px, 5px) rotate(-5deg); }
      75% { transform: translate(-10px, -5px) rotate(3deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}