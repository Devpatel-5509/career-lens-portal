import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock, 
  Award, 
  Calendar,
  Sparkles,
  BarChart3,
  Rocket,
  Trophy,
  Zap,
  ExternalLink,
  PlayCircle,
  TrendingUp as TrendingUpIcon,
  BookOpen,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProgressTracker = ({ userProgress }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    totalCourses: 0,
    completedCourses: 0,
    enrolledCourses: 0,
    skillPoints: 0,
    currentLevel: "Beginner",
    nextLevel: "Intermediate",
    progressToNextLevel: 0,
    streakDays: 0,
    weeklyGoal: 5,
    weeklyProgress: 0,
    badges: 0,
    lastActivity: "No activity yet",
    learningHours: 0,
    joinDate: null
  });

  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      setError("Please login to view your progress");
      return;
    }

    try {
      // Fetch user's enrolled courses
      const coursesResponse = await fetch("http://localhost:5000/api/courses/my-courses", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Fetch user's analysis data
      const analysisResponse = await fetch("http://localhost:5000/api/analysis/get-my-analysis", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Fetch user's activity data
      const activityResponse = await fetch("http://localhost:5000/api/user/activity", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Fetch user's achievements
      const achievementsResponse = await fetch("http://localhost:5000/api/user/achievements", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        processCoursesData(coursesData);
      }

      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        processAnalysisData(analysisData);
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        processActivityData(activityData);
      }

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        processAchievementsData(achievementsData);
      }

      // If no courses, check localStorage for backup
      if (!coursesResponse.ok || courses.length === 0) {
        const localCourses = localStorage.getItem("userCourses");
        if (localCourses) {
          processCoursesData({ courses: JSON.parse(localCourses) });
        }
      }

    } catch (error) {
      console.error("Error fetching user progress:", error);
      setError("Failed to load your progress data");
      
      // Try to load from localStorage as fallback
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const processCoursesData = (data) => {
    const enrolledCourses = data.courses || [];
    
    if (enrolledCourses.length === 0) {
      // No courses - show empty state
      setCourses([]);
      setUserData(prev => ({
        ...prev,
        totalCourses: 0,
        completedCourses: 0,
        enrolledCourses: 0,
        skillPoints: 0,
        learningHours: 0
      }));
      return;
    }

    const completed = enrolledCourses.filter(c => c.progress === 100).length;
    const totalProgress = enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    const avgProgress = enrolledCourses.length > 0 ? totalProgress / enrolledCourses.length : 0;
    
    // Calculate skill points (10 points per 10% progress)
    const skillPoints = Math.floor(totalProgress * 0.1);
    
    // Calculate learning hours (assuming 1% progress = 6 minutes of learning)
    const learningHours = Math.floor(totalProgress * 0.6);

    setCourses(enrolledCourses.slice(0, 4)); // Show only 4 courses in tracker
    
    setUserData(prev => ({
      ...prev,
      totalCourses: enrolledCourses.length,
      completedCourses: completed,
      enrolledCourses: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
      skillPoints: prev.skillPoints + skillPoints,
      learningHours: prev.learningHours + learningHours,
      lastActivity: "Today"
    }));

    // Save to localStorage as backup
    localStorage.setItem("userCourses", JSON.stringify(enrolledCourses));
  };

  const processAnalysisData = (data) => {
    const analysis = data.analysis;
    
    // Calculate level based on experience and completed courses
    let currentLevel = "Beginner";
    let nextLevel = "Intermediate";
    let progressToNextLevel = 0;

    if (analysis) {
      // Use saved experience level as base
      currentLevel = analysis.experienceLevel || "Beginner";
      
      // Calculate next level
      const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
      const currentIndex = levels.indexOf(currentLevel);
      
      if (currentIndex < levels.length - 1) {
        nextLevel = levels[currentIndex + 1];
      } else {
        nextLevel = "Master";
      }

      // Calculate progress based on completed courses and skill points
      const targetCourses = (currentIndex + 1) * 5;
      const progress = Math.min(100, (userData.completedCourses / targetCourses) * 100);
      progressToNextLevel = Math.round(progress);
    }

    setUserData(prev => ({
      ...prev,
      currentLevel,
      nextLevel,
      progressToNextLevel,
      joinDate: analysis?.createdAt || new Date().toISOString()
    }));
  };

  const processActivityData = (data) => {
    const activity = data.weeklyActivity || [];
    
    if (activity.length > 0) {
      setWeeklyActivity(activity);
      
      // Calculate streak
      let streak = 0;
      for (let i = activity.length - 1; i >= 0; i--) {
        if (activity[i] > 0) streak++;
        else break;
      }

      // Calculate weekly progress
      const weeklyTotal = activity.reduce((sum, hours) => sum + hours, 0);
      const weeklyGoal = userData.weeklyGoal || 5;

      setUserData(prev => ({
        ...prev,
        streakDays: streak,
        weeklyProgress: Math.min(weeklyTotal, weeklyGoal),
        weeklyGoal: weeklyGoal
      }));
    }
  };

  const processAchievementsData = (data) => {
    const earnedAchievements = data.achievements || [];
    
    // Define all possible achievements
    const allAchievements = [
      { 
        id: 1, 
        name: "Week Streak", 
        icon: Trophy, 
        color: "#eab308", 
        description: "7 days in a row",
        condition: userData.streakDays >= 7,
        badgeId: "streak-master" 
      },
      { 
        id: 2, 
        name: "Fast Learner", 
        icon: Zap, 
        color: "#ec4899", 
        description: "Complete 3 courses",
        condition: userData.completedCourses >= 3,
        badgeId: "fast-learner" 
      },
      { 
        id: 3, 
        name: "Skill Master", 
        icon: Award, 
        color: "#6d5dfc", 
        description: "Earn 500 skill points",
        condition: userData.skillPoints >= 500,
        badgeId: "skill-master" 
      },
      { 
        id: 4, 
        name: "Consistency King", 
        icon: Target, 
        color: "#10b981", 
        description: "30+ learning hours",
        condition: userData.learningHours >= 30,
        badgeId: "consistency-king" 
      },
      { 
        id: 5, 
        name: "Course Completer", 
        icon: CheckCircle, 
        color: "#3b82f6", 
        description: "Finish your first course",
        condition: userData.completedCourses >= 1,
        badgeId: "course-completer" 
      },
      { 
        id: 6, 
        name: "Goal Crusher", 
        icon: TrendingUp, 
        color: "#f59e0b", 
        description: "Meet weekly goal 3 times",
        condition: userData.weeklyProgress >= userData.weeklyGoal,
        badgeId: "goal-crusher" 
      }
    ];

    // Filter achievements that are earned
    const earned = allAchievements.filter(ach => ach.condition);
    
    setAchievements(earned.slice(0, 3)); // Show only 3 recent achievements
    
    setUserData(prev => ({
      ...prev,
      badges: earned.length
    }));
  };

  const loadFromLocalStorage = () => {
    try {
      const localCourses = localStorage.getItem("userCourses");
      const localAnalysis = localStorage.getItem("userAnalysis");
      
      if (localCourses) {
        processCoursesData({ courses: JSON.parse(localCourses) });
      }
      
      if (localAnalysis) {
        processAnalysisData({ analysis: JSON.parse(localAnalysis) });
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
  };

  // Check if user has any activity
  const hasActivity = userData.totalCourses > 0 || 
                     userData.skillPoints > 0 || 
                     userData.learningHours > 0 ||
                     courses.length > 0;

  // Handler Functions
  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  const handleViewAllAchievements = () => {
    navigate("/achievements");
  };

  const handleCourseClick = (courseId, courseTitle) => {
    navigate(`/course/${courseId}`);
  };

  const handleStartCourse = (courseId, courseTitle) => {
    navigate(`/course/${courseId}/lesson/1`);
  };

  const handleViewCourseDetails = (courseId, courseTitle) => {
    navigate(`/course/${courseId}/details`);
  };

  const handleAchievementClick = (badgeId, achievementName) => {
    alert(`🏆 Achievement: ${achievementName}\n\nKeep learning to earn more badges!`);
  };

  const handleContinueLearning = () => {
    const inProgressCourse = courses.find(course => course.progress > 0 && course.progress < 100);
    if (inProgressCourse) {
      navigate(`/course/${inProgressCourse.courseId}`);
    } else {
      navigate("/courses");
    }
  };

  const handleViewWeeklyReport = () => {
    if (!hasActivity) {
      alert("Start learning to see your weekly report! 📊");
      return;
    }
    navigate("/reports/weekly");
  };

  const handleSetNewGoal = () => {
    const newGoal = prompt("Set your new weekly goal (hours):", userData.weeklyGoal);
    if (newGoal && !isNaN(newGoal) && parseInt(newGoal) > 0) {
      setUserData(prev => ({ ...prev, weeklyGoal: parseInt(newGoal) }));
      alert(`✅ New weekly goal set: ${newGoal} hours`);
      
      // Save to backend
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/user/set-goal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ weeklyGoal: parseInt(newGoal) })
      }).catch(console.error);
    }
  };

  const handleShareProgress = () => {
    if (!hasActivity) {
      alert("Start learning first to share your progress! 🎯");
      return;
    }

    const shareText = `🎯 I've completed ${userData.completedCourses} courses and earned ${userData.skillPoints} skill points on Career Lens!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Learning Progress',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("📋 Progress copied to clipboard!\n\n" + shareText);
    }
  };

  const handleLevelDetails = () => {
    navigate("/profile/levels");
  };

  const handleViewBadges = () => {
    navigate("/achievements");
  };

  const handleCalendarClick = () => {
    if (!hasActivity) {
      alert("📅 Start learning to see your activity calendar!");
      return;
    }
    navigate("/calendar");
  };

  const handleStatCardClick = (statType) => {
    if (!hasActivity) {
      alert("Start learning to see your statistics! 📊");
      return;
    }

    switch(statType) {
      case 'courses':
        navigate("/courses?filter=completed");
        break;
      case 'points':
        navigate("/profile/skills");
        break;
      case 'streak':
        alert(`🔥 You're on a ${userData.streakDays}-day learning streak!\n\nKeep it up to unlock special rewards!`);
        break;
      case 'goal':
        handleSetNewGoal();
        break;
      default:
        navigate("/profile");
    }
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  const handleTakeAnalysis = () => {
    navigate("/analysis");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 size={48} style={styles.spinner} />
        <p style={styles.loadingText}>Loading your progress...</p>
      </div>
    );
  }

  // Show empty state if no activity
  if (!hasActivity) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyStateIcon}>
            <BookOpen size={64} color="#6d5dfc" />
          </div>
          <h2 style={styles.emptyStateTitle}>No Learning Activity Yet</h2>
          <p style={styles.emptyStateText}>
            You haven't enrolled in any courses yet. Start your learning journey today to track your progress and earn achievements!
          </p>
          <div style={styles.emptyStateActions}>
            <button 
              onClick={handleBrowseCourses}
              style={styles.primaryButton}
            >
              Browse Courses
            </button>
            <button 
              onClick={handleTakeAnalysis}
              style={styles.secondaryButton}
            >
              Take Skill Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={styles.errorTitle}>Unable to Load Progress</h2>
          <p style={styles.errorText}>{error}</p>
          <button 
            onClick={fetchUserProgress}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>Learning Progress Tracker</h2>
            <p style={styles.subtitle}>Track your journey towards career mastery</p>
          </div>
          <div style={styles.headerActions}>
            <button 
              onClick={handleShareProgress}
              style={styles.shareButton}
              title="Share your progress"
            >
              <span>Share Progress</span>
              <TrendingUpIcon size={16} />
            </button>
            <button 
              onClick={handleLevelDetails}
              style={styles.statsBadge}
            >
              <Sparkles size={16} />
              Level {userData.currentLevel}
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={styles.statsGrid}>
        <motion.button 
          style={styles.statCard}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleStatCardClick('courses')}
        >
          <div style={{...styles.statIcon, background: "rgba(109, 93, 252, 0.1)"}}>
            <TrendingUp size={24} color="#6d5dfc" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{userData.completedCourses}/{userData.totalCourses}</div>
            <div style={styles.statLabel}>Courses Completed</div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: userData.totalCourses > 0 ? `${(userData.completedCourses / userData.totalCourses) * 100}%` : '0%', background: "#6d5dfc"}}></div>
            </div>
          </div>
        </motion.button>

        <motion.button 
          style={styles.statCard}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleStatCardClick('points')}
        >
          <div style={{...styles.statIcon, background: "rgba(16, 185, 129, 0.1)"}}>
            <Award size={24} color="#10b981" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{userData.skillPoints.toLocaleString()}</div>
            <div style={styles.statLabel}>Skill Points</div>
            <div style={styles.progressText}>
              +{Math.floor(userData.skillPoints * 0.1)} this week
            </div>
          </div>
        </motion.button>

        <motion.button 
          style={styles.statCard}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleStatCardClick('streak')}
        >
          <div style={{...styles.statIcon, background: "rgba(234, 179, 8, 0.1)"}}>
            <Clock size={24} color="#eab308" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{userData.streakDays} days</div>
            <div style={styles.statLabel}>Learning Streak</div>
            <div style={styles.progressText}>
              {userData.streakDays > 0 ? "🔥 Keep going!" : "Start today!"}
            </div>
          </div>
        </motion.button>

        <motion.button 
          style={styles.statCard}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleStatCardClick('goal')}
        >
          <div style={{...styles.statIcon, background: "rgba(236, 72, 153, 0.1)"}}>
            <BarChart3 size={24} color="#ec4899" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{userData.weeklyProgress}/{userData.weeklyGoal}</div>
            <div style={styles.statLabel}>Weekly Goal</div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${(userData.weeklyProgress / userData.weeklyGoal) * 100}%`, background: "#ec4899"}}></div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Level Progress */}
      <div style={styles.levelSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Level Progress</h3>
          <button 
            onClick={handleLevelDetails}
            style={styles.levelBadges}
          >
            <span style={styles.currentLevel}>{userData.currentLevel}</span>
            <span style={styles.levelArrow}>→</span>
            <span style={styles.nextLevel}>{userData.nextLevel}</span>
          </button>
        </div>
        <div style={styles.levelProgressContainer}>
          <div style={styles.levelProgressBar}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${userData.progressToNextLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={styles.levelProgressFill}
            />
          </div>
          <div style={styles.levelStats}>
            <span style={styles.levelStat}>{userData.progressToNextLevel}% to next level</span>
            <span style={styles.levelStat}>{userData.learningHours} learning hours</span>
          </div>
        </div>
        <button 
          onClick={handleSetNewGoal}
          style={styles.setGoalButton}
        >
          Set New Goal
        </button>
      </div>

      {/* Courses Progress */}
      {courses.length > 0 && (
        <div style={styles.coursesSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Active Courses</h3>
            <button 
              onClick={handleViewAllCourses}
              style={styles.viewAllLink}
            >
              View All ({userData.totalCourses})
            </button>
          </div>
          <div style={styles.coursesGrid}>
            {courses.map((course, index) => (
              <motion.div 
                key={course.id || index}
                style={styles.courseCard}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => course.progress === 100 ? handleViewCourseDetails(course.courseId, course.title) : handleCourseClick(course.courseId, course.title)}
              >
                <div style={styles.courseHeader}>
                  <h4 style={styles.courseTitle}>{course.title}</h4>
                  <div style={styles.courseStatus}>
                    {course.progress === 100 && (
                      <CheckCircle size={16} color="#10b981" />
                    )}
                    {course.progress > 0 && course.progress < 100 && (
                      <Clock size={16} color="#eab308" />
                    )}
                  </div>
                </div>
                <div style={styles.courseProgressContainer}>
                  <div style={styles.courseProgressBar}>
                    <div style={{...styles.courseProgressFill, width: `${course.progress || 0}%`}}></div>
                  </div>
                  <span style={styles.courseProgressText}>{course.progress || 0}%</span>
                </div>
                <div style={styles.courseFooter}>
                  {course.progress === 100 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCourseDetails(course.courseId, course.title);
                      }}
                      style={styles.completedBadge}
                    >
                      View Certificate
                    </button>
                  )}
                  {course.progress > 0 && course.progress < 100 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCourse(course.courseId, course.title);
                      }}
                      style={styles.inProgressBadge}
                    >
                      <PlayCircle size={14} /> Continue
                    </button>
                  )}
                  {course.progress === 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCourse(course.courseId, course.title);
                      }}
                      style={styles.startButton}
                    >
                      Start Now
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCourseDetails(course.courseId, course.title);
                    }}
                    style={styles.detailsButton}
                    title="View course details"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div style={styles.achievementsSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Achievements</h3>
            <button 
              onClick={handleViewAllAchievements}
              style={styles.badgeCount}
            >
              {userData.badges} badges earned
            </button>
          </div>
          <div style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <motion.button 
                key={achievement.id}
                style={styles.achievementCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAchievementClick(achievement.badgeId, achievement.name)}
              >
                <div style={{...styles.achievementIcon, background: achievement.color + "20"}}>
                  <achievement.icon size={28} color={achievement.color} />
                </div>
                <div style={styles.achievementContent}>
                  <h4 style={styles.achievementName}>{achievement.name}</h4>
                  <p style={styles.achievementDesc}>{achievement.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <div style={styles.achievementsFooter}>
            <button 
              onClick={handleViewBadges}
              style={styles.viewAllBadgesButton}
            >
              View All Badges
            </button>
          </div>
        </div>
      )}

      {/* Weekly Activity */}
      {weeklyActivity.some(hours => hours > 0) && (
        <div style={styles.activitySection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Weekly Activity</h3>
            <button 
              onClick={handleCalendarClick}
              style={styles.activityStats}
            >
              <Calendar size={16} />
              <span style={styles.activityText}>Last active: {userData.lastActivity}</span>
            </button>
          </div>
          <div style={styles.activityChart}>
            {weeklyActivity.map((value, index) => (
              <div key={index} style={styles.activityBarContainer}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(100, value * 20)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{...styles.activityBar, background: `linear-gradient(to top, #6d5dfc, #a78bfa)`}}
                />
                <span style={styles.dayLabel}>{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={handleViewWeeklyReport}
            style={styles.viewReportButton}
          >
            View Detailed Report
          </button>
        </div>
      )}

      {/* Motivation Card - Only show if there's activity */}
      {hasActivity && (
        <motion.div 
          style={styles.motivationCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div style={styles.motivationContent}>
            <Rocket size={32} color="#fff" />
            <div>
              <h4 style={styles.motivationTitle}>Keep up the great work!</h4>
              <p style={styles.motivationText}>
                {userData.progressToNextLevel < 100 
                  ? `You're on track to reach ${userData.nextLevel} level in ${Math.ceil((100 - userData.progressToNextLevel) / 10)} days.`
                  : `Congratulations! You're ready to level up to ${userData.nextLevel}!`}
              </p>
            </div>
          </div>
          <button 
            onClick={handleContinueLearning}
            style={styles.continueButton}
          >
            Continue Learning
            <TrendingUp size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "24px",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    backdropFilter: "blur(10px)",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    margin: "20px 0",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px",
    background: "rgba(22, 27, 51, 0.6)",
    borderRadius: "24px",
    border: "1px solid rgba(109, 93, 252, 0.2)",
    backdropFilter: "blur(10px)",
    margin: "20px 0",
  },
  loadingText: {
    fontSize: "18px",
    color: "#fff",
    marginTop: "20px",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    textAlign: "center",
  },
  emptyStateIcon: {
    width: "120px",
    height: "120px",
    background: "rgba(109, 93, 252, 0.1)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    border: "2px solid rgba(109, 93, 252, 0.2)",
  },
  emptyStateTitle: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "16px",
  },
  emptyStateText: {
    fontSize: "16px",
    color: "#94a3b8",
    maxWidth: "500px",
    marginBottom: "32px",
    lineHeight: "1.6",
  },
  emptyStateActions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryButton: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #6d5dfc, #4a3aff)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    padding: "14px 28px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "12px",
    color: "#a78bfa",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#ef4444",
    marginBottom: "12px",
  },
  errorText: {
    fontSize: "16px",
    color: "#94a3b8",
    marginBottom: "24px",
  },
  retryButton: {
    padding: "12px 24px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
  },
  header: {
    marginBottom: "32px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "20px",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: "28px",
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
  shareButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  statsBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "12px",
    color: "#a78bfa",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    background: "rgba(13, 17, 36, 0.8)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
    width: "100%",
  },
  statIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "8px",
  },
  progressBar: {
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "12px",
    color: "#10b981",
    fontWeight: "600",
  },
  levelSection: {
    marginBottom: "32px",
    background: "rgba(13, 17, 36, 0.5)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
  },
  levelBadges: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  currentLevel: {
    padding: "6px 12px",
    background: "rgba(109, 93, 252, 0.2)",
    color: "#a78bfa",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
  },
  levelArrow: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  nextLevel: {
    padding: "6px 12px",
    background: "rgba(236, 72, 153, 0.2)",
    color: "#ec4899",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
  },
  levelProgressContainer: {
    marginTop: "16px",
  },
  levelProgressBar: {
    height: "12px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  levelProgressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6d5dfc, #ec4899)",
    borderRadius: "6px",
  },
  levelStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelStat: {
    fontSize: "14px",
    color: "#cbd5e1",
    fontWeight: "500",
  },
  setGoalButton: {
    marginTop: "16px",
    padding: "8px 16px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "8px",
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  coursesSection: {
    marginBottom: "32px",
  },
  viewAllLink: {
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "color 0.3s ease",
    background: "none",
    border: "none",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  courseCard: {
    background: "rgba(13, 17, 36, 0.8)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  courseTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    flex: 1,
  },
  courseStatus: {
    marginLeft: "12px",
  },
  courseProgressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  courseProgressBar: {
    flex: 1,
    height: "8px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  courseProgressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6d5dfc, #a78bfa)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  courseProgressText: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: "600",
    minWidth: "40px",
  },
  courseFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  completedBadge: {
    padding: "6px 12px",
    background: "rgba(16, 185, 129, 0.2)",
    color: "#10b981",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s ease",
  },
  inProgressBadge: {
    padding: "6px 12px",
    background: "rgba(234, 179, 8, 0.2)",
    color: "#eab308",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.3s ease",
  },
  startButton: {
    padding: "8px 16px",
    background: "rgba(109, 93, 252, 0.2)",
    color: "#a78bfa",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  detailsButton: {
    padding: "6px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  achievementsSection: {
    marginBottom: "32px",
  },
  badgeCount: {
    color: "#eab308",
    fontSize: "14px",
    fontWeight: "600",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  achievementCard: {
    background: "rgba(13, 17, 36, 0.8)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
    width: "100%",
  },
  achievementIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 4px 0",
  },
  achievementDesc: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
    lineHeight: "1.4",
  },
  achievementsFooter: {
    marginTop: "16px",
    textAlign: "center",
  },
  viewAllBadgesButton: {
    padding: "10px 24px",
    background: "rgba(234, 179, 8, 0.1)",
    border: "1px solid rgba(234, 179, 8, 0.3)",
    borderRadius: "8px",
    color: "#eab308",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activitySection: {
    marginBottom: "32px",
  },
  activityStats: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  activityText: {
    color: "#cbd5e1",
  },
  activityChart: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "120px",
    padding: "20px",
    background: "rgba(13, 17, 36, 0.5)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  activityBarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },
  activityBar: {
    width: "12px",
    borderRadius: "6px",
    minHeight: "10px",
  },
  dayLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "600",
  },
  viewReportButton: {
    marginTop: "16px",
    padding: "10px 24px",
    background: "rgba(109, 93, 252, 0.1)",
    border: "1px solid rgba(109, 93, 252, 0.3)",
    borderRadius: "8px",
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  motivationCard: {
    background: "linear-gradient(135deg, #6d5dfc, #ec4899)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    boxShadow: "0 10px 30px rgba(109, 93, 252, 0.4)",
  },
  motivationContent: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: 1,
  },
  motivationTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 4px 0",
  },
  motivationText: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.9)",
    margin: 0,
  },
  continueButton: {
    padding: "12px 24px",
    background: "#fff",
    color: "#6d5dfc",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
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
    
    .shareButton:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .statsBadge:hover {
      background: rgba(109, 93, 252, 0.2);
      border-color: #6d5dfc;
    }
    
    .statCard:hover {
      border-color: rgba(109, 93, 252, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .setGoalButton:hover {
      background: rgba(109, 93, 252, 0.2);
      border-color: #6d5dfc;
    }
    
    .viewAllLink:hover {
      color: #ec4899;
    }
    
    .courseCard:hover {
      border-color: rgba(109, 93, 252, 0.3);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .completedBadge:hover {
      background: rgba(16, 185, 129, 0.3);
    }
    
    .inProgressBadge:hover {
      background: rgba(234, 179, 8, 0.3);
    }
    
    .startButton:hover {
      background: rgba(109, 93, 252, 0.3);
      border-color: #6d5dfc;
    }
    
    .detailsButton:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    
    .achievementCard:hover {
      border-color: rgba(109, 93, 252, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .viewAllBadgesButton:hover {
      background: rgba(234, 179, 8, 0.2);
      border-color: #eab308;
    }
    
    .viewReportButton:hover {
      background: rgba(109, 93, 252, 0.2);
      border-color: #6d5dfc;
    }
    
    .continueButton:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    
    .primaryButton:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(109, 93, 252, 0.4);
    }
    
    .secondaryButton:hover {
      background: rgba(109, 93, 252, 0.15);
      border-color: #6d5dfc;
    }
    
    .retryButton:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default ProgressTracker;