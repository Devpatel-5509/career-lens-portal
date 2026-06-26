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
  ExternalLink,
  Loader2,
  Brain,
  Target,
  Code,
  Database,
  Shield,
  Zap,
  Gamepad2,
  BarChart3,
  Palette,
  Terminal,
  Server,
  Cpu,
  Cloud,
  Network,
  Lock,
  Smartphone,
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  MapPin,
  Briefcase,
  Award,
  MessageSquare,
  FileText,
  Linkedin,
  Github,
  Building,
  Globe,
  AlertCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [hasSelectedSkills, setHasSelectedSkills] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      // Priority 1: Use state passed from Analysis page for instant update
      if (location.state?.analysis) {
        const analysisData = location.state.analysis;
        console.log("Using analysis from navigation state:", analysisData);
        setAnalysis(analysisData);
        setHasSelectedSkills(true);
        fetchRecommendedCourses(analysisData.selectedSkills);
        fetchAICareerPaths(analysisData);
        setLoading(false);
        return; // CRITICAL: Stop here so we don't overwrite with stale server data
      }

      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/api/analysis/get-my-analysis", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (response.ok) {
          const analysisData = data.analysis;
          setAnalysis(analysisData);
          
          const hasSkills = analysisData?.selectedSkills?.length > 0;
          const hasInterests = analysisData?.selectedInterests?.length > 0;
          const hasExperience = analysisData?.experienceLevel?.length > 0;
          setHasSelectedSkills(hasSkills && hasInterests && hasExperience);
          
          if (hasSkills && hasInterests && hasExperience) {
            // First, start fetching courses immediately
            fetchRecommendedCourses(analysisData.selectedSkills);
            
            // Now, fetch AI career paths from the new dynamic endpoint
            fetchAICareerPaths(analysisData);
          }
        } else {
          // Fallback to local storage
          const localData = localStorage.getItem("userAnalysis");
          if (localData) {
            const parsedData = JSON.parse(localData);
            setAnalysis(parsedData);
            setHasSelectedSkills(true);
            fetchRecommendedCourses(parsedData.selectedSkills);
            fetchAICareerPaths(parsedData);
          }
        }
      } catch (error) {
        console.error("Connection error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAICareerPaths = async (analysisData) => {
      try {
        console.log("Fetching AI Career Paths for:", analysisData);
        const pathRes = await fetch("http://localhost:5000/api/recommendation/career-paths", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(analysisData)
        });
        
        if (pathRes.ok) {
          const pathData = await pathRes.json();
          console.log("AI Path Response Received:", pathData);
          
          if (!pathData.paths || pathData.paths.length === 0) {
            console.warn("AI returned empty paths, using static fallbacks");
            setCareerPaths(generateCareerPaths(analysisData));
            return;
          }

          // Map AI paths to include UI icons/gradients
          const mappedPaths = pathData.paths.map((p, idx) => ({
            ...p,
            id: `ai-path-${idx}`,
            icon: getAIIcon(p.title),
            color: getAIColor(idx),
            gradient: getAIGradient(idx),
            // Ensure all required arrays exist
            roadmapSteps: p.roadmapSteps || [],
            skillsNeeded: p.skillsNeeded || [],
            companies: p.companies || ["Google", "Meta", "Amazon"],
            resources: p.resources || [
              { name: "Coursera", url: "https://coursera.org", type: "Platform" },
              { name: "Udemy", url: "https://udemy.com", type: "Platform" }
            ],
            certifications: p.certifications || ["Industry Certification"]
          }));
          
          setCareerPaths(mappedPaths);
        } else {
          const errorData = await pathRes.json().catch(() => ({}));
          console.error("AI Path Fetch Error:", pathRes.status, errorData);
          setCareerPaths(generateCareerPaths(analysisData));
        }
      } catch (e) {
        console.error("Network Error fetching AI paths:", e);
        setCareerPaths(generateCareerPaths(analysisData));
      }
    };

    // Helper utilities for AI path styling
    const getAIIcon = (title) => {
      const lower = title.toLowerCase();
      if (lower.includes("ai") || lower.includes("machine")) return Brain;
      if (lower.includes("security") || lower.includes("hack")) return Shield;
      if (lower.includes("data") || lower.includes("analyst")) return BarChart3;
      if (lower.includes("cloud") || lower.includes("azure") || lower.includes("aws")) return Cloud;
      if (lower.includes("game") || lower.includes("unity")) return Gamepad2;
      if (lower.includes("design") || lower.includes("ux") || lower.includes("ui")) return Palette;
      if (lower.includes("mobile") || lower.includes("app")) return Smartphone;
      return Code;
    };

    const getAIColor = (idx) => ["#6d5dfc", "#fc5d9d", "#10b981"][idx % 3];
    const getAIGradient = (idx) => [
      "linear-gradient(135deg, #6d5dfc, #764ba2)",
      "linear-gradient(135deg, #fc5d9d, #ff9a56)",
      "linear-gradient(135deg, #10b981, #059669)"
    ][idx % 3];

    fetchAnalysis();

    return () => {
      document.body.style.backgroundColor = ""; 
    };
  }, []);

  // Function to generate career paths based on user analysis
  const generateCareerPaths = (analysisData) => {
    if (!analysisData) return getDefaultPaths(null);
    
    const { selectedSkills = [], selectedInterests = [], experienceLevel = "Beginner" } = analysisData;
    
    // Calculate match score based on skills, interests, and experience
    const calculateMatch = (pathSkills, pathInterests, levelMultiplier = 1) => {
      let match = 0;
      
      // Skill matching (50% weight)
      const skillOverlap = selectedSkills.filter(skill => 
        pathSkills.some(pathSkill => 
          skill.toLowerCase().includes(pathSkill.toLowerCase()) || 
          pathSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      match += (skillOverlap / Math.max(pathSkills.length, 1)) * 50;
      
      // Interest matching (30% weight)
      const interestOverlap = selectedInterests.filter(interest =>
        pathInterests.some(pathInterest =>
          interest.toLowerCase().includes(pathInterest.toLowerCase()) ||
          pathInterest.toLowerCase().includes(interest.toLowerCase())
        )
      ).length;
      match += (interestOverlap / Math.max(pathInterests.length, 1)) * 30;
      
      // Experience level adjustment (20% weight)
      match *= levelMultiplier;
      
      // Add random variance (±5%) for realism
      match += (Math.random() * 10 - 5);
      
      return Math.min(Math.max(Math.round(match), 50), 98);
    };

    // All possible career paths with their requirements
    const allPaths = [
      // Full Stack Development
      {
        id: 1,
        title: "Senior Full Stack Developer",
        match: calculateMatch(["React", "JavaScript", "Node.js"], ["Software Dev", "Web3"], getLevelMultiplier(experienceLevel, "Advanced")),
        salary: getSalaryRange(experienceLevel, [110, 160]),
        demand: "High",
        growth: "+32%",
        timeline: "6-12 months",
        skillsNeeded: getNeededSkills(["React", "JavaScript"], ["TypeScript", "Next.js", "GraphQL", "AWS", "Docker"]),
        interests: ["Software Dev", "Web3", "Product Management"],
        description: "Build complete web applications from frontend to backend.",
        icon: Code,
        companies: ["Google", "Meta", "Amazon", "Netflix", "Stripe"],
        roadmapSteps: [
          "Master TypeScript and modern JavaScript (ES6+)",
          "Learn Next.js framework with SSR capabilities",
          "Deep dive into backend with Node.js and Express",
          "Learn database design with PostgreSQL/MongoDB",
          "Master cloud deployment (AWS/GCP)",
          "Learn CI/CD and Docker containerization",
          "Build 3 full-stack portfolio projects"
        ],
        resources: [
          { name: "Full Stack Open", url: "https://fullstackopen.com/", type: "Course" },
          { name: "Frontend Masters", url: "https://frontendmasters.com/", type: "Platform" },
          { name: "The Odin Project", url: "https://www.theodinproject.com/", type: "Curriculum" }
        ],
        certifications: ["AWS Certified Developer", "MongoDB Certified Developer"],
        jobPortals: ["LinkedIn Jobs", "Indeed", "AngelList", "Hired"],
        color: "#6d5dfc",
        gradient: "linear-gradient(135deg, #6d5dfc, #764ba2)"
      },
      
      // AI/ML Engineering
      {
        id: 2,
        title: "AI/ML Engineer",
        match: calculateMatch(["Python", "AI/ML"], ["AI Research", "Data Science"], getLevelMultiplier(experienceLevel, "Intermediate")),
        salary: getSalaryRange(experienceLevel, [120, 200]),
        demand: "Explosive",
        growth: "+156%",
        timeline: "12-18 months",
        skillsNeeded: getNeededSkills(["Python", "AI/ML"], ["PyTorch", "TensorFlow", "Scikit-learn", "MLOps", "LLM"]),
        interests: ["AI Research", "Data Science", "Fintech"],
        description: "Design and implement intelligent machine learning systems.",
        icon: Brain,
        companies: ["OpenAI", "Anthropic", "Microsoft", "NVIDIA", "Google"],
        roadmapSteps: [
          "Advanced Python programming with NumPy/Pandas",
          "Master ML algorithms and neural networks",
          "Learn deep learning frameworks (PyTorch/TensorFlow)",
          "Study natural language processing techniques",
          "Learn MLOps and model deployment",
          "Work on Kaggle competitions",
          "Build AI-powered applications"
        ],
        resources: [
          { name: "Fast.ai", url: "https://www.fast.ai/", type: "Course" },
          { name: "Kaggle", url: "https://www.kaggle.com/", type: "Platform" },
          { name: "Coursera ML", url: "https://www.coursera.org/learn/machine-learning", type: "Course" }
        ],
        certifications: ["Google ML Engineer", "AWS ML Specialty"],
        jobPortals: ["LinkedIn AI Jobs", "AI-jobs.net", "Hugging Face Jobs"],
        color: "#fc5d9d",
        gradient: "linear-gradient(135deg, #fc5d9d, #ff9a56)"
      },
      
      // Data Science
      {
        id: 3,
        title: "Data Scientist",
        match: calculateMatch(["Python", "SQL", "Data Science"], ["Data Science", "Fintech"], getLevelMultiplier(experienceLevel, "Intermediate")),
        salary: getSalaryRange(experienceLevel, [100, 180]),
        demand: "High",
        growth: "+36%",
        timeline: "8-14 months",
        skillsNeeded: getNeededSkills(["Python", "SQL"], ["Pandas", "Scikit-learn", "Tableau", "Statistics", "Big Data"]),
        interests: ["Data Science", "Fintech", "Product Management"],
        description: "Extract insights from data to drive business decisions.",
        icon: BarChart3,
        companies: ["Amazon", "Netflix", "Spotify", "LinkedIn", "Meta"],
        roadmapSteps: [
          "Master statistical analysis and hypothesis testing",
          "Learn data visualization with Tableau/Power BI",
          "Advanced SQL for complex queries",
          "Study machine learning for prediction",
          "Learn big data tools (Spark, Hadoop)",
          "Work with real-world datasets",
          "Build predictive models"
        ],
        resources: [
          { name: "DataCamp", url: "https://www.datacamp.com/", type: "Platform" },
          { name: "Kaggle", url: "https://www.kaggle.com/", type: "Platform" },
          { name: "Towards Data Science", url: "https://towardsdatascience.com/", type: "Blog" }
        ],
        certifications: ["IBM Data Science", "Google Data Analytics"],
        jobPortals: ["LinkedIn Data Jobs", "Kaggle Jobs", "Data Science Central"],
        color: "#10b981",
        gradient: "linear-gradient(135deg, #10b981, #059669)"
      },
      
      // Cybersecurity
      {
        id: 4,
        title: "Cybersecurity Analyst",
        match: calculateMatch(["Security", "Networking"], ["Cybersecurity"], getLevelMultiplier(experienceLevel, "Intermediate")),
        salary: getSalaryRange(experienceLevel, [90, 160]),
        demand: "Critical",
        growth: "+35%",
        timeline: "10-16 months",
        skillsNeeded: getNeededSkills(["Security"], ["Ethical Hacking", "Network Security", "SIEM", "Cryptography", "Compliance"]),
        interests: ["Cybersecurity", "Fintech"],
        description: "Protect organizations from digital threats and attacks.",
        icon: Shield,
        companies: ["CrowdStrike", "Palo Alto Networks", "IBM", "Cisco", "Amazon"],
        roadmapSteps: [
          "Learn network protocols and security",
          "Study ethical hacking techniques",
          "Master security tools (Wireshark, Metasploit)",
          "Learn about cryptography and encryption",
          "Study compliance standards (GDPR, HIPAA)",
          "Get security certifications (CEH, Security+)",
          "Participate in CTF competitions"
        ],
        resources: [
          { name: "Cybrary", url: "https://www.cybrary.it/", type: "Platform" },
          { name: "TryHackMe", url: "https://tryhackme.com/", type: "Platform" },
          { name: "Hack The Box", url: "https://www.hackthebox.com/", type: "Platform" }
        ],
        certifications: ["CEH", "Security+", "CISSP"],
        jobPortals: ["CyberSecJobs", "InfoSec Jobs", "LinkedIn Security Jobs"],
        color: "#84cc16",
        gradient: "linear-gradient(135deg, #84cc16, #65a30d)"
      },
      
      // Cloud Engineering
      {
        id: 5,
        title: "Cloud Solutions Architect",
        match: calculateMatch(["Cloud Computing", "AWS", "DevOps"], ["Software Dev"], getLevelMultiplier(experienceLevel, "Advanced")),
        salary: getSalaryRange(experienceLevel, [130, 220]),
        demand: "Very High",
        growth: "+42%",
        timeline: "9-15 months",
        skillsNeeded: getNeededSkills(["Cloud Computing", "AWS"], ["Terraform", "Kubernetes", "CI/CD", "Microservices", "Serverless"]),
        interests: ["Software Dev", "Fintech"],
        description: "Design and implement scalable cloud infrastructure.",
        icon: Cloud,
        companies: ["Amazon", "Microsoft", "Google", "IBM", "Oracle"],
        roadmapSteps: [
          "Get AWS/Azure/GCP certifications",
          "Master infrastructure as code (Terraform)",
          "Learn container orchestration (Kubernetes)",
          "Study microservices architecture",
          "Learn CI/CD pipeline design",
          "Master cloud security best practices",
          "Design scalable cloud architectures"
        ],
        resources: [
          { name: "A Cloud Guru", url: "https://acloudguru.com/", type: "Platform" },
          { name: "AWS Training", url: "https://aws.amazon.com/training/", type: "Platform" },
          { name: "Google Cloud Skills", url: "https://cloud.google.com/training", type: "Platform" }
        ],
        certifications: ["AWS Solutions Architect", "Google Cloud Architect", "Azure Solutions Architect"],
        jobPortals: ["LinkedIn Cloud Jobs", "Indeed Cloud", "AWS Jobs"],
        color: "#f59e0b",
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
      },
      
      // Game Development
      {
        id: 6,
        title: "Game Developer",
        match: calculateMatch(["C++", "Game Design"], ["Gaming"], getLevelMultiplier(experienceLevel, "Intermediate")),
        salary: getSalaryRange(experienceLevel, [70, 150]),
        demand: "Moderate",
        growth: "+18%",
        timeline: "12-24 months",
        skillsNeeded: getNeededSkills(["C++", "Game Design"], ["Unity", "Unreal Engine", "3D Math", "Graphics", "Physics"]),
        interests: ["Gaming"],
        description: "Create interactive gaming experiences and simulations.",
        icon: Gamepad2,
        companies: ["Epic Games", "Activision", "EA", "Ubisoft", "Nintendo"],
        roadmapSteps: [
          "Master C++ programming and memory management",
          "Learn game engines (Unity/Unreal)",
          "Study 3D mathematics and graphics",
          "Learn game physics and AI",
          "Study multiplayer networking",
          "Learn optimization techniques",
          "Build complete game projects"
        ],
        resources: [
          { name: "Unity Learn", url: "https://learn.unity.com/", type: "Platform" },
          { name: "Unreal Online Learning", url: "https://www.unrealengine.com/en-US/onlinelearning-courses", type: "Platform" },
          { name: "GameDev.tv", url: "https://www.gamedev.tv/", type: "Platform" }
        ],
        certifications: ["Unity Certified Developer", "Unreal Engine Certification"],
        jobPortals: ["GameDev Jobs", "LinkedIn Game Jobs", "Indeed Game Development"],
        color: "#f97316",
        gradient: "linear-gradient(135deg, #f97316, #ea580c)"
      },
      
      // UI/UX Design
      {
        id: 7,
        title: "UI/UX Designer",
        match: calculateMatch(["UI/UX Design", "Graphic Design"], ["Product Management"], getLevelMultiplier(experienceLevel, "Beginner")),
        salary: getSalaryRange(experienceLevel, [80, 140]),
        demand: "High",
        growth: "+22%",
        timeline: "6-12 months",
        skillsNeeded: getNeededSkills(["UI/UX Design"], ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"]),
        interests: ["Product Management"],
        description: "Create intuitive and beautiful user experiences.",
        icon: Palette,
        companies: ["Apple", "Google", "Figma", "Adobe", "Airbnb"],
        roadmapSteps: [
          "Master design tools (Figma, Adobe Creative Suite)",
          "Learn user research methodologies",
          "Study color theory and typography",
          "Learn prototyping and wireframing",
          "Study accessibility standards",
          "Build design portfolio",
          "Learn design system creation"
        ],
        resources: [
          { name: "Figma Academy", url: "https://www.figma.com/resources/learn/", type: "Platform" },
          { name: "Interaction Design Foundation", url: "https://www.interaction-design.org/", type: "Platform" },
          { name: "Nielsen Norman Group", url: "https://www.nngroup.com/", type: "Resources" }
        ],
        certifications: ["Google UX Design", "NN/g UX Certification"],
        jobPortals: ["Dribbble Jobs", "Behance Jobs", "LinkedIn Design Jobs"],
        color: "#ec4899",
        gradient: "linear-gradient(135deg, #ec4899, #db2777)"
      },
      
      // Mobile Development
      {
        id: 8,
        title: "Mobile App Developer",
        match: calculateMatch(["React Native", "JavaScript"], ["Software Dev"], getLevelMultiplier(experienceLevel, "Intermediate")),
        salary: getSalaryRange(experienceLevel, [90, 160]),
        demand: "High",
        growth: "+28%",
        timeline: "8-14 months",
        skillsNeeded: getNeededSkills(["React Native", "JavaScript"], ["iOS Development", "Android Development", "Native Modules", "App Store"]),
        interests: ["Software Dev", "Fintech"],
        description: "Build cross-platform mobile applications.",
        icon: Smartphone,
        companies: ["Apple", "Google", "Meta", "Uber", "Spotify"],
        roadmapSteps: [
          "Master React Native framework",
          "Learn iOS/Android native development",
          "Study mobile UI/UX best practices",
          "Learn mobile security",
          "Master state management",
          "Learn app store deployment",
          "Build and publish mobile apps"
        ],
        resources: [
          { name: "React Native Docs", url: "https://reactnative.dev/docs/getting-started", type: "Documentation" },
          { name: "iOS Dev", url: "https://developer.apple.com/", type: "Platform" },
          { name: "Android Dev", url: "https://developer.android.com/", type: "Platform" }
        ],
        certifications: ["Google Associate Android Developer", "Apple iOS Development"],
        jobPortals: ["LinkedIn Mobile Jobs", "Indeed Mobile Dev", "AngelList"],
        color: "#3b82f6",
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
      }
    ];

    // Filter paths based on user profile
    const filteredPaths = allPaths
      .filter(path => path.match > 60)
      .sort((a, b) => b.match - a.match) // Sort by match score
      .slice(0, 1); // Take top 1

    return filteredPaths.length > 0 ? filteredPaths : getDefaultPaths(analysisData);
  };

  // Helper functions
  const getLevelMultiplier = (userLevel, pathLevel) => {
    const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const userIndex = levels.indexOf(userLevel);
    const pathIndex = levels.indexOf(pathLevel);
    
    if (userIndex >= pathIndex) return 1.2; // User has enough experience
    if (pathIndex - userIndex === 1) return 1.0; // One level difference
    return 0.8; // More than one level difference
  };

  const getSalaryRange = (experienceLevel, baseRange) => {
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

  const getNeededSkills = (userSkills, additionalSkills) => {
    // Filter out skills user already has
    return additionalSkills.filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).slice(0, 4);
  };

  const getDefaultPaths = (analysisData) => {
    const skill = (analysisData?.selectedSkills && analysisData.selectedSkills[0]) || "General";
    const interest = (analysisData?.selectedInterests && analysisData.selectedInterests[0]) || "Technology";
    
    return [
      {
        id: "default-1",
        title: `${skill} Specialist`,
        match: 85,
        salary: "$85k - $130k",
        demand: "Very High",
        growth: "+24%",
        timeline: "6-12 months",
        skillsNeeded: [skill, "System Design", "Problem Solving", "Teamwork"],
        description: `Become a specialist in ${skill} and build advanced ${interest} applications.`,
        icon: Code,
        companies: ["Google", "Meta", "Amazon", "Local Tech Leaders"],
        roadmapSteps: [
          `Master fundamental ${skill} concepts`,
          `Build practical projects using ${skill}`,
          `Learn industry standard tools for ${interest}`,
          "Optimize your portfolio",
          "Apply for relevant roles"
        ],
        resources: [
          { name: "Online Learning", url: "https://udemy.com", type: "Platform" },
          { name: "Industry Docs", url: "https://google.com", type: "Resource" }
        ],
        certifications: [`${skill} Professional Certification`],
        jobPortals: ["LinkedIn", "Indeed"],
        color: "#6d5dfc",
        gradient: "linear-gradient(135deg, #6d5dfc, #764ba2)"
      }
    ];
  };

  // Function to fetch courses from backend API
  const fetchRecommendedCourses = async (skills) => {
    if (!skills || skills.length === 0) return;
    
    setCoursesLoading(true);
    try {
      const query = skills.join(" ");
      const response = await fetch(`http://localhost:5000/api/courses/search-courses?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data && data.results) {
        // Map Udemy/Fallback API results to UI format
        const mappedCourses = data.results.map(course => ({
          id: course.id,
          title: course.title,
          provider: course.visible_instructors && course.visible_instructors[0] ? course.visible_instructors[0].display_name : (course.provider || "Udemy"),
          rating: course.avg_rating || 4.5,
          students: course.num_subscribers || (Math.floor(Math.random() * 50000) + 10000),
          price: course.price || "Check Price",
          url: (course.url && typeof course.url === 'string' && course.url.startsWith('http')) ? course.url : (course.url ? `https://www.udemy.com${course.url}` : "https://www.udemy.com"),
          image: course.image_480x270 || "https://via.placeholder.com/300x169/161b33/ffffff?text=Course",
          description: course.headline || `Complete ${course.title} course`,
          level: course.instructional_level_simple || course.level || "All Levels",
          category: "Technology",
          skills: skills.slice(0, 3)
        }));
        setCourses(mappedCourses);
      } else {
        setCourses(getSampleCourses(skills));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses(getSampleCourses(skills)); // Fallback to sample data on error
    } finally {
      setCoursesLoading(false);
    }
  };

  const getSampleCourses = (skills) => {
    const skillCategories = {
      "React": "Web Development",
      "JavaScript": "Web Development",
      "Python": "Data Science",
      "AI/ML": "Machine Learning",
      "SQL": "Database",
      "Cloud Computing": "Cloud",
      "UI/UX Design": "Design",
      "C++": "Game Development",
      "Security": "Cybersecurity"
    };

    const allSampleCourses = [
      {
        id: 1,
        title: "Complete React Developer 2024",
        provider: "Udemy",
        rating: 4.7,
        students: 124500,
        price: "$94.99",
        url: "https://www.udemy.com/course/complete-react-developer-zero-to-mastery/",
        image: "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
        description: "Become a Senior React Developer. Build a massive E-commerce app with Redux, Hooks, GraphQL, Stripe, Firebase",
        level: "Intermediate",
        category: "Web Development",
        skills: ["React", "JavaScript", "Redux", "Next.js"]
      },
      {
        id: 2,
        title: "Python for Data Science and Machine Learning",
        provider: "Coursera",
        rating: 4.6,
        students: 234000,
        price: "Free",
        url: "https://www.coursera.org/specializations/data-science-python",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/fa/6926005ea411e6b5c5b3c8c6e8e8c8/logo2.png",
        description: "Learn to use Python for data analysis, visualization, and machine learning",
        level: "Beginner",
        category: "Data Science",
        skills: ["Python", "Data Science", "Machine Learning", "Pandas"]
      },
      {
        id: 3,
        title: "AWS Certified Solutions Architect",
        provider: "AWS Training",
        rating: 4.8,
        students: 187000,
        price: "$129.99",
        url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/",
        image: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        description: "Pass the AWS Certified Solutions Architect Associate Exam. Complete AWS Certification preparation!",
        level: "Advanced",
        category: "Cloud",
        skills: ["AWS", "Cloud Computing", "DevOps", "Terraform"]
      },
      {
        id: 4,
        title: "UI/UX Design Specialization",
        provider: "Coursera",
        rating: 4.5,
        students: 89000,
        price: "Free",
        url: "https://www.coursera.org/specializations/ui-ux-design",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/fa/6926005ea411e6b5c5b3c8c6e8e8c8/logo2.png",
        description: "Design high-impact user experiences. Research, design, and prototype effective, visually-driven websites and apps.",
        level: "Beginner",
        category: "Design",
        skills: ["UI/UX", "Design", "Figma", "Adobe XD"]
      },
      {
        id: 5,
        title: "Machine Learning by Andrew Ng",
        provider: "Stanford/Coursera",
        rating: 4.9,
        students: 4500000,
        price: "Free",
        url: "https://www.coursera.org/learn/machine-learning",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072311233ff5d4/Machine-Learning-Stanford.png",
        description: "Machine learning is the science of getting computers to act without being explicitly programmed.",
        level: "Intermediate",
        category: "Machine Learning",
        skills: ["Machine Learning", "AI", "Python", "TensorFlow"]
      },
      {
        id: 6,
        title: "The Complete Ethical Hacking Course",
        provider: "Udemy",
        rating: 4.7,
        students: 156000,
        price: "$89.99",
        url: "https://www.udemy.com/course/ethical-hacking/",
        image: "https://img-c.udemycdn.com/course/480x270/1499416_9eac_2.jpg",
        description: "Become an ethical hacker that can hack computer systems like black hat hackers and secure them like security experts.",
        level: "Intermediate",
        category: "Cybersecurity",
        skills: ["Security", "Ethical Hacking", "Network Security", "Kali Linux"]
      },
      {
        id: 7,
        title: "Unity Game Development",
        provider: "Udemy",
        rating: 4.6,
        students: 98000,
        price: "$84.99",
        url: "https://www.udemy.com/course/unitycourse/",
        image: "https://img-c.udemycdn.com/course/480x270/1328572_b05d_5.jpg",
        description: "Learn Unity game development & C# by creating your first 2D & 3D games for web, mobile & desktop.",
        level: "Beginner",
        category: "Game Development",
        skills: ["Unity", "C#", "Game Development", "3D Graphics"]
      },
      {
        id: 8,
        title: "React Native - The Practical Guide",
        provider: "Udemy",
        rating: 4.7,
        students: 112000,
        price: "$74.99",
        url: "https://www.udemy.com/course/react-native-the-practical-guide/",
        image: "https://img-c.udemycdn.com/course/480x270/959700_ec5c_4.jpg",
        description: "Use React Native and your React knowledge to build native iOS and Android Apps - incl. Push Notifications, Hooks, Redux",
        level: "Intermediate",
        category: "Mobile Development",
        skills: ["React Native", "JavaScript", "Mobile Development", "iOS/Android"]
      }
    ];

    // Filter courses based on user skills
    if (!skills || skills.length === 0) return allSampleCourses.slice(0, 6);
    
    const filtered = allSampleCourses.filter(course => 
      skills.some(skill => {
        const category = skillCategories[skill];
        return course.skills.some(courseSkill => 
          courseSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(courseSkill.toLowerCase()) ||
          course.category === category
        );
      })
    );

    // If we couldn't find good matches, just return some random courses so the UI isn't empty
    if (filtered.length < 3) {
      return [...allSampleCourses].sort(() => 0.5 - Math.random()).slice(0, 6);
    }
    
    return filtered.slice(0, 6);
  };

  const handleViewRoadmap = (path) => {
    setSelectedRoadmap(path);
    setShowRoadmapModal(true);
  };

  const handleBrowseCourses = () => {
    navigate("/courses", { 
      state: { 
        skills: analysis?.selectedSkills || [],
        interests: analysis?.selectedInterests || [],
        level: analysis?.experienceLevel || "Beginner"
      }
    });
  };

  const handleEnrollCourse = (course) => {
    window.open(course.url, '_blank');
    
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/courses/enroll", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courseId: course.id,
        courseTitle: course.title,
        provider: course.provider
      })
    }).catch(console.error);
  };

  const closeRoadmapModal = () => {
    setShowRoadmapModal(false);
    setSelectedRoadmap(null);
  };

  const handleGoToAnalysis = () => {
    navigate("/analysis");
  };

  // Show loading while checking for analysis
  if (loading) {
    return (
      <PageLayout>
        <div style={styles.loadingContainer}>
          <Loader2 size={48} style={styles.spinner} />
          <p style={styles.loadingText}>Checking your profile...</p>
        </div>
      </PageLayout>
    );
  }

  // If user hasn't selected skills and interests, show nothing or minimal message
  if (!hasSelectedSkills) {
    return (
      <PageLayout>
        <div style={styles.pageWrapper}>
          <div style={styles.emptyStateContainer}>
            <div style={styles.emptyStateContent}>
              <div style={styles.emptyStateIcon}>
                <AlertCircle size={64} color="#6d5dfc" />
              </div>
              <h2 style={styles.emptyStateTitle}>No Analysis Found</h2>
              <p style={styles.emptyStateText}>
                You haven't completed your skill analysis yet. Please select your skills and interests first to get personalized career recommendations.
              </p>
              <button 
                onClick={handleGoToAnalysis}
                style={styles.emptyStateButton}
              >
                <Sparkles size={20} /> Go to Analysis
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Only show full recommendations if user has selected skills, interests, and experience
  return (
    <PageLayout>
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          
          <div style={styles.header}>
            <button 
              onClick={() => navigate("/dashboard")} 
              style={styles.backBtn}
            >
              <ArrowLeft size={18} /> BACK TO DASHBOARD
            </button>
            
            <h1 style={styles.mainTitle}>AI CAREER ROADMAP</h1>
            <p style={styles.subtitle}>Personalized career paths generated from your unique profile</p>
            
            {analysis && (
              <div style={styles.profileSummary}>
                <span style={styles.profileItem}>
                  <strong>Skills:</strong> {analysis.selectedSkills?.slice(0, 3).join(", ")}
                  {analysis.selectedSkills?.length > 3 && "..."}
                </span>
                <span style={styles.profileItem}>
                  <strong>Interests:</strong> {analysis.selectedInterests?.slice(0, 2).join(", ")}
                </span>
                <span style={styles.profileItem}>
                  <strong>Level:</strong> {analysis.experienceLevel}
                </span>
              </div>
            )}
          </div>

          <div style={styles.insightHeader}>
            <div style={styles.insightBadge}>
              <Sparkles size={16} /> {careerPaths.length} AI-Verified Paths Found
            </div>
            <p style={styles.personalizedText}>
              These career paths are personalized based on your unique combination of skills and interests
            </p>
          </div>

          <div style={styles.grid}>
            {careerPaths.map((path) => {
              const PathIcon = path.icon || Code;
              return (
                <div key={path.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.titleSection}>
                      <div style={{...styles.iconBox, color: "#6d5dfc", marginBottom: "12px"}}>
                        <PathIcon size={24} />
                      </div>
                      <h3 style={styles.pathTitle}>{path.title}</h3>
                      <p style={styles.pathDesc}>{path.description}</p>
                    </div>
                    <div style={styles.matchBadge}>
                      <Star size={14} fill="#eab308" color="#eab308" />
                      {path.match}% Match
                    </div>
                  </div>

                  <div style={styles.statsRow}>
                    <div style={styles.statItem}>
                      <div style={{...styles.iconBox, color: "#10b981"}}>
                        <DollarSign size={18} />
                      </div>
                      <span>{path.salary}</span>
                    </div>
                    <div style={styles.statItem}>
                      <div style={{...styles.iconBox, color: "#ec4899"}}>
                        <TrendingUp size={18} />
                      </div>
                      <span>{path.demand} Demand</span>
                    </div>
                    <div style={styles.statItem}>
                      <div style={{...styles.iconBox, color: "#3b82f6"}}>
                        <Clock size={18} />
                      </div>
                      <span>{path.timeline}</span>
                    </div>
                  </div>

                  <div style={styles.skillSection}>
                    <p style={styles.skillLabel}>Recommended Skills to Learn:</p>
                    <div style={styles.skillTags}>
                      {(path.skillsNeeded || []).map(s => (
                        <span key={s} style={styles.tag}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleViewRoadmap(path)}
                    style={styles.actionBtn}
                  >
                    View Detailed Roadmap <ChevronRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Recommended Courses Section */}
          <div style={styles.coursesSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <BookOpen size={24} /> Recommended Courses
              </h2>
              <p style={styles.sectionSubtitle}>Personalized based on your skills and interests</p>
            </div>
            
            {coursesLoading ? (
              <div style={styles.loadingCourses}>
                <Loader2 size={32} style={styles.spinner} />
                <p>Finding the best courses for you...</p>
              </div>
            ) : courses.length > 0 ? (
              <div style={styles.coursesGrid}>
                {courses.map(course => (
                  <div key={course.id} style={styles.courseCard}>
                    <div style={styles.courseImage}>
                      <img 
                        src={course.image} 
                        alt={course.title}
                        style={styles.courseImg}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x169/161b33/ffffff?text=${course.provider}`;
                        }}
                      />
                      <div style={styles.courseProvider}>
                        {course.provider}
                      </div>
                    </div>
                    <div style={styles.courseContent}>
                      <h4 style={styles.courseTitle}>{course.title}</h4>
                      <p style={styles.courseDescription}>
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...` 
                          : course.description}
                      </p>
                      
                      <div style={styles.courseMeta}>
                        <span style={styles.courseRating}>
                          <Star size={14} fill="#eab308" color="#eab308" /> 
                          {course.rating}
                        </span>
                        <span style={styles.courseStudents}>
                          {course.students.toLocaleString()} students
                        </span>
                        <span style={styles.courseLevel}>
                          {course.level}
                        </span>
                      </div>
                      
                      <div style={styles.courseSkills}>
                        {course.skills?.slice(0, 3).map(skill => (
                          <span key={skill} style={styles.skillChip}>{skill}</span>
                        ))}
                      </div>
                      
                      <div style={styles.courseFooter}>
                        <span style={styles.coursePrice}>
                          {course.price}
                        </span>
                        <a 
                          href={course.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            // If we don't have a valid url, don't try to navigate
                            if (!course.url || course.url === "#") e.preventDefault();
                            
                            // Optional: tracking enroll call
                            const token = localStorage.getItem("token");
                            if (token) {
                              fetch("http://localhost:5000/api/courses/enroll", {
                                method: "POST",
                                headers: {
                                  "Authorization": `Bearer ${token}`,
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                  courseId: course.id,
                                  courseTitle: course.title,
                                  provider: course.provider
                                })
                              }).catch(() => {});
                            }
                          }}
                          style={{...styles.enrollBtn, textDecoration: "none"}}
                        >
                          Enroll Now <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noCourses}>
                <p>No courses found. Try adjusting your skills.</p>
              </div>
            )}
          </div>

          <div style={styles.upskillSection}>
            <div style={styles.upskillContent}>
              <h3 style={styles.upskillTitle}>Ready to accelerate?</h3>
              <p style={styles.upskillText}>We found courses to help you hit that 100% match score.</p>
            </div>
            <button 
              onClick={handleBrowseCourses}
              style={styles.courseBtn}
            >
              <BookOpen size={18} /> Browse All Courses
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Roadmap Modal */}
      {showRoadmapModal && selectedRoadmap && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleSection}>
                <div style={{...styles.modalIcon, background: selectedRoadmap.gradient}}>
                  {selectedRoadmap.icon ? React.createElement(selectedRoadmap.icon, { size: 24 }) : <Code size={24} />}
                </div>
                <div>
                  <h2 style={styles.modalTitle}>{selectedRoadmap.title}</h2>
                  <p style={styles.modalSubtitle}>{selectedRoadmap.description}</p>
                </div>
              </div>
              <button onClick={closeRoadmapModal} style={styles.closeButton}>
                <X size={24} />
              </button>
            </div>

            {/* Quick Stats */}
            <div style={styles.modalStats}>
              <div style={styles.modalStat}>
                <div style={styles.modalStatIcon}><DollarSign size={20} /></div>
                <div>
                  <div style={styles.modalStatValue}>{selectedRoadmap.salary}</div>
                  <div style={styles.modalStatLabel}>Salary Range</div>
                </div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatIcon}><TrendingUp size={20} /></div>
                <div>
                  <div style={styles.modalStatValue}>{selectedRoadmap.demand}</div>
                  <div style={styles.modalStatLabel}>Market Demand</div>
                </div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatIcon}><Clock size={20} /></div>
                <div>
                  <div style={styles.modalStatValue}>{selectedRoadmap.timeline}</div>
                  <div style={styles.modalStatLabel}>Timeline</div>
                </div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatIcon}><Star size={20} /></div>
                <div>
                  <div style={styles.modalStatValue}>{selectedRoadmap.match}%</div>
                  <div style={styles.modalStatLabel}>Your Match</div>
                </div>
              </div>
            </div>

            <div style={styles.modalGrid}>
              {/* Left Column */}
              <div style={styles.leftColumn}>
                {/* Roadmap Steps */}
                <div style={styles.modalSection}>
                  <div style={styles.sectionHeader}>
                    <Rocket size={20} />
                    <h3 style={styles.sectionTitle}>Learning Roadmap</h3>
                  </div>
                  <div style={styles.roadmapSteps}>
                    {(selectedRoadmap.roadmapSteps || []).map((step, index) => (
                      <div key={index} style={styles.roadmapStep}>
                        <div style={styles.stepNumber}>{index + 1}</div>
                        <div style={styles.stepContent}>
                          <p style={styles.stepText}>{step}</p>
                          <div style={styles.stepMeta}>
                            <span style={styles.stepDuration}>~2-4 weeks</span>
                            <span style={styles.stepDifficulty}>
                              {index < 2 ? "Beginner" : index < 4 ? "Intermediate" : "Advanced"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills to Learn */}
                <div style={styles.modalSection}>
                  <div style={styles.sectionHeader}>
                    <Target size={20} />
                    <h3 style={styles.sectionTitle}>Skills to Master</h3>
                  </div>
                  <div style={styles.skillsGrid}>
                    {(selectedRoadmap.skillsNeeded || []).map((skill, index) => (
                      <div key={index} style={styles.skillItem}>
                        <CheckCircle size={16} style={{color: "#10b981", marginRight: "8px"}} />
                        <span style={styles.skillText}>{skill}</span>
                        <span style={styles.skillPriority}>
                          {index < 2 ? "High Priority" : "Medium Priority"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={styles.rightColumn}>
                {/* Top Companies */}
                <div style={styles.modalSection}>
                  <div style={styles.sectionHeader}>
                    <Building size={20} />
                    <h3 style={styles.sectionTitle}>Top Companies Hiring</h3>
                  </div>
                  <div style={styles.companiesGrid}>
                    {(selectedRoadmap.companies || []).map((company, index) => (
                      <div key={index} style={styles.companyItem}>
                        <div style={styles.companyLogo}>
                          {company.charAt(0)}
                        </div>
                        <span style={styles.companyName}>{company}</span>
                        <a href="#" style={styles.companyLink}>
                          <Linkedin size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Resources */}
                <div style={styles.modalSection}>
                  <div style={styles.sectionHeader}>
                    <BookOpen size={20} />
                    <h3 style={styles.sectionTitle}>Learning Resources</h3>
                  </div>
                  <div style={styles.resourcesList}>
                    {(selectedRoadmap.resources || []).map((resource, index) => (
                      <a 
                        key={index} 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={styles.resourceItem}
                      >
                        <div style={styles.resourceIcon}>
                          {resource.type === "Course" ? <FileText size={16} /> : 
                           resource.type === "Platform" ? <Globe size={16} /> : 
                           <MessageSquare size={16} />}
                        </div>
                        <div style={styles.resourceInfo}>
                          <span style={styles.resourceName}>{resource.name}</span>
                          <span style={styles.resourceType}>{resource.type}</span>
                        </div>
                        <ExternalLink size={16} style={{color: "#94a3b8"}} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div style={styles.modalSection}>
                  <div style={styles.sectionHeader}>
                    <Award size={20} />
                    <h3 style={styles.sectionTitle}>Recommended Certifications</h3>
                  </div>
                  <div style={styles.certificationsList}>
                    {(selectedRoadmap.certifications || []).map((cert, index) => (
                      <div key={index} style={styles.certificationItem}>
                        <Award size={16} style={{color: "#eab308", marginRight: "8px"}} />
                        <span style={styles.certificationText}>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.modalActions}>
              <button 
                onClick={() => {
                  navigate("/courses", { 
                    state: { 
                      skills: selectedRoadmap.skillsNeeded,
                      interests: analysis?.selectedInterests || [],
                      level: analysis?.experienceLevel || "Beginner"
                    }
                  });
                  closeRoadmapModal();
                }}
                style={{...styles.modalActionBtn, ...styles.primaryActionBtn}}
              >
                <BookOpen size={18} />
                Start Learning Path
              </button>
              <button 
                onClick={() => {
                  // Save roadmap to user's saved paths
                  const token = localStorage.getItem("token");
                  fetch("http://localhost:5000/api/analysis/save-roadmap", {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      title: selectedRoadmap.title,
                      roadmap: selectedRoadmap
                    })
                  }).catch(console.error);
                  
                  alert("Roadmap saved to your profile!");
                }}
                style={{...styles.modalActionBtn, ...styles.secondaryActionBtn}}
              >
                <Star size={18} />
                Save Roadmap
              </button>
              <button 
                onClick={() => {
                  // Share functionality
                  navigator.clipboard.writeText(
                    `Check out this career roadmap for ${selectedRoadmap.title}: ${window.location.href}`
                  );
                  alert("Link copied to clipboard!");
                }}
                style={{...styles.modalActionBtn, ...styles.tertiaryActionBtn}}
              >
                <MessageSquare size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#05070a",
    width: "100%",
    margin: 0,
    padding: "40px 0"
  },
  container: { 
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px"
  },
  header: {
    textAlign: "center",
    marginBottom: "50px"
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
    "&:hover": {
      background: "rgba(16, 185, 129, 0.2)",
      transform: "translateY(-2px)"
    }
  },
  mainTitle: {
    fontSize: "48px",
    fontWeight: "900",
    background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Inter', sans-serif",
    margin: "0 0 10px 0",
  },
  subtitle: { color: "#94a3b8", fontSize: "16px", margin: "0 0 20px 0" },
  profileSummary: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap",
    marginTop: "20px"
  },
  profileItem: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    color: "#cbd5e1",
    fontSize: "14px"
  },
  insightHeader: { 
    marginBottom: "24px", 
    textAlign: "center" 
  },
  insightBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    borderRadius: "100px",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "12px"
  },
  personalizedText: {
    color: "#94a3b8",
    fontSize: "14px",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.5"
  },
  grid: { display: "flex", flexDirection: "column", gap: "24px", marginBottom: "50px" },
  card: {
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)"
    }
  },
  cardHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    marginBottom: "24px" 
  },
  titleSection: {
    flex: 1
  },
  pathTitle: { 
    fontSize: "24px", 
    fontWeight: "800", 
    color: "#fff", 
    margin: "0 0 8px 0" 
  },
  pathDesc: { 
    color: "#94a3b8", 
    fontSize: "14px", 
    marginTop: "6px", 
    maxWidth: "80%" 
  },
  matchBadge: {
    background: "rgba(234, 179, 8, 0.1)",
    color: "#eab308",
    padding: "8px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid rgba(234, 179, 8, 0.2)",
    height: "fit-content"
  },
  statsRow: { 
    display: "flex", 
    gap: "32px", 
    marginBottom: "24px",
    flexWrap: "wrap" 
  },
  statItem: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    color: "#e2e8f0", 
    fontSize: "15px", 
    fontWeight: "600" 
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  skillSection: { marginBottom: "28px" },
  skillLabel: { 
    fontSize: "12px", 
    color: "#6d5dfc", 
    textTransform: "uppercase", 
    letterSpacing: "1.5px", 
    marginBottom: "14px", 
    fontWeight: "800" 
  },
  skillTags: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tag: {
    padding: "8px 16px",
    background: "#05070a",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500"
  },
  actionBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.03)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-2px)"
    }
  },
  coursesSection: {
    margin: "60px 0"
  },
  sectionHeader: {
    marginBottom: "30px",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 10px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  sectionSubtitle: {
    color: "#94a3b8",
    fontSize: "16px"
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "30px"
  },
  courseCard: {
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "transform 0.3s ease",
    cursor: "pointer"
  },
  courseImage: {
    position: "relative",
    height: "160px",
    overflow: "hidden"
  },
  courseImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  courseProvider: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600"
  },
  courseContent: {
    padding: "20px"
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 10px 0",
    lineHeight: "1.3"
  },
  courseDescription: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "15px",
    lineHeight: "1.5"
  },
  courseMeta: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    flexWrap: "wrap"
  },
  courseRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#eab308",
    fontSize: "14px",
    fontWeight: "600"
  },
  courseStudents: {
    color: "#94a3b8",
    fontSize: "14px"
  },
  courseLevel: {
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "600"
  },
  courseSkills: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  skillChip: {
    padding: "4px 8px",
    background: "rgba(109, 93, 252, 0.1)",
    color: "#a78bfa",
    borderRadius: "6px",
    fontSize: "12px"
  },
  courseFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  coursePrice: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff"
  },
  enrollBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #6d5dfc, #4a3aff)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #5a4bff, #3a2aff)",
      transform: "translateY(-2px)"
    }
  },
  upskillSection: {
    marginTop: "48px",
    background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
    borderRadius: "24px",
    padding: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px"
  },
  upskillTitle: { fontSize: "28px", fontWeight: "900", color: "#fff", margin: 0 },
  upskillText: { color: "rgba(255,255,255,0.9)", marginTop: "6px", fontSize: "16px" },
  courseBtn: {
    padding: "16px 32px",
    borderRadius: "14px",
    border: "none",
    background: "#fff",
    color: "#6d5dfc",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)"
    }
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#fff"
  },
  loadingCourses: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    color: "#94a3b8"
  },
  spinner: {
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  },
  loadingText: {
    fontSize: "18px",
    color: "#fff"
  },
  noCourses: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px"
  },
  
  // Empty State Styles - Minimal message when no skills/interests selected
  emptyStateContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    width: "100%"
  },
  emptyStateContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "32px",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    backdropFilter: "blur(12px)",
    maxWidth: "600px",
    margin: "0 auto"
  },
  emptyStateIcon: {
    width: "120px",
    height: "120px",
    background: "rgba(109, 93, 252, 0.1)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "32px",
    border: "2px solid rgba(109, 93, 252, 0.3)"
  },
  emptyStateTitle: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "16px",
    textAlign: "center",
    letterSpacing: "1px"
  },
  emptyStateText: {
    color: "#94a3b8",
    fontSize: "16px",
    textAlign: "center",
    marginBottom: "32px",
    lineHeight: "1.6",
    maxWidth: "450px"
  },
  emptyStateButton: {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #6d5dfc, #4a3aff)",
    border: "none",
    borderRadius: "14px",
    color: "#fff",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 30px rgba(109, 93, 252, 0.4)"
    }
  },

  // Modal Styles (keep all your existing modal styles here)
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
    animation: "fadeIn 0.3s ease"
  },
  modalContent: {
    background: "rgba(22, 27, 51, 0.95)",
    borderRadius: "24px",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    width: "100%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    animation: "slideUp 0.3s ease"
  },
  modalHeader: {
    padding: "32px 32px 24px 32px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px"
  },
  modalTitleSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    flex: 1
  },
  modalIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0
  },
  modalTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
    lineHeight: "1.2"
  },
  modalSubtitle: {
    color: "#94a3b8",
    fontSize: "16px",
    margin: 0,
    lineHeight: "1.5"
  },
  closeButton: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flexShrink: 0,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.2)"
    }
  },
  modalStats: {
    padding: "24px 32px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    background: "rgba(255, 255, 255, 0.02)"
  },
  modalStat: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  modalStatIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6d5dfc"
  },
  modalStatValue: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1"
  },
  modalStatLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
    fontWeight: "600"
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
    padding: "32px"
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  },
  modalSection: {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px"
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    margin: 0
  },
  roadmapSteps: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  roadmapStep: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start"
  },
  stepNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(109, 93, 252, 0.1)",
    border: "2px solid rgba(109, 93, 252, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    color: "#6d5dfc",
    flexShrink: 0
  },
  stepContent: {
    flex: 1
  },
  stepText: {
    color: "#e2e8f0",
    fontSize: "15px",
    margin: "0 0 8px 0",
    lineHeight: "1.5"
  },
  stepMeta: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "#94a3b8"
  },
  stepDuration: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  stepDifficulty: {
    padding: "2px 8px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "4px"
  },
  skillsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  skillItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  skillText: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    flex: 1
  },
  skillPriority: {
    fontSize: "12px",
    color: "#94a3b8",
    padding: "2px 8px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "4px"
  },
  companiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "12px"
  },
  companyItem: {
    padding: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.05)",
      transform: "translateY(-2px)"
    }
  },
  companyLogo: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(109, 93, 252, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6d5dfc",
    fontWeight: "700",
    fontSize: "14px"
  },
  companyName: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    flex: 1
  },
  companyLink: {
    color: "#94a3b8",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#6d5dfc"
    }
  },
  resourcesList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  resourceItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(109, 93, 252, 0.2)",
      transform: "translateX(4px)"
    }
  },
  resourceIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(109, 93, 252, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6d5dfc"
  },
  resourceInfo: {
    flex: 1
  },
  resourceName: {
    display: "block",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "2px"
  },
  resourceType: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8"
  },
  certificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  certificationItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  certificationText: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    flex: 1
  },
  modalActions: {
    padding: "24px 32px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  modalActionBtn: {
    flex: 1,
    minWidth: "180px",
    padding: "16px 24px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease"
  },
  primaryActionBtn: {
    background: "linear-gradient(135deg, #6d5dfc, #4a3aff)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 30px rgba(109, 93, 252, 0.4)"
    }
  },
  secondaryActionBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-2px)"
    }
  },
  tertiaryActionBtn: {
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    color: "#3b82f6",
    "&:hover": {
      background: "rgba(59, 130, 246, 0.15)",
      transform: "translateY(-2px)"
    }
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
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .courseCard:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    .actionBtn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .enrollBtn:hover {
      background: linear-gradient(135deg, #5a4bff, #3a2aff);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(styleSheet);
}