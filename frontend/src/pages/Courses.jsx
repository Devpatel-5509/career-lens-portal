import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import {
  ExternalLink,
  Loader2,
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Target,
  Award,
  Zap,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  Brain,
  Heart,
  HeartHandshake,
  Bookmark,
  Download,
  Video,
  FileText,
  BarChart3,
  Calendar,
  Tag,
  DollarSign,
  Shield,
  Clock3,
  TrendingDown,
  MessageSquare,
  Globe,
  X,
  Youtube,
  Link,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [view, setView] = useState("all"); // 'all' or 'saved'
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [durationFilter, setDurationFilter] = useState("all");
  const [certificationFilter, setCertificationFilter] = useState("all");
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Provider options
  const providers = [
    { id: "udemy", name: "Udemy", icon: "U" },
    { id: "coursera", name: "Coursera", icon: "C" },
    { id: "youtube", name: "YouTube", icon: "YT" },
    { id: "edx", name: "edX", icon: "E" },
    { id: "pluralsight", name: "Pluralsight", icon: "P" },
    { id: "linkedin", name: "LinkedIn Learning", icon: "LI" },
    { id: "skillshare", name: "Skillshare", icon: "S" },
    { id: "udacity", name: "Udacity", icon: "U" }
  ];

  // Get skills from navigation state or localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const stateSkills = location.state?.skills || [];
        const stateInterests = location.state?.interests || [];
        const stateLevel = location.state?.level || "";

        const savedData = localStorage.getItem("userAnalysis");
        let localStorageSkills = [];
        let localStorageInterests = [];
        let localStorageLevel = "";

        if (savedData) {
          const parsed = JSON.parse(savedData);
          localStorageSkills = parsed.selectedSkills || [];
          localStorageInterests = parsed.selectedInterests || [];
          localStorageLevel = parsed.experienceLevel || "";
        }

        const saved = localStorage.getItem("savedCourses");
        if (saved) {
          setSavedCourses(JSON.parse(saved));
        }

        const skills = stateSkills.length ? stateSkills : localStorageSkills;
        const interests = stateInterests.length ? stateInterests : localStorageInterests;
        const level = stateLevel || localStorageLevel;

        const allKeywords = [...skills, ...interests];
        if (level) allKeywords.push(level);

        setUserSkills(allKeywords);

        // Fetch live courses from all sources
        const allCourses = await fetchAllCourses(allKeywords, 1);

        if (Array.isArray(allCourses) && allCourses.length > 0) {
          setCourses(allCourses);
          setFilteredCourses(allCourses);
          setHasMore(allCourses.length >= 20);
        } else {
          // Fallback to sample courses if no real courses found
          const fallbackCourses = getFallbackCourses(allKeywords);
          setCourses(fallbackCourses);
          setFilteredCourses(fallbackCourses);
          setError("Using sample courses - API rate limits may be active");
        }

      } catch (error) {
        console.error("Error loading courses:", error);
        setError("Failed to fetch live courses. Showing sample data.");
        // Fallback to sample courses
        const fallbackCourses = getFallbackCourses([]);
        setCourses(fallbackCourses);
        setFilteredCourses(fallbackCourses);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.state]);

  // Fetch all courses from backend API
  const fetchAllCourses = async (keywords, pageNum) => {
    try {
      const query = keywords.length > 0 ? keywords.join(" ") : "programming";
      const response = await fetch(`http://localhost:5000/api/courses/search-courses?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        return data.results.map(course => ({
          id: course.id || Math.random().toString(36).substr(2, 9),
          title: course.title,
          description: course.headline || course.description || `Master ${course.title} with this complete course.`,
          image: course.image_480x270 || course.image_240x135 || 'https://img-c.udemycdn.com/course/480x270/placeholder.jpg',
          provider: 'Udemy',
          rating: course.avg_rating || 4.5,
          students: course.num_subscribers || Math.floor(Math.random() * 50000) + 10000,
          duration: course.content_info || `${Math.floor(Math.random() * 10) + 5} hours`,
          level: course.instructional_level_simple || 'All Levels',
          category: 'Technology',
          instructor: course.visible_instructors?.[0]?.display_name || 'Expert Instructor',
          skills: keywords.slice(0, 3),
          price: course.price || "$94.99",
          url: course.url ? (course.url.startsWith('http') ? course.url : `https://www.udemy.com${course.url}`) : 'https://www.udemy.com',
          hasCertificate: true,
          language: 'English',
          lastUpdated: '2024',
          lectures: course.num_published_lectures || 40,
          articles: 5,
          resources: 10,
          lifetimeAccess: true,
          mobileAccess: true,
          assignments: true,
          support: 'Instructor Q&A'
        }));
      }

      return getFallbackCourses(keywords);
    } catch (error) {
      console.error("Error fetching courses from backend:", error);
      return getFallbackCourses(keywords);
    }
  };

  // Removed individual frontend fetch functions as we now use the backend API

  // Fallback courses when APIs fail
  const getFallbackCourses = (keywords) => {
    const fallbackList = [
      // Web Development
      {
        id: 1,
        title: "The Complete 2024 Web Development Bootcamp",
        description: "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!",
        image: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg",
        provider: "Udemy",
        rating: 4.7,
        students: 456789,
        duration: "55 hours",
        level: "Beginner",
        category: "Web Development",
        instructor: "Dr. Angela Yu",
        skills: ["HTML", "CSS", "JavaScript", "Node.js", "React"],
        price: "$94.99",
        url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 365,
        articles: 100,
        resources: 50,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      },
      // Python
      {
        id: 2,
        title: "100 Days of Code: The Complete Python Pro Bootcamp",
        description: "Master Python by building 100 projects in 100 days. Learn data science, automation, web development, game development and more.",
        image: "https://img-c.udemycdn.com/course/480x270/2776760_f176_10.jpg",
        provider: "Udemy",
        rating: 4.8,
        students: 345678,
        duration: "64 hours",
        level: "Beginner",
        category: "Programming",
        instructor: "Dr. Angela Yu",
        skills: ["Python", "Data Science", "Automation", "Web Development"],
        price: "$94.99",
        url: "https://www.udemy.com/course/100-days-of-code/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 680,
        articles: 150,
        resources: 75,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      },
      // AI/ML
      {
        id: 3,
        title: "Machine Learning A-Z: AI, Python & R",
        description: "Learn to create Machine Learning Algorithms in Python and R from two data science experts. Includes templates.",
        image: "https://img-c.udemycdn.com/course/480x270/950390_270d_5.jpg",
        provider: "Udemy",
        rating: 4.6,
        students: 567890,
        duration: "44 hours",
        level: "Intermediate",
        category: "AI/ML",
        instructor: "Kirill Eremenko",
        skills: ["Python", "R", "Machine Learning", "Deep Learning", "AI"],
        price: "$89.99",
        url: "https://www.udemy.com/course/machinelearning/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 400,
        articles: 80,
        resources: 40,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      },
      // Data Science
      {
        id: 4,
        title: "IBM Data Science Professional Certificate",
        description: "Kickstart your career in data science. No prior experience required. Learn Python, SQL, data visualization, and machine learning.",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072311233ff5d4/Machine-Learning-Stanford.png",
        provider: "Coursera",
        rating: 4.7,
        students: 789012,
        duration: "12 months",
        level: "Beginner",
        category: "Data Science",
        instructor: "IBM",
        skills: ["Python", "SQL", "Data Science", "Machine Learning", "Data Visualization"],
        price: "Free",
        url: "https://www.coursera.org/professional-certificates/ibm-data-science",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 200,
        articles: 150,
        resources: 100,
        lifetimeAccess: false,
        mobileAccess: true,
        assignments: true,
        support: "Peer Support"
      },
      // AWS Cloud
      {
        id: 5,
        title: "AWS Certified Solutions Architect - Professional",
        description: "Pass the AWS Certified Solutions Architect Professional Exam. Complete AWS certification preparation course.",
        image: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        provider: "Udemy",
        rating: 4.8,
        students: 234567,
        duration: "35 hours",
        level: "Advanced",
        category: "Cloud",
        instructor: "Stephane Maarek",
        skills: ["AWS", "Cloud Computing", "DevOps", "Architecture"],
        price: "$129.99",
        url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 300,
        articles: 60,
        resources: 30,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      },
      // Cybersecurity
      {
        id: 6,
        title: "The Complete Ethical Hacking Course",
        description: "Become an ethical hacker that can hack computer systems like black hat hackers and secure them like security experts.",
        image: "https://img-c.udemycdn.com/course/480x270/1499416_9eac_2.jpg",
        provider: "Udemy",
        rating: 4.7,
        students: 345678,
        duration: "24 hours",
        level: "Intermediate",
        category: "Cybersecurity",
        instructor: "Zaid Sabih",
        skills: ["Ethical Hacking", "Network Security", "Penetration Testing", "Security"],
        price: "$89.99",
        url: "https://www.udemy.com/course/ethical-hacking/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 180,
        articles: 40,
        resources: 20,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      },
      // Game Development
      {
        id: 7,
        title: "Unreal Engine 5: The Complete Beginner's Course",
        description: "Learn video game development and how to create games with Unreal Engine 5. Learn C++ and Blueprints.",
        image: "https://img-c.udemycdn.com/course/480x270/2585270_8296_2.jpg",
        provider: "Udemy",
        rating: 4.7,
        students: 123456,
        duration: "30 hours",
        level: "Beginner",
        category: "Game Development",
        instructor: "David Nixon",
        skills: ["Unreal Engine", "C++", "Game Design", "3D Graphics"],
        price: "$84.99",
        url: "https://www.udemy.com/course/unreal-engine-5-the-complete-beginners-course/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 220,
        articles: 50,
        resources: 25,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      },
      // UI/UX Design
      {
        id: 8,
        title: "Google UX Design Professional Certificate",
        description: "Prepare for a career in UX design. No experience required. Learn design principles, Figma, and create a portfolio.",
        image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072311233ff5d4/Machine-Learning-Stanford.png",
        provider: "Coursera",
        rating: 4.8,
        students: 456789,
        duration: "6 months",
        level: "Beginner",
        category: "Design",
        instructor: "Google",
        skills: ["UI/UX", "Figma", "User Research", "Prototyping", "Design Systems"],
        price: "Free",
        url: "https://www.coursera.org/professional-certificates/google-ux-design",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 150,
        articles: 120,
        resources: 80,
        lifetimeAccess: false,
        mobileAccess: true,
        assignments: true,
        support: "Peer Support"
      },
      // YouTube - Free Course
      {
        id: 9,
        title: "Harvard CS50 - Full Computer Science Course",
        description: "This is CS50x, Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
        image: "https://i.ytimg.com/vi/8mAITcNt710/hqdefault.jpg",
        provider: "YouTube",
        rating: 4.9,
        students: 3456789,
        duration: "24 hours",
        level: "Beginner",
        category: "Computer Science",
        instructor: "Harvard University",
        skills: ["Computer Science", "C", "Python", "SQL", "Algorithms"],
        price: "Free",
        url: "https://www.youtube.com/playlist?list=PLhQjrBD2T3817j24-GogXmWqO5Q5VYy0V",
        hasCertificate: false,
        language: "English",
        lastUpdated: "2024",
        lectures: 120,
        articles: 0,
        resources: 0,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: false,
        support: "Comments Section"
      },
      // React
      {
        id: 10,
        title: "React - The Complete Guide 2024",
        description: "Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, and build powerful web apps.",
        image: "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
        provider: "Udemy",
        rating: 4.8,
        students: 567890,
        duration: "48 hours",
        level: "Intermediate",
        category: "Web Development",
        instructor: "Maximilian Schwarzmüller",
        skills: ["React", "JavaScript", "Next.js", "Redux", "Hooks"],
        price: "$94.99",
        url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
        hasCertificate: true,
        language: "English",
        lastUpdated: "2024",
        lectures: 500,
        articles: 120,
        resources: 60,
        lifetimeAccess: true,
        mobileAccess: true,
        assignments: true,
        support: "Instructor Q&A"
      }
    ];

    // Filter based on keywords if available
    if (keywords && keywords.length > 0) {
      return fallbackList.filter(course =>
        keywords.some(keyword =>
          course.title.toLowerCase().includes(keyword.toLowerCase()) ||
          course.description.toLowerCase().includes(keyword.toLowerCase()) ||
          course.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
        )
      ).slice(0, 12);
    }

    return fallbackList;
  };

  // Shuffle array for random order
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Load more courses
  const loadMoreCourses = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const moreCourses = await fetchAllCourses(userSkills, nextPage);

      if (moreCourses.length > 0) {
        setCourses(prev => [...prev, ...moreCourses]);
        setFilteredCourses(prev => [...prev, ...moreCourses]);
        setPage(nextPage);
        setHasMore(moreCourses.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more courses:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filter and sort courses
  useEffect(() => {
    let sourceCourses = view === "all" ? courses : savedCourses;
    if (!sourceCourses.length) {
      setFilteredCourses([]);
      return;
    }

    let filtered = [...sourceCourses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course =>
        course.category && course.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course =>
        course.level && course.level.toLowerCase().includes(selectedLevel.toLowerCase())
      );
    }

    // Apply provider filter
    if (selectedProviders.length > 0) {
      filtered = filtered.filter(course =>
        selectedProviders.includes(course.provider.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(course => {
      const priceStr = String(course.price || "0");
      const coursePrice = priceStr === "Free" ? 0 :
        parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      return coursePrice >= minPrice && coursePrice <= maxPrice;
    });

    // Apply duration filter
    if (durationFilter !== "all") {
      filtered = filtered.filter(course => {
        const hours = getDurationInHours(course.duration);
        switch (durationFilter) {
          case "short": return hours <= 5;
          case "medium": return hours > 5 && hours <= 20;
          case "long": return hours > 20;
          default: return true;
        }
      });
    }

    // Apply certification filter
    if (certificationFilter !== "all") {
      filtered = filtered.filter(course =>
        certificationFilter === "certified" ? course.hasCertificate : !course.hasCertificate
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          const priceA = a.price === "Free" ? 0 : parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = b.price === "Free" ? 0 : parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceA - priceB;

        case "price-high":
          const priceAHigh = a.price === "Free" ? 0 : parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceBHigh = b.price === "Free" ? 0 : parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceBHigh - priceAHigh;

        case "rating":
          return b.rating - a.rating;

        case "popularity":
          return b.students - a.students;

        case "duration-short":
          return getDurationInHours(a.duration) - getDurationInHours(b.duration);

        case "duration-long":
          return getDurationInHours(b.duration) - getDurationInHours(a.duration);

        default: // relevance
          if (userSkills.length > 0) {
            const scoreA = calculateRelevanceScore(a, userSkills);
            const scoreB = calculateRelevanceScore(b, userSkills);
            return scoreB - scoreA;
          }
          return b.rating - a.rating;
      }
    });

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, view === "all" ? courses : savedCourses, minPrice, maxPrice, durationFilter, certificationFilter, userSkills, selectedProviders]);

  const getDurationInHours = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const calculateRelevanceScore = (course, skills) => {
    let score = 0;

    skills.forEach(skill => {
      if (course.title.toLowerCase().includes(skill.toLowerCase())) score += 3;
      if (course.description.toLowerCase().includes(skill.toLowerCase())) score += 2;
      if (course.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))) score += 4;
      if (course.category?.toLowerCase().includes(skill.toLowerCase())) score += 2;
    });

    score += course.rating * 2;
    score += Math.log(course.students + 1);

    return score;
  };

  const handleCourseClick = (courseId, courseUrl) => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/courses/track-view", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ courseId, courseUrl })
      }).catch(console.error);
    }

    window.open(courseUrl, '_blank');
  };

  const handleEnrollCourse = (course, e) => {
    e.stopPropagation();

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
          provider: course.provider,
          price: course.price,
          url: course.url
        })
      }).then(res => {
        if (res.ok) {
          alert(`✅ Successfully enrolled in ${course.title}!`);
        }
      }).catch(console.error);
    } else {
      alert("Please login to enroll in courses");
      navigate("/login", { state: { from: "/courses" } });
    }
  };

  const handleSaveCourse = (course, e) => {
    e.stopPropagation();

    const isSaved = savedCourses.some(c => c.id === course.id);

    let newSavedCourses;
    if (isSaved) {
      newSavedCourses = savedCourses.filter(c => c.id !== course.id);
    } else {
      newSavedCourses = [...savedCourses, {
        ...course,
        savedAt: new Date().toISOString()
      }];
    }

    setSavedCourses(newSavedCourses);
    localStorage.setItem("savedCourses", JSON.stringify(newSavedCourses));

    if (!isSaved) {
      alert(`"${course.title}" saved to your bookmarks!`);
    }
  };

  const handleExpandCourse = (courseId, e) => {
    e.stopPropagation();
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleProviderToggle = (providerId) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(p => p !== providerId);
      } else {
        return [...prev, providerId];
      }
    });
  };

  const getProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'youtube': return <Youtube size={14} />;
      case 'coursera': return <Award size={14} />;
      case 'edx': return <BookOpen size={14} />;
      case 'udemy': return <PlayCircle size={14} />;
      default: return <Link size={14} />;
    }
  };

  const categories = [
    "all", "Programming", "Web Development", "Data Science", "AI/ML",
    "Cloud", "DevOps", "Cybersecurity", "Game Development", "Design",
    "Mobile Development", "Blockchain", "Computer Science"
  ];

  const levels = ["all", "Beginner", "Intermediate", "Advanced", "All Levels"];

  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: Target },
    { value: "rating", label: "Highest Rated", icon: Star },
    { value: "popularity", label: "Most Popular", icon: TrendingUp },
    { value: "price-low", label: "Price: Low to High", icon: DollarSign },
    { value: "price-high", label: "Price: High to Low", icon: DollarSign },
    { value: "duration-short", label: "Duration: Shortest", icon: Clock3 },
    { value: "duration-long", label: "Duration: Longest", icon: Clock3 }
  ];

  const durationOptions = [
    { value: "all", label: "Any Duration" },
    { value: "short", label: "Short (< 5 hours)" },
    { value: "medium", label: "Medium (5-20 hours)" },
    { value: "long", label: "Long (> 20 hours)" }
  ];

  if (loading) {
    return (
      <PageLayout>
        <div style={styles.pageWrapper}>
          <div style={styles.container}>
            <div style={styles.loaderCenter}>
              <Loader2 size={64} style={styles.spinner} />
              <h3 style={styles.loadingTitle}>Finding the best courses for you</h3>
              <p style={styles.loadingText}>Searching across Udemy, Coursera, YouTube, and more...</p>
              <div style={styles.loadingProviders}>
                <span style={styles.loadingProvider}>Udemy</span>
                <span style={styles.loadingProvider}>Coursera</span>
                <span style={styles.loadingProvider}>YouTube</span>
                <span style={styles.loadingProvider}>edX</span>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={styles.pageWrapper}>
        <div style={styles.container}>

          {/* Header Section */}
          <div style={styles.header}>
            <button
              onClick={() => navigate("/dashboard")}
              style={styles.backBtn}
            >
              <ArrowLeft size={18} /> BACK TO DASHBOARD
            </button>
            <div style={styles.headerContent}>
              <div>
                <h1 style={styles.title}>{view === "all" ? "Course Library" : "Saved Courses"}</h1>
                <p style={styles.subtitle}>
                  {view === "all" 
                    ? "Live courses from top platforms - personalized for your skills" 
                    : "Your curated list of saved courses for later learning"}
                </p>
              </div>
              <div style={styles.statsBadge}>
                <div style={styles.statItemMini}>
                  <BookOpen size={14} />
                  <span>{courses.length} live courses</span>
                </div>
                <div style={styles.statItemMini}>
                  <HeartHandshake size={14} />
                  <span>{savedCourses.length} saved</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorBanner}>
                <AlertCircle size={20} color="#f59e0b" />
                <span style={styles.errorText}>{error}</span>
              </div>
            )}

            {/* User Profile Summary */}
            {userSkills.length > 0 && (
              <div style={styles.profileSection}>
                <div style={styles.profileHeader}>
                  <Brain size={20} color="#a78bfa" />
                  <span style={styles.profileTitle}>Personalized for you</span>
                  <div style={styles.recommendedBadge}>
                    <Sparkles size={14} />
                    AI Recommended
                  </div>
                </div>
                <div style={styles.skillsGrid}>
                  {userSkills.slice(0, 8).map((skill, index) => (
                    <span key={index} style={styles.skillTag}>
                      <Tag size={12} />
                      {skill}
                    </span>
                  ))}
                  {userSkills.length > 8 && (
                    <span style={styles.moreTag}>+{userSkills.length - 8} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Main Controls */}
            <div style={styles.controlsSection}>
              <div style={styles.searchContainer}>
                <div style={styles.searchBox}>
                  <Search size={20} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Search live courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={styles.clearButton}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.mainFilters}>
                <div style={styles.filterRow}>
                  <div style={styles.filterGroup}>
                    <Filter size={16} />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={styles.filterSelect}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.filterGroup}>
                    <Award size={16} />
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      style={styles.filterSelect}
                    >
                      {levels.map(lvl => (
                        <option key={lvl} value={lvl}>
                          {lvl === "all" ? "All Levels" : lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.filterGroup}>
                    <TrendingDown size={16} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={styles.filterSelect}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    style={styles.advancedButton}
                  >
                    <Filter size={16} />
                    {showAdvancedFilters ? "Hide" : "Show"} Filters
                  </button>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div style={styles.advancedFilters}>
                    <div style={styles.advancedFilterGroup}>
                      <label style={styles.filterLabel}>Platforms</label>
                      <div style={styles.providerGrid}>
                        {providers.map(provider => (
                          <button
                            key={provider.id}
                            onClick={() => handleProviderToggle(provider.id)}
                            style={{
                              ...styles.providerButton,
                              ...(selectedProviders.includes(provider.id) ? styles.activeProviderButton : {})
                            }}
                          >
                            <span style={styles.providerIcon}>{provider.icon}</span>
                            <span style={styles.providerName}>{provider.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={styles.advancedFilterGroup}>
                      <label style={styles.filterLabel}>Price Range: ${minPrice} - ${maxPrice}</label>
                      <div style={styles.priceRange}>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="10"
                          value={minPrice}
                          onChange={(e) => setMinPrice(parseInt(e.target.value))}
                          style={styles.rangeInput}
                        />
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="10"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                          style={styles.rangeInput}
                        />
                      </div>
                      <div style={styles.priceLabels}>
                        <span>Free</span>
                        <span>$100</span>
                        <span>$200+</span>
                      </div>
                    </div>

                    <div style={styles.advancedFilterGroup}>
                      <label style={styles.filterLabel}>Duration</label>
                      <div style={styles.durationOptions}>
                        {durationOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setDurationFilter(option.value)}
                            style={{
                              ...styles.durationButton,
                              ...(durationFilter === option.value ? styles.activeFilterButton : {})
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={styles.advancedFilterGroup}>
                      <label style={styles.filterLabel}>Certification</label>
                      <div style={styles.certificationOptions}>
                        <button
                          onClick={() => setCertificationFilter("all")}
                          style={{
                            ...styles.certButton,
                            ...(certificationFilter === "all" ? styles.activeFilterButton : {})
                          }}
                        >
                          All Courses
                        </button>
                        <button
                          onClick={() => setCertificationFilter("certified")}
                          style={{
                            ...styles.certButton,
                            ...(certificationFilter === "certified" ? styles.activeFilterButton : {})
                          }}
                        >
                          <Shield size={14} />
                          With Certificate
                        </button>
                        <button
                          onClick={() => setCertificationFilter("non-certified")}
                          style={{
                            ...styles.certButton,
                            ...(certificationFilter === "non-certified" ? styles.activeFilterButton : {})
                          }}
                        >
                          No Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div style={styles.actionButtons}>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedLevel("all");
                      setSortBy("relevance");
                      setMinPrice(0);
                      setMaxPrice(200);
                      setDurationFilter("all");
                      setCertificationFilter("all");
                      setSelectedProviders([]);
                    }}
                    style={styles.resetButton}
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setView(view === "all" ? "saved" : "all")}
                    style={view === "saved" ? styles.activeSavedButton : styles.savedButton}
                  >
                    <Bookmark size={16} />
                    {view === "saved" ? "View All Courses" : `Saved Courses (${savedCourses.length})`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div style={styles.resultsSummary}>
            <div>
              <span style={styles.resultsCount}>
                {filteredCourses.length} {filteredCourses.length === 1 ? 'live course' : 'live courses'} found
              </span>
              {userSkills.length > 0 && (
                <span style={styles.resultsTip}>
                  <Target size={14} /> Sorted by relevance to your profile
                </span>
              )}
            </div>
            <div style={styles.sortInfo}>
              <span style={styles.sortLabel}>Sorted by:</span>
              <span style={styles.sortValue}>
                {sortOptions.find(o => o.value === sortBy)?.label || "Relevance"}
              </span>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div style={styles.noResults}>
              <BookOpen size={64} color="#64748b" />
              <h3 style={styles.noResultsTitle}>
                {view === "saved" 
                  ? "No saved courses yet" 
                  : "No live courses found"}
              </h3>
              <p style={styles.noResultsText}>
                {view === "saved"
                  ? "Browse the library and save courses you're interested in"
                  : (searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your filters")}
              </p>
              <button
                onClick={() => {
                  setView("all");
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                  setSelectedProviders([]);
                  setShowAdvancedFilters(false);
                }}
                style={styles.browseButton}
              >
                <Sparkles size={16} />
                Browse All Courses
              </button>
            </div>
          ) : (
            <>
              <div style={styles.coursesGrid}>
                {filteredCourses.map((course, index) => {
                  const isSaved = savedCourses.some(c => c.id === course.id);
                  const isExpanded = expandedCourse === course.id;

                  return (
                    <div
                      key={course.id || index}
                      style={styles.courseCard}
                    >
                      {/* Course Image */}
                      <div style={styles.courseImage}>
                        <img
                          src={course.image}
                          alt={course.title}
                          style={styles.courseImg}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/480x270/161b33/ffffff?text=${course.provider}`;
                          }}
                        />
                        <div style={styles.courseOverlay}>
                          <div style={styles.providerBadge}>
                            {getProviderIcon(course.provider)}
                            <span style={{ marginLeft: '4px' }}>{course.provider}</span>
                          </div>
                          <div style={styles.levelBadge}>
                            {course.level}
                          </div>
                          {course.hasCertificate && (
                            <div style={styles.certBadge}>
                              <Shield size={12} />
                              Certificate
                            </div>
                          )}
                        </div>
                        <div style={styles.imageActions}>
                          <button
                            onClick={(e) => handleSaveCourse(course, e)}
                            style={styles.saveButton}
                            title={isSaved ? "Remove from saved" : "Save for later"}
                          >
                            <Heart
                              size={20}
                              fill={isSaved ? "#ef4444" : "none"}
                              color={isSaved ? "#ef4444" : "#fff"}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div style={styles.courseContent}>
                        <div style={styles.courseHeader}>
                          <div>
                            <h3
                              style={styles.courseTitle}
                              onClick={() => handleCourseClick(course.id, course.url)}
                            >
                              {course.title}
                            </h3>
                            <div style={styles.courseMetaCompact}>
                              <span style={styles.metaItemCompact}>
                                <Clock size={12} />
                                {course.duration}
                              </span>
                              <span style={styles.metaItemCompact}>
                                <Users size={12} />
                                {course.students.toLocaleString()} students
                              </span>
                              {course.provider === 'YouTube' && (
                                <span style={{ ...styles.metaItemCompact, color: '#ff0000' }}>
                                  <Youtube size={12} />
                                  Free
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={styles.courseRating}>
                            <Star size={14} fill="#eab308" color="#eab308" />
                            <span>{course.rating}</span>
                            <span style={styles.ratingCount}>
                              ({Math.floor(course.students / 1000)}k)
                            </span>
                          </div>
                        </div>

                        <p style={styles.courseDescription}>
                          {course.description.length > 120
                            ? `${course.description.substring(0, 120)}...`
                            : course.description}
                        </p>

                        {/* Instructor */}
                        <div style={styles.instructorSection}>
                          <div style={styles.instructorInfo}>
                            <div style={styles.instructorAvatar}>
                              {course.instructor.charAt(0)}
                            </div>
                            <div>
                              <span style={styles.instructorLabel}>Instructor</span>
                              <span style={styles.instructorName}>{course.instructor}</span>
                            </div>
                          </div>
                          <span style={styles.languageTag}>
                            <Globe size={12} />
                            {course.language}
                          </span>
                        </div>

                        {/* Course Skills */}
                        <div style={styles.skillsSection}>
                          {course.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} style={styles.courseSkillTag}>{skill}</span>
                          ))}
                          {course.skills.length > 4 && (
                            <span style={styles.moreSkills}>+{course.skills.length - 4}</span>
                          )}
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div style={styles.expandedDetails}>
                            <div style={styles.detailsGrid}>
                              <div style={styles.detailItem}>
                                <Calendar size={14} />
                                <span>Last updated: {course.lastUpdated}</span>
                              </div>
                              <div style={styles.detailItem}>
                                <Video size={14} />
                                <span>{course.lectures} lectures</span>
                              </div>
                              <div style={styles.detailItem}>
                                <FileText size={14} />
                                <span>{course.articles} articles</span>
                              </div>
                              <div style={styles.detailItem}>
                                <Download size={14} />
                                <span>{course.resources} resources</span>
                              </div>
                              <div style={styles.detailItem}>
                                <Clock size={14} />
                                <span>Lifetime access: {course.lifetimeAccess ? "Yes" : "No"}</span>
                              </div>
                              <div style={styles.detailItem}>
                                <Zap size={14} />
                                <span>Mobile access: {course.mobileAccess ? "Yes" : "No"}</span>
                              </div>
                              <div style={styles.detailItem}>
                                <MessageSquare size={14} />
                                <span>Support: {course.support}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Course Footer */}
                        <div style={styles.courseFooter}>
                          <div style={styles.priceSection}>
                            <div style={styles.price}>{course.price}</div>
                            {course.price !== "Free" && (
                              <div style={styles.discountBadge}>
                                <Tag size={12} />
                                Best Price
                              </div>
                            )}
                          </div>

                          <div style={styles.actionButtonsCompact}>
                            <button
                              onClick={(e) => handleExpandCourse(course.id, e)}
                              style={styles.expandButton}
                            >
                              {isExpanded ? "Show Less" : "More Info"}
                            </button>
                            <button
                              onClick={(e) => handleEnrollCourse(course, e)}
                              style={styles.enrollButton}
                            >
                              {course.price === "Free" ? (
                                <>
                                  <PlayCircle size={16} />
                                  Start Free
                                </>
                              ) : (
                                <>
                                  <BookOpen size={16} />
                                  Enroll Now
                                </>
                              )}
                            </button>
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={styles.detailsButton}
                              title="View course details"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && view === "all" && (
                <div style={styles.loadMoreContainer}>
                  <button
                    onClick={loadMoreCourses}
                    disabled={loadingMore}
                    style={styles.loadMoreButton}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={16} style={styles.spinner} />
                        Loading more courses...
                      </>
                    ) : (
                      <>
                        Load More Courses
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Footer CTA */}
          {filteredCourses.length > 0 && (
            <div style={styles.footerCTA}>
              <div style={styles.ctaContent}>
                <Brain size={32} color="#6d5dfc" />
                <div>
                  <h3 style={styles.ctaTitle}>Want better recommendations?</h3>
                  <p style={styles.ctaText}>Update your skills profile for more personalized course matching</p>
                </div>
              </div>
              <div style={styles.ctaButtons}>
                <button
                  onClick={() => navigate("/analysis")}
                  style={styles.ctaButton}
                >
                  Update Profile
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," +
                      "Title,Provider,Price,Rating,Duration,URL\n" +
                      filteredCourses.map(course =>
                        `"${course.title}",${course.provider},${course.price},${course.rating},"${course.duration}",${course.url}`
                      ).join('\n');

                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'live-courses.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    alert("✅ Course list exported successfully!");
                  }}
                  style={styles.exportButton}
                >
                  <Download size={16} />
                  Export List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

const styles = {
  pageWrapper: {
    background: "#05070a",
    minHeight: "100vh",
    padding: "60px 0",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  },
  loaderCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
  },
  spinner: {
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingTitle: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: "16px",
    marginBottom: "20px",
  },
  loadingProviders: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
  loadingProvider: {
    padding: "8px 16px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    borderRadius: "8px",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "600",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    background: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  errorText: {
    color: "#f59e0b",
    fontSize: "14px",
    fontWeight: "600",
  },
  header: {
    marginBottom: "40px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#fff",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    margin: 0,
  },
  statsBadge: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  statItemMini: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
  },
  recommendedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "8px",
    color: "#a78bfa",
    fontWeight: "600",
    fontSize: "12px",
  },
  profileSection: {
    background: "rgba(22, 27, 51, 0.6)",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  profileTitle: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: "16px",
    marginRight: "12px",
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "rgba(109, 93, 252, 0.1)",
    color: "#a78bfa",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
  },
  moreTag: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
  },
  controlsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  searchContainer: {
    width: "100%",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    background: "rgba(13, 17, 36, 0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    transition: "all 0.3s ease",
  },
  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
  },
  clearButton: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  },
  mainFilters: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "rgba(13, 17, 36, 0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    minWidth: "180px",
  },
  filterSelect: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
  },
  advancedButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "12px",
    color: "#3b82f6",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  advancedFilters: {
    background: "rgba(13, 17, 36, 0.8)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  advancedFilterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  filterLabel: {
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
  },
  providerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "8px",
  },
  providerButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeProviderButton: {
    background: "rgba(109, 93, 252, 0.1)",
    borderColor: "rgba(109, 93, 252, 0.3)",
    color: "#a78bfa",
  },
  providerIcon: {
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
  },
  providerName: {
    flex: 1,
    fontSize: "12px",
  },
  priceRange: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  rangeInput: {
    width: "100%",
    height: "4px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "2px",
    outline: "none",
    cursor: "pointer",
  },
  priceLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "12px",
  },
  durationOptions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  durationButton: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  certificationOptions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  certButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeFilterButton: {
    background: "rgba(109, 93, 252, 0.1)",
    borderColor: "rgba(109, 93, 252, 0.3)",
    color: "#a78bfa",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  resetButton: {
    padding: "12px 20px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  savedButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "rgba(236, 72, 153, 0.1)",
    border: "1px solid rgba(236, 72, 153, 0.2)",
    borderRadius: "12px",
    color: "#ec4899",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  resultsSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexWrap: "wrap",
    gap: "16px",
  },
  resultsCount: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "700",
    marginRight: "16px",
  },
  resultsTip: {
    color: "#a78bfa",
    fontSize: "14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  sortInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sortLabel: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  sortValue: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    padding: "4px 8px",
    background: "rgba(109, 93, 252, 0.1)",
    borderRadius: "6px",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  courseCard: {
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    position: "relative",
  },
  courseImage: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
  },
  courseImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  courseOverlay: {
    position: "absolute",
    top: "12px",
    left: "12px",
    right: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "8px",
  },
  providerBadge: {
    padding: "6px 12px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
  },
  levelBadge: {
    padding: "6px 12px",
    background: "rgba(109, 93, 252, 0.8)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
  },
  certBadge: {
    padding: "6px 12px",
    background: "rgba(16, 185, 129, 0.8)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  imageActions: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    display: "flex",
    gap: "8px",
  },
  saveButton: {
    background: "rgba(0,0,0,0.6)",
    border: "none",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  courseContent: {
    padding: "24px",
  },
  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "12px",
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 8px 0",
    lineHeight: "1.4",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
  courseMetaCompact: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  metaItemCompact: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    color: "#94a3b8",
    fontSize: "12px",
  },
  courseRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#eab308",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  ratingCount: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  courseDescription: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "20px",
    minHeight: "42px",
  },
  instructorSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  instructorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  instructorAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(109, 93, 252, 0.1)",
    color: "#a78bfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  instructorLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  instructorName: {
    display: "block",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },
  languageTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    background: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
    borderRadius: "6px",
    fontSize: "12px",
  },
  skillsSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "24px",
  },
  courseSkillTag: {
    padding: "6px 12px",
    background: "rgba(109, 93, 252, 0.1)",
    color: "#a78bfa",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
  },
  moreSkills: {
    padding: "6px 12px",
    background: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
  },
  expandedDetails: {
    background: "rgba(13, 17, 36, 0.8)",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#cbd5e1",
    fontSize: "13px",
  },
  courseFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  priceSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  price: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
  },
  discountBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    background: "rgba(16, 185, 129, 0.2)",
    color: "#10b981",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
  },
  actionButtonsCompact: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  expandButton: {
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  enrollButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  detailsButton: {
    padding: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
  },
  loadMoreContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "40px",
  },
  loadMoreButton: {
    padding: "16px 40px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "12px",
    color: "#a78bfa",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
  },
  noResults: {
    textAlign: "center",
    padding: "80px 20px",
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    margin: "40px 0",
  },
  noResultsTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    margin: "24px 0 8px 0",
  },
  noResultsText: {
    color: "#94a3b8",
    fontSize: "16px",
    marginBottom: "32px",
    maxWidth: "400px",
    margin: "0 auto 32px auto",
  },
  browseButton: {
    padding: "14px 28px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "12px",
    color: "#a78bfa",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
  },
  footerCTA: {
    background: "linear-gradient(135deg, rgba(109, 93, 252, 0.1), rgba(16, 185, 129, 0.1))",
    borderRadius: "20px",
    padding: "32px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    marginTop: "40px",
  },
  ctaContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  ctaTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
  },
  ctaText: {
    fontSize: "16px",
    color: "#cbd5e1",
    margin: 0,
  },
  ctaButtons: {
    display: "flex",
    gap: "12px",
  },
  ctaButton: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "800",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  exportButton: {
    padding: "14px 28px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .courseCard:hover {
      transform: translateY(-8px);
      border-color: rgba(109, 93, 252, 0.3);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    
    .courseCard:hover .courseImg {
      transform: scale(1.05);
    }
    
    .courseTitle:hover {
      color: #a78bfa;
    }
    
    .searchBox:focus-within {
      border-color: rgba(109, 93, 252, 0.5);
      box-shadow: 0 0 20px rgba(109, 93, 252, 0.1);
    }
    
    .filterGroup:hover, .resetButton:hover {
      border-color: rgba(109, 93, 252, 0.3);
      background: rgba(109, 93, 252, 0.1);
    }
    
    .saveButton:hover {
      background: rgba(239, 68, 68, 0.6);
      transform: scale(1.1);
    }
    
    .enrollButton:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(109, 93, 252, 0.3);
    }
    
    .expandButton:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .detailsButton:hover {
      border-color: rgba(109, 93, 252, 0.3);
      color: #a78bfa;
      background: rgba(109, 93, 252, 0.1);
    }
    
    .browseButton:hover, .ctaButton:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(109, 93, 252, 0.3);
    }
    
    .loadMoreButton:hover {
      background: rgba(109, 93, 252, 0.2);
      border-color: #6d5dfc;
      transform: translateY(-2px);
    }
    
    .advancedButton:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.3);
    }
    
    .savedButton:hover {
      background: rgba(236, 72, 153, 0.2);
      border-color: rgba(236, 72, 153, 0.3);
      transform: translateY(-2px);
    }
    
    .providerButton:hover {
      background: rgba(109, 93, 252, 0.05);
      border-color: rgba(109, 93, 252, 0.2);
    }
    
    .durationButton:hover, .certButton:hover {
      background: rgba(109, 93, 252, 0.05);
      border-color: rgba(109, 93, 252, 0.2);
    }
    
    .exportButton:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Courses;