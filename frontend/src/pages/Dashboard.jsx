import React, { useEffect,useState } from "react";
import {
  BarChart3,
  Target,
  Briefcase,
  TrendingUp,
  MessageCircle,
  LogOut,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  BookOpen,
  Briefcase as WorkIcon,
  GraduationCap,
  Award as CertificationIcon,
  Globe,
  Github,
  Linkedin,
  Edit,
  Settings,
  HelpCircle,
  Shield,
  Lock,
  Bell,
  CheckCircle,
  XCircle,
  Save,
  Camera,
  Download,
  Upload,
  Plus,
  Trash2,
  FileText,
  File,
  Check,
  AlertCircle,
  Moon,
  Sun,
  Globe2,
  Eye,
  EyeOff,
  Key,
  Cookie,
  Smartphone,
  MailCheck,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  CreditCard,
  History,
  Download as DownloadIcon,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  UserX,
  Fingerprint,
  Shield as ShieldIcon,
  Database,
  Clock,
  Sliders,
  Palette,
  Type,
  Layout,
  MonitorSmartphone,
  
} from "lucide-react";
import { getRecommendations } from "../services/recommendService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("account");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(user?.resumeName || "");
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [courses, setCourses] = useState([]);
  useEffect(() =>
     { const fetchData = async () => 
    { const data = await getRecommendations(["React"]);
    console.log("API Response:", data);
    setCourses(data.docs); }; fetchData(); }, []);
  
  // Settings States
  const [settings, setSettings] = useState({
    // Account Settings
    account: {
      email: user?.email || "",
      username: user?.username || user?.name || "",
      language: user?.language || "en",
      timezone: user?.timezone || "UTC",
      dateFormat: user?.dateFormat || "MM/DD/YYYY",
    },
    // Privacy Settings
    privacy: {
      profileVisibility: user?.privacy?.profileVisibility || "public",
      showEmail: user?.privacy?.showEmail || false,
      showPhone: user?.privacy?.showPhone || false,
      showLocation: user?.privacy?.showLocation || true,
      showResume: user?.privacy?.showResume || true,
      showExperience: user?.privacy?.showExperience || true,
      showEducation: user?.privacy?.showEducation || true,
      showSkills: user?.privacy?.showSkills || true,
      activityStatus: user?.privacy?.activityStatus || true,
      twoFactorAuth: user?.privacy?.twoFactorAuth || false,
      dataSharing: user?.privacy?.dataSharing || false,
    },
    // Notification Settings
    notifications: {
      emailNotifications: user?.notifications?.emailNotifications || true,
      pushNotifications: user?.notifications?.pushNotifications || true,
      smsNotifications: user?.notifications?.smsNotifications || false,
      jobAlerts: user?.notifications?.jobAlerts || true,
      careerTips: user?.notifications?.careerTips || true,
      profileViews: user?.notifications?.profileViews || true,
      messages: user?.notifications?.messages || true,
      recommendations: user?.notifications?.recommendations || true,
      applicationUpdates: user?.notifications?.applicationUpdates || true,
      newsletter: user?.notifications?.newsletter || false,
      sound: user?.notifications?.sound || true,
      desktop: user?.notifications?.desktop || false,
    },
    // Appearance Settings
    appearance: {
      theme: user?.appearance?.theme || "dark",
      fontSize: user?.appearance?.fontSize || "medium",
      compactView: user?.appearance?.compactView || false,
      animations: user?.appearance?.animations || true,
      accentColor: user?.appearance?.accentColor || "purple",
    },
    // Security Settings
    security: {
      lastPasswordChange: user?.security?.lastPasswordChange || "2024-01-15",
      loginHistory: user?.security?.loginHistory || [
        { date: "2024-03-15 10:30", device: "Chrome on Windows", location: "New York, USA", ip: "192.168.1.1" },
        { date: "2024-03-14 15:45", device: "Safari on Mac", location: "New York, USA", ip: "192.168.1.1" },
        { date: "2024-03-13 09:20", device: "Chrome on Android", location: "New York, USA", ip: "192.168.1.1" },
      ],
      activeSessions: user?.security?.activeSessions || [
        { device: "Chrome on Windows", location: "New York, USA", current: true },
        { device: "Safari on iPhone", location: "New York, USA", current: false },
      ],
      backupEmail: user?.security?.backupEmail || "",
      backupPhone: user?.security?.backupPhone || "",
    },
    // Data & Privacy
    data: {
      exportRequested: user?.data?.exportRequested || false,
      exportDate: user?.data?.exportDate || null,
      deleteRequested: user?.data?.deleteRequested || false,
      deleteDate: user?.data?.deleteDate || null,
      dataRetention: user?.data?.dataRetention || "1year",
      marketingConsent: user?.data?.marketingConsent || false,
      cookieConsent: user?.data?.cookieConsent || true,
    },
  });

  // Persist settings to localStorage on change
  useEffect(() => {
    if (user) {
      const updatedUser = {
        ...user,
        language: settings.account.language,
        timezone: settings.account.timezone,
        dateFormat: settings.account.dateFormat,
        privacy: settings.privacy,
        notifications: settings.notifications,
        appearance: settings.appearance,
        security: settings.security,
        data: settings.data,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [settings, user]);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempEmail, setTempEmail] = useState(settings.account.email);
  const [tempUsername, setTempUsername] = useState(settings.account.username);

  // Dynamic Styles based on Appearance Settings
  const getDynamicStyles = (baseStyles, appSettings) => {
    const { theme, accentColor, fontSize, compactView, animations } = appSettings;
    const isLight = theme === "light";
    
    const accentColors = {
      purple: "#6d5dfc",
      blue: "#3b82f6",
      green: "#10b981",
      red: "#ef4444",
      orange: "#f97316",
      pink: "#ec4899"
    };
    
    const activeAccent = accentColors[accentColor] || accentColors.purple;
    
    const fontSizeMap = {
      small: "0.9rem",
      medium: "1rem",
      large: "1.1rem"
    };
    
    const activeFontSize = fontSizeMap[fontSize] || fontSizeMap.medium;

    const newStyles = JSON.parse(JSON.stringify(baseStyles));

    // Theme Overrides
    if (isLight) {
      newStyles.page.background = "#f8fafc";
      newStyles.header.color = "#1e293b";
      newStyles.logo.color = "#1e293b";
      newStyles.subtitle.color = "#64748b";
      newStyles.welcome.color = "#1e293b";
      newStyles.heroText.color = "#475569";
      newStyles.card.background = "rgba(255, 255, 255, 0.9)";
      newStyles.card.border = "1px solid rgba(0, 0, 0, 0.1)";
      newStyles.cardTitle.color = "#1e293b";
      newStyles.cardDesc.color = "#475569";
      newStyles.statLabel.color = "#64748b";
      newStyles.statValue.color = "#1e293b";
      newStyles.bgGradient.background = "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.05), transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05), transparent 50%)";
    }

    // Accent Color Overrides
    newStyles.logoIcon.background = `linear-gradient(135deg, ${activeAccent}, ${activeAccent}dd)`;
    newStyles.welcomeBadge.color = activeAccent;
    newStyles.welcomeBadge.background = `${activeAccent}15`;
    
    // Font Size Overrides
    newStyles.page.fontSize = activeFontSize;
    
    // Compact View Overrides
    if (compactView) {
      newStyles.grid.gap = "16px";
      newStyles.card.padding = "20px";
      newStyles.iconBox.width = "48px";
      newStyles.iconBox.height = "48px";
      newStyles.cardTitle.fontSize = "18px";
      newStyles.cardTitle.marginBottom = "8px";
    }

    // Animations Overrides
    if (!animations) {
      newStyles.card.transition = "none";
      newStyles.exploreBtn.transition = "none";
      // Additional transition resets could be added here
    }

    return newStyles;
  };

  const currentStyles = getDynamicStyles(styles, settings.appearance);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  
  const [editFormData, setEditFormData] = useState({
    name: userName,
    email: userEmail,
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "Passionate professional looking to advance my career in technology and innovation.",
    title: user?.title || "",
    company: user?.company || "",
    education: user?.education || "",
    graduationYear: user?.graduationYear || "",
    skills: user?.skills || [],
    languages: user?.languages || [],
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    portfolio: user?.portfolio || "",
    experience: user?.experience || [],
    certifications: user?.certifications || []
  });
  
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const getStarted = () => {
    navigate("/analysis");
  };

  // Profile navigation functions
  const handleMyProfile = () => {
    setShowProfileModal(true);
    setShowProfileMenu(false);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    setShowProfileMenu(false);
  };

  const handleEmailChange = () => {
    if (isEditingEmail) {
      handleSettingChange("account", "email", tempEmail);
      const updatedUser = { ...user, email: tempEmail };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditFormData({ ...editFormData, email: tempEmail });
    }
    setIsEditingEmail(!isEditingEmail);
  };

  const handleUsernameChange = () => {
    if (isEditingUsername) {
      handleSettingChange("account", "username", tempUsername);
      const updatedUser = { ...user, name: tempUsername, username: tempUsername };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditFormData({ ...editFormData, name: tempUsername });
    }
    setIsEditingUsername(!isEditingUsername);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Settings Functions
  const handleAccountSettings = () => {
    setShowSettingsModal(true);
    setActiveSettingsTab("account");
    setShowProfileMenu(false);
  };

  const handlePrivacySettings = () => {
    setShowPrivacyModal(true);
    setShowProfileMenu(false);
  };

  const handleNotificationPreferences = () => {
    setShowNotificationsModal(true);
    setShowProfileMenu(false);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setShowProfileMenu(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({});
    setPasswordSuccess(false);
  };

  const handleHelpSupport = () => {
    setShowHelpModal(true);
    setShowProfileMenu(false);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  const handleCloseNotificationsModal = () => {
    setShowNotificationsModal(false);
  };

  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
  };

  // Settings Change Handlers
  const handleSettingChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  // Password Change Handler
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    setPasswordErrors({ ...passwordErrors, [e.target.name]: "" });
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(passwordForm.newPassword)) {
      errors.newPassword = "Password must contain uppercase, lowercase and number";
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handleSavePassword = () => {
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    // Simulate password change
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess(false);
    }, 2000);
    
    // Update security settings
    const updatedSettings = { ...settings };
    updatedSettings.security.lastPasswordChange = new Date().toISOString().split('T')[0];
    setSettings(updatedSettings);
    
    const updatedUser = {
      ...user,
      security: updatedSettings.security
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Two Factor Authentication
  const handleTwoFactorToggle = () => {
    const newValue = !settings.privacy.twoFactorAuth;
    handleSettingChange("privacy", "twoFactorAuth", newValue);
    
    if (newValue) {
      alert("2FA setup would be initiated here. For demo purposes, we're simulating this feature.");
    }
  };

  // Data Export
  const handleExportData = () => {
    setExportInProgress(true);
    
    // Simulate data export
    setTimeout(() => {
      const exportData = {
        profile: editFormData,
        settings: settings,
        resume: user?.resume || null,
        exportDate: new Date().toISOString(),
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `careerlens-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setExportInProgress(false);
      setExportComplete(true);
      
      setTimeout(() => setExportComplete(false), 3000);
      
      // Update settings
      const updatedSettings = { ...settings };
      updatedSettings.data.exportRequested = true;
      updatedSettings.data.exportDate = new Date().toISOString();
      setSettings(updatedSettings);
      
      const updatedUser = {
        ...user,
        data: updatedSettings.data
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }, 2000);
  };

  // Account Deletion
  const handleDeleteAccountClick = () => {
    setShowDeleteConfirmModal(true);
    setShowProfileMenu(false);
    setDeleteConfirmText("");
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setDeleteConfirmText("");
    setIsDeleting(false);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      setIsDeleting(true);
      
      // Simulate account deletion
      setTimeout(() => {
        localStorage.removeItem("user");
        navigate("/register");
      }, 2000);
    }
  };

  // Session Management
  const handleLogoutOtherSessions = () => {
    const updatedSettings = { ...settings };
    updatedSettings.security.activeSessions = updatedSettings.security.activeSessions.filter(
      session => session.current === true
    );
    setSettings(updatedSettings);
    
    const updatedUser = {
      ...user,
      security: updatedSettings.security
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    alert("All other sessions have been logged out.");
  };

  const handleRevokeSession = (device) => {
    const updatedSettings = { ...settings };
    updatedSettings.security.activeSessions = updatedSettings.security.activeSessions.filter(
      session => session.device !== device
    );
    setSettings(updatedSettings);
    
    const updatedUser = {
      ...user,
      security: updatedSettings.security
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Resume Upload Functions
  const handleUploadResume = () => {
    setShowResumeModal(true);
    setShowProfileMenu(false);
    setUploadSuccess(false);
    setUploadError("");
    setResumeUploadProgress(0);
  };

  const handleCloseResumeModal = () => {
    setShowResumeModal(false);
    setResumeFile(null);
    setResumeUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(false);
    setUploadError("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size should be less than 5MB");
        return;
      }

      setResumeFile(file);
      setResumeFileName(file.name);
      setUploadError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size should be less than 5MB");
        return;
      }

      setResumeFile(file);
      setResumeFileName(file.name);
      setUploadError("");
    }
  };

  const handleSaveResume = () => {
    if (!resumeFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setResumeUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const resumeData = {
            name: resumeFile.name,
            type: resumeFile.type,
            size: resumeFile.size,
            lastModified: resumeFile.lastModified,
            data: e.target.result,
            uploadDate: new Date().toISOString()
          };
          
          const updatedUser = {
            ...user,
            resume: resumeData,
            resumeName: resumeFile.name
          };
          
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setResumeFileName(resumeFile.name);
          setIsUploading(false);
          setUploadSuccess(true);
          
          setTimeout(() => {
            handleCloseResumeModal();
          }, 2000);
        };
        reader.readAsDataURL(resumeFile);
      }
    }, 100);
  };

  const handleViewResume = () => {
    if (user?.resume?.data) {
      const byteCharacters = atob(user.resume.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: user.resume.type });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      alert("No resume found. Please upload your resume first.");
    }
    setShowProfileMenu(false);
  };

  const handleDownloadResume = () => {
    if (user?.resume?.data) {
      const link = document.createElement('a');
      link.href = user.resume.data;
      link.download = user.resume.name || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No resume found. Please upload your resume first.");
    }
    setShowProfileMenu(false);
  };

  const handleDeleteResume = () => {
    if (window.confirm("Are you sure you want to delete your resume?")) {
      const updatedUser = {
        ...user,
        resume: null,
        resumeName: ""
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setResumeFileName("");
      setResumeFile(null);
      alert("Resume deleted successfully!");
    }
    setShowProfileMenu(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      location: editFormData.location,
      bio: editFormData.bio,
      title: editFormData.title,
      company: editFormData.company,
      education: editFormData.education,
      graduationYear: editFormData.graduationYear,
      skills: editFormData.skills,
      languages: editFormData.languages,
      linkedin: editFormData.linkedin,
      github: editFormData.github,
      portfolio: editFormData.portfolio,
      experience: editFormData.experience,
      certifications: editFormData.certifications
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
    alert("Profile updated successfully!");
  };

  const handleAddSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) {
      setEditFormData({
        ...editFormData,
        skills: [...editFormData.skills, newSkill]
      });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditFormData({
      ...editFormData,
      skills: editFormData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddLanguage = () => {
    const newLanguage = prompt("Enter new language:");
    if (newLanguage) {
      setEditFormData({
        ...editFormData,
        languages: [...editFormData.languages, newLanguage]
      });
    }
  };

  const handleRemoveLanguage = (languageToRemove) => {
    setEditFormData({
      ...editFormData,
      languages: editFormData.languages.filter(lang => lang !== languageToRemove)
    });
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: editFormData.experience.length + 1,
      title: prompt("Enter job title:"),
      company: prompt("Enter company name:"),
      duration: prompt("Enter duration (e.g., 2021-Present):"),
      description: prompt("Enter description:")
    };
    if (newExperience.title && newExperience.company) {
      setEditFormData({
        ...editFormData,
        experience: [...editFormData.experience, newExperience]
      });
    }
  };

  const handleRemoveExperience = (id) => {
    setEditFormData({
      ...editFormData,
      experience: editFormData.experience.filter(exp => exp.id !== id)
    });
  };

  const handleAddCertification = () => {
    const newCertification = {
      id: editFormData.certifications.length + 1,
      name: prompt("Enter certification name:"),
      issuer: prompt("Enter issuing organization:"),
      year: prompt("Enter year obtained:")
    };
    if (newCertification.name && newCertification.issuer) {
      setEditFormData({
        ...editFormData,
        certifications: [...editFormData.certifications, newCertification]
      });
    }
  };

  const handleRemoveCertification = (id) => {
    setEditFormData({
      ...editFormData,
      certifications: editFormData.certifications.filter(cert => cert.id !== id)
    });
  };

  const handleSkills = () => {
    handleEditProfile();
    setTimeout(() => {
      document.querySelector('[name="skills"]')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleExperience = () => {
    handleEditProfile();
    setTimeout(() => {
      document.querySelector('[name="experience"]')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEducation = () => {
    handleEditProfile();
    setTimeout(() => {
      document.querySelector('[name="education"]')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCertifications = () => {
    handleEditProfile();
    setTimeout(() => {
      document.querySelector('[name="certifications"]')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLinkedInConnect = () => {
    window.open("https://linkedin.com", "_blank");
    setShowProfileMenu(false);
  };

  const handleGithubConnect = () => {
    window.open("https://github.com", "_blank");
    setShowProfileMenu(false);
  };

  const handlePortfolio = () => {
    if (editFormData.portfolio) {
      window.open(editFormData.portfolio, "_blank");
    } else {
      handleEditProfile();
    }
    setShowProfileMenu(false);
  };

  const cards = [
    {
      title: "Skill & Interest Analysis",
      desc: "Discover your strengths, interests, and growth areas using AI insights.",
      icon: <BarChart3 size={36} />,
      color: "#6d5dfc",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      stats: { value: "", label: "Skills Analyzed" },
      badge: "AI-Powered",
      path: "/analysis",
    },
    {
      title: "Career Recommendations",
      desc: "Get personalized career paths with smart backup options tailored to your profile.",
      icon: <Target size={36} />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
      stats: { value: "", label: "Careers Matched" },
      badge: "Personalized",
      path: "/recommendations",
    },
    {
      title: "Jobs & Companies",
      desc: "Explore curated job roles and top companies that align with your strengths.",
      icon: <Briefcase size={36} />,
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      stats: { value: "", label: "Active Jobs" },
      badge: "Updated Daily",
      path: "/jobs",
    },
    {
      title: "Progress Tracker",
      desc: "Monitor your learning journey and career milestones with visual insights.",
      icon: <TrendingUp size={36} />,
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
      stats: { value: "", label: "Goal Progress" },
      badge: "Track Growth",
      path: "/progress",
    },
    {
      title: "AI Career Assistant",
      desc: "Get instant answers to career questions with our intelligent AI chatbot.",
      icon: <MessageCircle size={36} />,
      color: "#f97316",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      stats: { value: "24/7", label: "Available" },
      badge: "Smart AI",
      path: "/assistant",
    },
    {
      title: "Job Finder",
      desc: "Find your ideal job with advanced search and personalized filters.",
      icon: <Globe2 size={36} />,
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)",
      stats: { value: "", label: "New Jobs" },
      badge: "Find Jobs",
      path: "/job-finder",
    },
  ];

  const statsData = [];

  const getUserInitials = () => {
    if (!editFormData.name) return "U";
    const nameParts = editFormData.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={currentStyles.page}>
      {/* ANIMATED BACKGROUND */}
      <div style={currentStyles.bgGradient} />
      <div style={{ ...currentStyles.blob, ...currentStyles.blob1 }} />
      <div style={{ ...currentStyles.blob, ...currentStyles.blob2 }} />
      <div style={{ ...currentStyles.blob, ...currentStyles.blob3 }} />
      
      {/* GRID PATTERN OVERLAY */}
      <div style={currentStyles.gridPattern} />

      {/* CONTENT */}
      <div style={currentStyles.content}>
        {/* HEADER */}
        <header style={currentStyles.header}>
          <div style={currentStyles.logoSection}>
            <div style={currentStyles.logoIcon}>
              <Sparkles size={24} color="#fff" />
            </div>
            <div>
              <h1 style={currentStyles.logo}>Career Lens</h1>
              <p style={currentStyles.subtitle}>AI-Powered Career Intelligence</p>
            </div>
          </div>

          <div style={currentStyles.userSection}>
            {/* USER PROFILE */}
            <div 
              style={currentStyles.userProfile}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div style={currentStyles.userAvatar}>
                <span style={currentStyles.userInitials}>{getUserInitials()}</span>
              </div>
              <div style={currentStyles.userInfo}>
                <div style={currentStyles.userName}>{editFormData.name}</div>
                <div style={currentStyles.userEmail}>{editFormData.email}</div>
              </div>
            </div>

            {/* PROFILE DROPDOWN MENU */}
            {showProfileMenu && (
              <div style={currentStyles.profileMenu}>
                {/* Profile Header */}
                <div style={currentStyles.profileMenuHeader}>
                  <div style={currentStyles.profileMenuAvatar}>
                    {getUserInitials()}
                  </div>
                  <div style={currentStyles.profileMenuUserInfo}>
                    <div style={currentStyles.profileMenuName}>{editFormData.name}</div>
                    <div style={currentStyles.profileMenuEmail}>{editFormData.email}</div>
                  </div>
                </div>

                <div style={currentStyles.profileDivider} />

                {/* Basic Profile Section */}
                <div style={currentStyles.profileMenuSection}>
                  <div style={currentStyles.profileMenuSectionTitle}>Profile</div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleMyProfile}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleEditProfile}
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </div>
                </div>

                {/* Career Profile Section */}
                <div style={currentStyles.profileMenuSection}>
                  <div style={currentStyles.profileMenuSectionTitle}>Career</div>
                  {user?.resume ? (
                    <>
                      <div 
                        style={currentStyles.profileMenuItem}
                        onClick={handleViewResume}
                      >
                        <FileText size={16} />
                        <span>View Resume</span>
                      </div>
                      <div 
                        style={currentStyles.profileMenuItem}
                        onClick={handleDownloadResume}
                      >
                        <Download size={16} />
                        <span>Download Resume</span>
                      </div>
                      <div 
                        style={currentStyles.profileMenuItem}
                        onClick={handleUploadResume}
                      >
                        <Upload size={16} />
                        <span>Update Resume</span>
                      </div>
                      <div 
                        style={{...currentStyles.profileMenuItem, ...currentStyles.deleteAccountMenuItem}}
                        onClick={handleDeleteResume}
                      >
                        <Trash2 size={16} />
                        <span>Delete Resume</span>
                      </div>
                    </>
                  ) : (
                    <div 
                      style={currentStyles.profileMenuItem}
                      onClick={handleUploadResume}
                    >
                      <Upload size={16} />
                      <span>Upload Resume</span>
                    </div>
                  )}
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleSkills}
                  >
                    <Zap size={16} />
                    <span>My Skills</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleExperience}
                  >
                    <WorkIcon size={16} />
                    <span>Work Experience</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleEducation}
                  >
                    <GraduationCap size={16} />
                    <span>Education</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleCertifications}
                  >
                    <CertificationIcon size={16} />
                    <span>Certifications</span>
                  </div>
                </div>

                {/* Professional Links Section */}
                <div style={currentStyles.profileMenuSection}>
                  <div style={currentStyles.profileMenuSectionTitle}>Professional Links</div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleLinkedInConnect}
                  >
                    <Linkedin size={16} />
                    <span>Connect LinkedIn</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleGithubConnect}
                  >
                    <Github size={16} />
                    <span>Connect GitHub</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handlePortfolio}
                  >
                    <Globe size={16} />
                    <span>Portfolio</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={currentStyles.profileMenuSection}>
                  <div style={currentStyles.profileMenuSectionTitle}>Contact</div>
                  <div style={currentStyles.profileMenuItem}>
                    <Mail size={16} />
                    <span>{editFormData.email}</span>
                  </div>
                  {editFormData.phone && (
                    <div style={currentStyles.profileMenuItem}>
                      <Phone size={16} />
                      <span>{editFormData.phone}</span>
                    </div>
                  )}
                  {editFormData.location && (
                    <div style={currentStyles.profileMenuItem}>
                      <MapPin size={16} />
                      <span>{editFormData.location}</span>
                    </div>
                  )}
                  {user?.joinDate && (
                    <div style={currentStyles.profileMenuItem}>
                      <Calendar size={16} />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  )}
                </div>

                {/* Settings Section */}
                <div style={currentStyles.profileMenuSection}>
                  <div style={currentStyles.profileMenuSectionTitle}>Settings</div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleAccountSettings}
                  >
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleChangePassword}
                  >
                    <Shield size={16} />
                    <span>Change Password</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handlePrivacySettings}
                  >
                    <Lock size={16} />
                    <span>Privacy Settings</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleNotificationPreferences}
                  >
                    <Bell size={16} />
                    <span>Notifications</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={() => {
                      setActiveSettingsTab("appearance");
                      setShowSettingsModal(true);
                      setShowProfileMenu(false);
                    }}
                  >
                    <Palette size={16} />
                    <span>Appearance</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={() => {
                      setActiveSettingsTab("security");
                      setShowSettingsModal(true);
                      setShowProfileMenu(false);
                    }}
                  >
                    <ShieldIcon size={16} />
                    <span>Security</span>
                  </div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={() => {
                      setActiveSettingsTab("data");
                      setShowSettingsModal(true);
                      setShowProfileMenu(false);
                    }}
                  >
                    <Database size={16} />
                    <span>Data & Privacy</span>
                  </div>
                </div>

                {/* Help & Support */}
                <div style={currentStyles.profileMenuSection}>
                  <div style={currentStyles.profileMenuSectionTitle}>Support</div>
                  <div 
                    style={currentStyles.profileMenuItem}
                    onClick={handleHelpSupport}
                  >
                    <HelpCircle size={16} />
                    <span>Help & Support</span>
                  </div>
                </div>

                <div style={currentStyles.profileDivider} />

                {/* Logout & Delete Account */}
                <div 
                  style={{...currentStyles.profileMenuItem, ...currentStyles.logoutMenuItem}}
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
                <div 
                  style={{...currentStyles.profileMenuItem, ...currentStyles.deleteAccountMenuItem}}
                  onClick={handleDeleteAccountClick}
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </div>
              </div>
            )}

            <button
              style={currentStyles.logoutBtn}
              onClick={logout}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section style={currentStyles.hero}>
          <div style={currentStyles.welcomeBadge}>
            <Sparkles size={16} />
            <span>Your Career Dashboard</span>
          </div>
          <h2 style={currentStyles.welcome}>
            Welcome back, {editFormData.name.split(" ")[0]}! 👋
          </h2>
          <p style={currentStyles.heroText}>
            Your personalized career intelligence platform is ready. Explore AI-driven insights,
            discover opportunities, and accelerate your professional growth.
          </p>

          {/* QUICK STATS */}
          <div style={currentStyles.quickStats}>
            {statsData.map((stat, idx) => (
              <div key={idx} style={currentStyles.statCard}>
                <div style={currentStyles.statIcon}>{stat.icon}</div>
                <div style={currentStyles.statValue}>{stat.value}</div>
                <div style={currentStyles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
        

        {/* FEATURE CARDS */}
        <section style={currentStyles.grid}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                ...currentStyles.card,
                transform: hoveredCard === index ? "translateY(-12px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(card.path)}
            >
              {/* BADGE */}
              <div style={currentStyles.cardBadge}>
                <Sparkles size={12} />
                {card.badge}
              </div>

              {/* ICON */}
              <div
                style={{
                  ...currentStyles.iconBox,
                  background: card.gradient,
                  boxShadow: hoveredCard === index 
                    ? `0 20px 40px ${card.color}40`
                    : `0 10px 25px ${card.color}30`,
                }}
              >
                {card.icon}
              </div>

              {/* TITLE & DESC */}
              <h3 style={currentStyles.cardTitle}>{card.title}</h3>
              <p style={currentStyles.cardDesc}>{card.desc}</p>

              {/* STATS */}
              <div style={currentStyles.cardStats}>
                <div style={currentStyles.statNumber}>{card.stats.value}</div>
                <div style={currentStyles.statText}>{card.stats.label}</div>
              </div>

              {/* CTA BUTTON */}
              <button
                style={{
                  ...currentStyles.exploreBtn,
                  background: hoveredCard === index
                    ? card.gradient
                    : currentStyles.exploreBtn.background,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
              >
                Explore <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </section>

        {/* FOOTER CTA */}
        <div style={currentStyles.footerCTA}>
          <div style={currentStyles.ctaContent}>
            <h3 style={currentStyles.ctaTitle}>Ready to accelerate your career?</h3>
            <p style={currentStyles.ctaText}>Start by analyzing your skills and get personalized recommendations</p>
          </div>
          <button
            style={currentStyles.ctaButton}
            onClick={getStarted}
          >
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* MY PROFILE MODAL */}
      {showProfileModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseProfileModal}>
          <div style={currentStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>My Profile</h2>
              <button style={currentStyles.closeButton} onClick={handleCloseProfileModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.profileViewContainer}>
              {/* Profile Header with Avatar */}
              <div style={currentStyles.profileViewHeader}>
                <div style={currentStyles.profileViewAvatar}>
                  <span style={currentStyles.profileViewAvatarText}>{getUserInitials()}</span>
                </div>
                <div style={currentStyles.profileViewHeaderInfo}>
                  <h3 style={currentStyles.profileViewName}>{editFormData.name}</h3>
                  <p style={currentStyles.profileViewTitle}>{editFormData.title}</p>
                  {editFormData.company && (
                    <p style={currentStyles.profileViewCompany}>{editFormData.company}</p>
                  )}
                </div>
                <button 
                  style={currentStyles.editProfileButton}
                  onClick={() => {
                    handleCloseProfileModal();
                    handleEditProfile();
                  }}
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              </div>

              {/* Resume Status */}
              {user?.resume && settings.privacy.showResume && (
                <div style={currentStyles.resumeStatusCard}>
                  <div style={currentStyles.resumeStatusIcon}>
                    <FileText size={24} color="#667eea" />
                  </div>
                  <div style={currentStyles.resumeStatusInfo}>
                    <h4 style={currentStyles.resumeStatusTitle}>Resume Uploaded</h4>
                    <p style={currentStyles.resumeStatusName}>{user.resume.name}</p>
                    <p style={currentStyles.resumeStatusMeta}>
                      {formatFileSize(user.resume.size)} • Uploaded on {new Date(user.resume.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={currentStyles.resumeStatusActions}>
                    <button style={currentStyles.resumeActionButton} onClick={handleViewResume}>
                      <FileText size={16} />
                      View
                    </button>
                    <button style={currentStyles.resumeActionButton} onClick={handleDownloadResume}>
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Content */}
              <div style={currentStyles.profileViewContent}>
                {/* Bio Section */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>About</h4>
                  <p style={currentStyles.profileViewBio}>{editFormData.bio}</p>
                </div>

                {/* Contact Information */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Contact Information</h4>
                  <div style={currentStyles.profileViewInfoGrid}>
                    {settings.privacy.showEmail && (
                      <div style={currentStyles.profileViewInfoItem}>
                        <Mail size={16} style={currentStyles.profileViewInfoIcon} />
                        <span>{editFormData.email}</span>
                      </div>
                    )}
                    {editFormData.phone && settings.privacy.showPhone && (
                      <div style={currentStyles.profileViewInfoItem}>
                        <Phone size={16} style={currentStyles.profileViewInfoIcon} />
                        <span>{editFormData.phone}</span>
                      </div>
                    )}
                    {editFormData.location && settings.privacy.showLocation && (
                      <div style={currentStyles.profileViewInfoItem}>
                        <MapPin size={16} style={currentStyles.profileViewInfoIcon} />
                        <span>{editFormData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Education</h4>
                  <div style={currentStyles.profileViewEducation}>
                    <GraduationCap size={16} style={currentStyles.profileViewInfoIcon} />
                    <div>
                      <p style={currentStyles.profileViewEducationDegree}>{editFormData.education}</p>
                      <p style={currentStyles.profileViewEducationYear}>Class of {editFormData.graduationYear}</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Skills</h4>
                  <div style={currentStyles.profileViewSkills}>
                    {editFormData.skills.length > 0 ? (
                      editFormData.skills.map((skill, index) => (
                        <span key={index} style={currentStyles.profileViewSkillTag}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px"}}>No skills added yet</p>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Languages</h4>
                  <div style={currentStyles.profileViewLanguages}>
                    {editFormData.languages.length > 0 ? (
                      editFormData.languages.map((language, index) => (
                        <span key={index} style={currentStyles.profileViewLanguageTag}>
                          {language}
                        </span>
                      ))
                    ) : (
                      <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px"}}>No languages added yet</p>
                    )}
                  </div>
                </div>

                {/* Work Experience */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Work Experience</h4>
                  {editFormData.experience.length > 0 ? (
                    editFormData.experience.map((exp) => (
                      <div key={exp.id} style={currentStyles.profileViewExperience}>
                        <div style={currentStyles.profileViewExperienceHeader}>
                          <WorkIcon size={16} style={currentStyles.profileViewInfoIcon} />
                          <div>
                            <p style={currentStyles.profileViewExperienceTitle}>{exp.title}</p>
                            <p style={currentStyles.profileViewExperienceCompany}>{exp.company}</p>
                            <p style={currentStyles.profileViewExperienceDuration}>{exp.duration}</p>
                            <p style={currentStyles.profileViewExperienceDescription}>{exp.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px"}}>No work experience added yet</p>
                  )}
                </div>

                {/* Certifications */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Certifications</h4>
                  {editFormData.certifications.length > 0 ? (
                    editFormData.certifications.map((cert) => (
                      <div key={cert.id} style={currentStyles.profileViewCertification}>
                        <CertificationIcon size={16} style={currentStyles.profileViewInfoIcon} />
                        <div>
                          <p style={currentStyles.profileViewCertificationName}>{cert.name}</p>
                          <p style={currentStyles.profileViewCertificationIssuer}>{cert.issuer} • {cert.year}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px"}}>No certifications added yet</p>
                  )}
                </div>

                {/* Professional Links */}
                <div style={currentStyles.profileViewSection}>
                  <h4 style={currentStyles.profileViewSectionTitle}>Professional Links</h4>
                  <div style={currentStyles.profileViewLinks}>
                    {editFormData.linkedin && (
                      <div style={currentStyles.profileViewLink}>
                        <Linkedin size={16} style={currentStyles.profileViewInfoIcon} />
                        <a href={editFormData.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {editFormData.github && (
                      <div style={currentStyles.profileViewLink}>
                        <Github size={16} style={currentStyles.profileViewInfoIcon} />
                        <a href={editFormData.github} target="_blank" rel="noopener noreferrer">
                          GitHub Profile
                        </a>
                      </div>
                    )}
                    {editFormData.portfolio && (
                      <div style={currentStyles.profileViewLink}>
                        <Globe size={16} style={currentStyles.profileViewInfoIcon} />
                        <a href={editFormData.portfolio} target="_blank" rel="noopener noreferrer">
                          Portfolio Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseEditModal}>
          <div style={{...currentStyles.modalContent, ...currentStyles.editModalContent}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>Edit Profile</h2>
              <button style={currentStyles.closeButton} onClick={handleCloseEditModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.editFormContainer}>
              {/* Avatar Upload Section */}
              <div style={currentStyles.avatarUploadSection}>
                <div style={currentStyles.editProfileAvatar}>
                  <span style={currentStyles.editProfileAvatarText}>{getUserInitials()}</span>
                </div>
                <button style={currentStyles.avatarUploadButton}>
                  <Camera size={16} />
                  Change Photo
                </button>
              </div>

              {/* Personal Information */}
              <div style={currentStyles.editFormSection}>
                <h3 style={currentStyles.editFormSectionTitle}>Personal Information</h3>
                <div style={currentStyles.editFormGrid}>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div style={currentStyles.editFormSection}>
                <h3 style={currentStyles.editFormSectionTitle}>Professional Information</h3>
                <div style={currentStyles.editFormGrid}>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Professional Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="e.g., Software Developer"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Current Company</label>
                    <input
                      type="text"
                      name="company"
                      value={editFormData.company}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="Company name"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={currentStyles.editFormSection}>
                <h3 style={currentStyles.editFormSectionTitle}>About Me</h3>
                <div style={currentStyles.editFormGroup}>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    style={currentStyles.editFormTextarea}
                    placeholder="Write a brief description about yourself"
                    rows="4"
                  />
                </div>
              </div>

              {/* Education */}
              <div style={currentStyles.editFormSection}>
                <h3 style={currentStyles.editFormSectionTitle}>Education</h3>
                <div style={currentStyles.editFormGrid}>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Degree</label>
                    <input
                      type="text"
                      name="education"
                      value={editFormData.education}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="e.g., Bachelor's in Computer Science"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Graduation Year</label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={editFormData.graduationYear}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={currentStyles.editFormSection}>
                <div style={currentStyles.editFormSectionHeader}>
                  <h3 style={currentStyles.editFormSectionTitle}>Skills</h3>
                  <button style={currentStyles.addButton} onClick={handleAddSkill}>
                    <Plus size={16} />
                    Add Skill
                  </button>
                </div>
                <div style={currentStyles.editSkillsList}>
                  {editFormData.skills.length > 0 ? (
                    editFormData.skills.map((skill, index) => (
                      <div key={index} style={currentStyles.editSkillItem}>
                        <span style={currentStyles.editSkillName}>{skill}</span>
                        <button 
                          style={currentStyles.removeButton}
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px", padding: "10px 0"}}>No skills added. Click "Add Skill" to get started.</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div style={currentStyles.editFormSection}>
                <div style={currentStyles.editFormSectionHeader}>
                  <h3 style={currentStyles.editFormSectionTitle}>Languages</h3>
                  <button style={currentStyles.addButton} onClick={handleAddLanguage}>
                    <Plus size={16} />
                    Add Language
                  </button>
                </div>
                <div style={currentStyles.editLanguagesList}>
                  {editFormData.languages.length > 0 ? (
                    editFormData.languages.map((language, index) => (
                      <div key={index} style={currentStyles.editLanguageItem}>
                        <span style={currentStyles.editLanguageName}>{language}</span>
                        <button 
                          style={currentStyles.removeButton}
                          onClick={() => handleRemoveLanguage(language)}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px", padding: "10px 0"}}>No languages added. Click "Add Language" to get started.</p>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div style={currentStyles.editFormSection} name="experience">
                <div style={currentStyles.editFormSectionHeader}>
                  <h3 style={currentStyles.editFormSectionTitle}>Work Experience</h3>
                  <button style={currentStyles.addButton} onClick={handleAddExperience}>
                    <Plus size={16} />
                    Add Experience
                  </button>
                </div>
                {editFormData.experience.length > 0 ? (
                  editFormData.experience.map((exp) => (
                    <div key={exp.id} style={currentStyles.editExperienceItem}>
                      <div style={currentStyles.editExperienceContent}>
                        <p style={currentStyles.editExperienceTitle}>{exp.title}</p>
                        <p style={currentStyles.editExperienceCompany}>{exp.company}</p>
                        <p style={currentStyles.editExperienceDuration}>{exp.duration}</p>
                        <p style={currentStyles.editExperienceDescription}>{exp.description}</p>
                      </div>
                      <button 
                        style={currentStyles.removeButton}
                        onClick={() => handleRemoveExperience(exp.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px", padding: "10px 0"}}>No work experience added. Click "Add Experience" to get started.</p>
                )}
              </div>

              {/* Certifications */}
              <div style={currentStyles.editFormSection} name="certifications">
                <div style={currentStyles.editFormSectionHeader}>
                  <h3 style={currentStyles.editFormSectionTitle}>Certifications</h3>
                  <button style={currentStyles.addButton} onClick={handleAddCertification}>
                    <Plus size={16} />
                    Add Certification
                  </button>
                </div>
                {editFormData.certifications.length > 0 ? (
                  editFormData.certifications.map((cert) => (
                    <div key={cert.id} style={currentStyles.editCertificationItem}>
                      <div style={currentStyles.editCertificationContent}>
                        <p style={currentStyles.editCertificationName}>{cert.name}</p>
                        <p style={currentStyles.editCertificationIssuer}>{cert.issuer}</p>
                        <p style={currentStyles.editCertificationYear}>{cert.year}</p>
                      </div>
                      <button 
                        style={currentStyles.removeButton}
                        onClick={() => handleRemoveCertification(cert.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{color: "rgba(255,255,255,0.5)", fontSize: "14px", padding: "10px 0"}}>No certifications added. Click "Add Certification" to get started.</p>
                )}
              </div>

              {/* Professional Links */}
              <div style={currentStyles.editFormSection}>
                <h3 style={currentStyles.editFormSectionTitle}>Professional Links</h3>
                <div style={currentStyles.editFormGrid}>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={editFormData.linkedin}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>GitHub Profile</label>
                    <input
                      type="url"
                      name="github"
                      value={editFormData.github}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div style={currentStyles.editFormGroup}>
                    <label style={currentStyles.editFormLabel}>Portfolio Website</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={editFormData.portfolio}
                      onChange={handleInputChange}
                      style={currentStyles.editFormInput}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={currentStyles.editFormActions}>
                <button style={currentStyles.cancelButton} onClick={handleCloseEditModal}>
                  Cancel
                </button>
                <button style={currentStyles.saveButton} onClick={handleSaveProfile}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESUME UPLOAD MODAL */}
      {showResumeModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseResumeModal}>
          <div style={{...currentStyles.modalContent, maxWidth: "600px"}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>
                {user?.resume ? "Update Resume" : "Upload Resume"}
              </h2>
              <button style={currentStyles.closeButton} onClick={handleCloseResumeModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.resumeUploadContainer}>
              {/* Current Resume Info */}
              {user?.resume && (
                <div style={currentStyles.currentResumeCard}>
                  <div style={currentStyles.currentResumeIcon}>
                    <FileText size={32} color="#667eea" />
                  </div>
                  <div style={currentStyles.currentResumeInfo}>
                    <h4 style={currentStyles.currentResumeTitle}>Current Resume</h4>
                    <p style={currentStyles.currentResumeName}>{user.resume.name}</p>
                    <p style={currentStyles.currentResumeMeta}>
                      {formatFileSize(user.resume.size)} • Uploaded on {new Date(user.resume.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={currentStyles.currentResumeActions}>
                    <button style={currentStyles.resumeIconButton} onClick={handleViewResume} title="View Resume">
                      <FileText size={20} />
                    </button>
                    <button style={currentStyles.resumeIconButton} onClick={handleDownloadResume} title="Download Resume">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div 
                style={{
                  ...currentStyles.uploadArea,
                  ...(uploadError ? currentStyles.uploadAreaError : {}),
                  ...(resumeFile ? currentStyles.uploadAreaSuccess : {})
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resumeUpload"
                  style={currentStyles.fileInput}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label htmlFor="resumeUpload" style={currentStyles.uploadLabel}>
                  {resumeFile ? (
                    <>
                      <FileText size={48} color="#667eea" />
                      <div style={currentStyles.uploadFileInfo}>
                        <p style={currentStyles.uploadFileName}>{resumeFile.name}</p>
                        <p style={currentStyles.uploadFileSize}>{formatFileSize(resumeFile.size)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={48} color="#667eea" />
                      <h3 style={currentStyles.uploadTitle}>Drag & Drop or Click to Upload</h3>
                      <p style={currentStyles.uploadSubtitle}>
                        Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div style={currentStyles.uploadErrorMessage}>
                  <AlertCircle size={20} color="#ff4444" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div style={currentStyles.uploadProgressContainer}>
                  <div style={currentStyles.uploadProgressHeader}>
                    <span style={currentStyles.uploadProgressLabel}>Uploading...</span>
                    <span style={currentStyles.uploadProgressPercentage}>{resumeUploadProgress}%</span>
                  </div>
                  <div style={currentStyles.uploadProgressBar}>
                    <div 
                      style={{
                        ...currentStyles.uploadProgressFill,
                        width: `${resumeUploadProgress}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div style={currentStyles.uploadSuccessMessage}>
                  <CheckCircle size={20} color="#10b981" />
                  <span>Resume uploaded successfully!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={currentStyles.uploadActions}>
                <button 
                  style={currentStyles.cancelButton}
                  onClick={handleCloseResumeModal}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  style={{
                    ...currentStyles.saveButton,
                    ...(isUploading || !resumeFile ? currentStyles.disabledButton : {})
                  }}
                  onClick={handleSaveResume}
                  disabled={isUploading || !resumeFile}
                >
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload size={16} />
                      {user?.resume ? "Update Resume" : "Upload Resume"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT SETTINGS MODAL */}
      {showSettingsModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseSettingsModal}>
          <div style={{...currentStyles.modalContent, ...currentStyles.settingsModalContent}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>Settings</h2>
              <button style={currentStyles.closeButton} onClick={handleCloseSettingsModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.settingsContainer}>
              {/* Settings Sidebar */}
              <div style={currentStyles.settingsSidebar}>
                <div 
                  style={{
                    ...currentStyles.settingsTab,
                    ...(activeSettingsTab === "account" ? currentStyles.settingsTabActive : {})
                  }}
                  onClick={() => setActiveSettingsTab("account")}
                >
                  <Settings size={18} />
                  <span>Account</span>
                </div>
                <div 
                  style={{
                    ...currentStyles.settingsTab,
                    ...(activeSettingsTab === "security" ? currentStyles.settingsTabActive : {})
                  }}
                  onClick={() => setActiveSettingsTab("security")}
                >
                  <ShieldIcon size={18} />
                  <span>Security</span>
                </div>
                <div 
                  style={{
                    ...currentStyles.settingsTab,
                    ...(activeSettingsTab === "appearance" ? currentStyles.settingsTabActive : {})
                  }}
                  onClick={() => setActiveSettingsTab("appearance")}
                >
                  <Palette size={18} />
                  <span>Appearance</span>
                </div>
                <div 
                  style={{
                    ...currentStyles.settingsTab,
                    ...(activeSettingsTab === "data" ? currentStyles.settingsTabActive : {})
                  }}
                  onClick={() => setActiveSettingsTab("data")}
                >
                  <Database size={18} />
                  <span>Data & Privacy</span>
                </div>
              </div>

              {/* Settings Content */}
              <div style={currentStyles.settingsContent}>
                {/* Account Settings */}
                {activeSettingsTab === "account" && (
                  <div style={currentStyles.settingsPanel}>
                    <h3 style={currentStyles.settingsPanelTitle}>Account Settings</h3>
                    
                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Account Information</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Mail size={16} />
                          <span>Email Address</span>
                        </div>
                        <div style={currentStyles.settingsValue}>
                          {isEditingEmail ? (
                            <input 
                              style={currentStyles.settingsInput}
                              value={tempEmail}
                              onChange={(e) => setTempEmail(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <span>{settings.account.email}</span>
                          )}
                          <button 
                            style={currentStyles.settingsActionButton}
                            onClick={handleEmailChange}
                          >
                            {isEditingEmail ? "Save" : "Change"}
                          </button>
                        </div>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <User size={16} />
                          <span>Username</span>
                        </div>
                        <div style={currentStyles.settingsValue}>
                          {isEditingUsername ? (
                            <input 
                              style={currentStyles.settingsInput}
                              value={tempUsername}
                              onChange={(e) => setTempUsername(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            <span>{settings.account.username}</span>
                          )}
                          <button 
                            style={currentStyles.settingsActionButton}
                            onClick={handleUsernameChange}
                          >
                            {isEditingUsername ? "Save" : "Change"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Preferences</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Globe2 size={16} />
                          <span>Language</span>
                        </div>
                        <select 
                          style={currentStyles.settingsSelect}
                          value={settings.account.language}
                          onChange={(e) => handleSettingChange("account", "language", e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="hi">Hindi</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Clock size={16} />
                          <span>Timezone</span>
                        </div>
                        <select 
                          style={currentStyles.settingsSelect}
                          value={settings.account.timezone}
                          onChange={(e) => handleSettingChange("account", "timezone", e.target.value)}
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="CST">Central Time</option>
                          <option value="MST">Mountain Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="IST">Indian Standard Time</option>
                        </select>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Calendar size={16} />
                          <span>Date Format</span>
                        </div>
                        <select 
                          style={currentStyles.settingsSelect}
                          value={settings.account.dateFormat}
                          onChange={(e) => handleSettingChange("account", "dateFormat", e.target.value)}
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Connected Accounts</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Mail size={16} />
                          <span>Google</span>
                        </div>
                        <button style={currentStyles.settingsConnectButton}>
                          Connect
                        </button>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Linkedin size={16} />
                          <span>LinkedIn</span>
                        </div>
                        <button style={currentStyles.settingsConnectButton}>
                          Connect
                        </button>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Github size={16} />
                          <span>GitHub</span>
                        </div>
                        <button style={currentStyles.settingsConnectButton}>
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSettingsTab === "security" && (
                  <div style={currentStyles.settingsPanel}>
                    <h3 style={currentStyles.settingsPanelTitle}>Security Settings</h3>
                    
                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Password</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Key size={16} />
                          <span>Password</span>
                        </div>
                        <div style={currentStyles.settingsValue}>
                          <span>Last changed: {settings.security.lastPasswordChange}</span>
                          <button 
                            style={currentStyles.settingsActionButton}
                            onClick={() => {
                              handleCloseSettingsModal();
                              handleChangePassword();
                            }}
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Two-Factor Authentication</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Fingerprint size={16} />
                          <span>2FA Status</span>
                        </div>
                        <div style={currentStyles.settingsValue}>
                          <span style={{
                            color: settings.privacy.twoFactorAuth ? "#10b981" : "#6b7280"
                          }}>
                            {settings.privacy.twoFactorAuth ? "Enabled" : "Disabled"}
                          </span>
                          <button 
                            style={currentStyles.settingsActionButton}
                            onClick={handleTwoFactorToggle}
                          >
                            {settings.privacy.twoFactorAuth ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Active Sessions</h4>
                      
                      {settings.security.activeSessions.map((session, index) => (
                        <div key={index} style={currentStyles.sessionItem}>
                          <div style={currentStyles.sessionInfo}>
                            <MonitorSmartphone size={16} />
                            <div>
                              <p style={currentStyles.sessionDevice}>
                                {session.device}
                                {session.current && (
                                  <span style={currentStyles.currentSessionBadge}>Current</span>
                                )}
                              </p>
                              <p style={currentStyles.sessionLocation}>{session.location}</p>
                            </div>
                          </div>
                          {!session.current && (
                            <button 
                              style={currentStyles.sessionRevokeButton}
                              onClick={() => handleRevokeSession(session.device)}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}

                      <button 
                        style={currentStyles.settingsSecondaryButton}
                        onClick={handleLogoutOtherSessions}
                      >
                        <LogOut size={16} />
                        Log out all other sessions
                      </button>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Login History</h4>
                      
                      {settings.security.loginHistory.map((login, index) => (
                        <div key={index} style={currentStyles.loginHistoryItem}>
                          <History size={14} />
                          <div style={currentStyles.loginHistoryDetails}>
                            <span style={currentStyles.loginHistoryDevice}>{login.device}</span>
                            <span style={currentStyles.loginHistoryMeta}>
                              {login.location} • {login.ip} • {login.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Recovery Options</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Mail size={16} />
                          <span>Backup Email</span>
                        </div>
                        <input
                          type="email"
                          style={currentStyles.settingsInput}
                          placeholder="Enter backup email"
                          value={settings.security.backupEmail}
                          onChange={(e) => handleSettingChange("security", "backupEmail", e.target.value)}
                        />
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Smartphone size={16} />
                          <span>Backup Phone</span>
                        </div>
                        <input
                          type="tel"
                          style={currentStyles.settingsInput}
                          placeholder="Enter backup phone"
                          value={settings.security.backupPhone}
                          onChange={(e) => handleSettingChange("security", "backupPhone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeSettingsTab === "appearance" && (
                  <div style={currentStyles.settingsPanel}>
                    <h3 style={currentStyles.settingsPanelTitle}>Appearance Settings</h3>
                    
                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Theme</h4>
                      
                      <div style={currentStyles.themeOptions}>
                        <div 
                          style={{
                            ...currentStyles.themeOption,
                            ...(settings.appearance.theme === "light" ? currentStyles.themeOptionActive : {})
                          }}
                          onClick={() => handleSettingChange("appearance", "theme", "light")}
                        >
                          <Sun size={24} />
                          <span>Light</span>
                        </div>
                        <div 
                          style={{
                            ...currentStyles.themeOption,
                            ...(settings.appearance.theme === "dark" ? currentStyles.themeOptionActive : {})
                          }}
                          onClick={() => handleSettingChange("appearance", "theme", "dark")}
                        >
                          <Moon size={24} />
                          <span>Dark</span>
                        </div>
                        <div 
                          style={{
                            ...currentStyles.themeOption,
                            ...(settings.appearance.theme === "system" ? currentStyles.themeOptionActive : {})
                          }}
                          onClick={() => handleSettingChange("appearance", "theme", "system")}
                        >
                          <MonitorSmartphone size={24} />
                          <span>System</span>
                        </div>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Accent Color</h4>
                      
                      <div style={currentStyles.colorOptions}>
                        {["purple", "blue", "green", "red", "orange", "pink"].map((color) => (
                          <div
                            key={color}
                            style={{
                              ...currentStyles.colorOption,
                              background: color === "purple" ? "#667eea" :
                                         color === "blue" ? "#3b82f6" :
                                         color === "green" ? "#10b981" :
                                         color === "red" ? "#ef4444" :
                                         color === "orange" ? "#f97316" :
                                         "#ec4899",
                              ...(settings.appearance.accentColor === color ? currentStyles.colorOptionActive : {})
                            }}
                            onClick={() => handleSettingChange("appearance", "accentColor", color)}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Font Size</h4>
                      
                      <div style={currentStyles.fontSizeOptions}>
                        <div 
                          style={{
                            ...currentStyles.fontSizeOption,
                            ...(settings.appearance.fontSize === "small" ? currentStyles.fontSizeOptionActive : {})
                          }}
                          onClick={() => handleSettingChange("appearance", "fontSize", "small")}
                        >
                          <Type size={16} />
                          <span>Small</span>
                        </div>
                        <div 
                          style={{
                            ...currentStyles.fontSizeOption,
                            ...(settings.appearance.fontSize === "medium" ? currentStyles.fontSizeOptionActive : {})
                          }}
                          onClick={() => handleSettingChange("appearance", "fontSize", "medium")}
                        >
                          <Type size={18} />
                          <span>Medium</span>
                        </div>
                        <div 
                          style={{
                            ...currentStyles.fontSizeOption,
                            ...(settings.appearance.fontSize === "large" ? currentStyles.fontSizeOptionActive : {})
                          }}
                          onClick={() => handleSettingChange("appearance", "fontSize", "large")}
                        >
                          <Type size={20} />
                          <span>Large</span>
                        </div>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Layout</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Layout size={16} />
                          <span>Compact View</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.appearance.compactView}
                            onChange={(e) => handleSettingChange("appearance", "compactView", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Zap size={16} />
                          <span>Animations</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.appearance.animations}
                            onChange={(e) => handleSettingChange("appearance", "animations", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Privacy Settings */}
                {activeSettingsTab === "data" && (
                  <div style={currentStyles.settingsPanel}>
                    <h3 style={currentStyles.settingsPanelTitle}>Data & Privacy</h3>
                    
                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Privacy Controls</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <User size={16} />
                          <span>Profile Visibility</span>
                        </div>
                        <select 
                          style={currentStyles.settingsSelect}
                          value={settings.privacy.profileVisibility}
                          onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="connections">Connections Only</option>
                        </select>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Mail size={16} />
                          <span>Show Email</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showEmail}
                            onChange={(e) => handleSettingChange("privacy", "showEmail", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Phone size={16} />
                          <span>Show Phone</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showPhone}
                            onChange={(e) => handleSettingChange("privacy", "showPhone", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <MapPin size={16} />
                          <span>Show Location</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showLocation}
                            onChange={(e) => handleSettingChange("privacy", "showLocation", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <FileText size={16} />
                          <span>Show Resume</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showResume}
                            onChange={(e) => handleSettingChange("privacy", "showResume", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <WorkIcon size={16} />
                          <span>Show Experience</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showExperience}
                            onChange={(e) => handleSettingChange("privacy", "showExperience", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <GraduationCap size={16} />
                          <span>Show Education</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showEducation}
                            onChange={(e) => handleSettingChange("privacy", "showEducation", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Zap size={16} />
                          <span>Show Skills</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.showSkills}
                            onChange={(e) => handleSettingChange("privacy", "showSkills", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <UserCheck size={16} />
                          <span>Activity Status</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.privacy.activityStatus}
                            onChange={(e) => handleSettingChange("privacy", "activityStatus", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Data Management</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <DownloadIcon size={16} />
                          <span>Export Your Data</span>
                        </div>
                        <button 
                          style={currentStyles.settingsPrimaryButton}
                          onClick={handleExportData}
                          disabled={exportInProgress}
                        >
                          {exportInProgress ? (
                            <>Exporting...</>
                          ) : exportComplete ? (
                            <>Exported ✓</>
                          ) : (
                            <>Export Data</>
                          )}
                        </button>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <RefreshCw size={16} />
                          <span>Data Retention</span>
                        </div>
                        <select 
                          style={currentStyles.settingsSelect}
                          value={settings.data.dataRetention}
                          onChange={(e) => handleSettingChange("data", "dataRetention", e.target.value)}
                        >
                          <option value="1year">1 Year</option>
                          <option value="2years">2 Years</option>
                          <option value="5years">5 Years</option>
                          <option value="indefinite">Indefinite</option>
                        </select>
                      </div>
                    </div>

                    <div style={currentStyles.settingsGroup}>
                      <h4 style={currentStyles.settingsGroupTitle}>Cookie Preferences</h4>
                      
                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Cookie size={16} />
                          <span>Essential Cookies</span>
                        </div>
                        <span style={currentStyles.alwaysEnabled}>Always Enabled</span>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <BarChart3 size={16} />
                          <span>Analytics Cookies</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.data.cookieConsent}
                            onChange={(e) => handleSettingChange("data", "cookieConsent", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>

                      <div style={currentStyles.settingsRow}>
                        <div style={currentStyles.settingsLabel}>
                          <Target size={16} />
                          <span>Marketing Cookies</span>
                        </div>
                        <label style={currentStyles.switch}>
                          <input
                            type="checkbox"
                            checked={settings.data.marketingConsent}
                            onChange={(e) => handleSettingChange("data", "marketingConsent", e.target.checked)}
                          />
                          <span style={currentStyles.slider}></span>
                        </label>
                      </div>
                    </div>

                    <div style={{...currentStyles.settingsGroup, ...currentStyles.dangerZone}}>
                      <h4 style={currentStyles.dangerZoneTitle}>Danger Zone</h4>
                      
                      <div style={currentStyles.dangerZoneItem}>
                        <div>
                          <p style={currentStyles.dangerZoneItemTitle}>Delete Account</p>
                          <p style={currentStyles.dangerZoneItemDesc}>
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <button 
                          style={currentStyles.dangerButton}
                          onClick={handleDeleteAccountClick}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div style={currentStyles.modalOverlay} onClick={handleClosePasswordModal}>
          <div style={{...currentStyles.modalContent, maxWidth: "500px"}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>Change Password</h2>
              <button style={currentStyles.closeButton} onClick={handleClosePasswordModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.passwordChangeContainer}>
              {passwordSuccess ? (
                <div style={currentStyles.passwordSuccessMessage}>
                  <CheckCircle size={48} color="#10b981" />
                  <h3>Password Changed Successfully!</h3>
                  <p>Your password has been updated. You can now use your new password to log in.</p>
                </div>
              ) : (
                <>
                  <div style={currentStyles.passwordFormGroup}>
                    <label style={currentStyles.passwordLabel}>Current Password</label>
                    <div style={currentStyles.passwordInputWrapper}>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        style={currentStyles.passwordInput}
                        placeholder="Enter current password"
                      />
                      <button 
                        style={currentStyles.passwordToggleButton}
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p style={currentStyles.passwordError}>{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div style={currentStyles.passwordFormGroup}>
                    <label style={currentStyles.passwordLabel}>New Password</label>
                    <div style={currentStyles.passwordInputWrapper}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        style={currentStyles.passwordInput}
                        placeholder="Enter new password"
                      />
                      <button 
                        style={currentStyles.passwordToggleButton}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p style={currentStyles.passwordError}>{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div style={currentStyles.passwordRequirements}>
                    <p style={currentStyles.passwordRequirementsTitle}>Password requirements:</p>
                    <ul style={currentStyles.passwordRequirementsList}>
                      <li style={{
                        color: passwordForm.newPassword.length >= 8 ? "#10b981" : "#6b7280"
                      }}>
                        ✓ At least 8 characters
                      </li>
                      <li style={{
                        color: /[A-Z]/.test(passwordForm.newPassword) ? "#10b981" : "#6b7280"
                      }}>
                        ✓ At least one uppercase letter
                      </li>
                      <li style={{
                        color: /[a-z]/.test(passwordForm.newPassword) ? "#10b981" : "#6b7280"
                      }}>
                        ✓ At least one lowercase letter
                      </li>
                      <li style={{
                        color: /[0-9]/.test(passwordForm.newPassword) ? "#10b981" : "#6b7280"
                      }}>
                        ✓ At least one number
                      </li>
                    </ul>
                  </div>

                  <div style={currentStyles.passwordFormGroup}>
                    <label style={currentStyles.passwordLabel}>Confirm New Password</label>
                    <div style={currentStyles.passwordInputWrapper}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        style={currentStyles.passwordInput}
                        placeholder="Confirm new password"
                      />
                      <button 
                        style={currentStyles.passwordToggleButton}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p style={currentStyles.passwordError}>{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div style={currentStyles.passwordFormActions}>
                    <button style={currentStyles.cancelButton} onClick={handleClosePasswordModal}>
                      Cancel
                    </button>
                    <button 
                      style={currentStyles.saveButton}
                      onClick={handleSavePassword}
                    >
                      <Key size={16} />
                      Update Password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY SETTINGS MODAL */}
      {showPrivacyModal && (
        <div style={currentStyles.modalOverlay} onClick={handleClosePrivacyModal}>
          <div style={{...currentStyles.modalContent, maxWidth: "600px"}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>Privacy Settings</h2>
              <button style={currentStyles.closeButton} onClick={handleClosePrivacyModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.privacyContainer}>
              <div style={currentStyles.settingsGroup}>
                <h4 style={currentStyles.settingsGroupTitle}>Profile Visibility</h4>
                
                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <User size={16} />
                    <span>Who can see your profile</span>
                  </div>
                  <select 
                    style={currentStyles.settingsSelect}
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                  >
                    <option value="public">Everyone</option>
                    <option value="private">Only me</option>
                    <option value="connections">My connections</option>
                  </select>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <UserCheck size={16} />
                    <span>Show when you're active</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.activityStatus}
                      onChange={(e) => handleSettingChange("privacy", "activityStatus", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>
              </div>

              <div style={currentStyles.settingsGroup}>
                <h4 style={currentStyles.settingsGroupTitle}>Profile Information</h4>
                
                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Mail size={16} />
                    <span>Show email address</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showEmail}
                      onChange={(e) => handleSettingChange("privacy", "showEmail", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Phone size={16} />
                    <span>Show phone number</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showPhone}
                      onChange={(e) => handleSettingChange("privacy", "showPhone", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <MapPin size={16} />
                    <span>Show location</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showLocation}
                      onChange={(e) => handleSettingChange("privacy", "showLocation", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>
              </div>

              <div style={currentStyles.settingsGroup}>
                <h4 style={currentStyles.settingsGroupTitle}>Career Information</h4>
                
                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <FileText size={16} />
                    <span>Show resume</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showResume}
                      onChange={(e) => handleSettingChange("privacy", "showResume", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <WorkIcon size={16} />
                    <span>Show work experience</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showExperience}
                      onChange={(e) => handleSettingChange("privacy", "showExperience", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <GraduationCap size={16} />
                    <span>Show education</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showEducation}
                      onChange={(e) => handleSettingChange("privacy", "showEducation", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Zap size={16} />
                    <span>Show skills</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showSkills}
                      onChange={(e) => handleSettingChange("privacy", "showSkills", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>
              </div>

              <div style={currentStyles.settingsGroup}>
                <h4 style={currentStyles.settingsGroupTitle}>Two-Factor Authentication</h4>
                
                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Fingerprint size={16} />
                    <span>Enable 2FA</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.privacy.twoFactorAuth}
                      onChange={handleTwoFactorToggle}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>
              </div>

              <div style={currentStyles.settingsFormActions}>
                <button style={currentStyles.cancelButton} onClick={handleClosePrivacyModal}>
                  Cancel
                </button>
                <button style={currentStyles.saveButton} onClick={handleClosePrivacyModal}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION SETTINGS MODAL */}
      {showNotificationsModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseNotificationsModal}>
          <div style={{...currentStyles.modalContent, maxWidth: "600px"}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>Notification Settings</h2>
              <button style={currentStyles.closeButton} onClick={handleCloseNotificationsModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.notificationsContainer}>
              <div style={currentStyles.settingsGroup}>
                <h4 style={currentStyles.settingsGroupTitle}>Notification Channels</h4>
                
                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <MailCheck size={16} />
                    <span>Email Notifications</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <BellRing size={16} />
                    <span>Push Notifications</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Smartphone size={16} />
                    <span>SMS Notifications</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Volume2 size={16} />
                    <span>Sound</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.sound}
                      onChange={(e) => handleSettingChange("notifications", "sound", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <MonitorSmartphone size={16} />
                    <span>Desktop Notifications</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.desktop}
                      onChange={(e) => handleSettingChange("notifications", "desktop", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>
              </div>

              <div style={currentStyles.settingsGroup}>
                <h4 style={currentStyles.settingsGroupTitle}>Notification Types</h4>
                
                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Briefcase size={16} />
                    <span>Job Alerts</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.jobAlerts}
                      onChange={(e) => handleSettingChange("notifications", "jobAlerts", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Sparkles size={16} />
                    <span>Career Tips</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.careerTips}
                      onChange={(e) => handleSettingChange("notifications", "careerTips", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <User size={16} />
                    <span>Profile Views</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.profileViews}
                      onChange={(e) => handleSettingChange("notifications", "profileViews", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <MessageCircle size={16} />
                    <span>Messages</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.messages}
                      onChange={(e) => handleSettingChange("notifications", "messages", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Target size={16} />
                    <span>Recommendations</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.recommendations}
                      onChange={(e) => handleSettingChange("notifications", "recommendations", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <CheckCircle size={16} />
                    <span>Application Updates</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.applicationUpdates}
                      onChange={(e) => handleSettingChange("notifications", "applicationUpdates", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>

                <div style={currentStyles.settingsRow}>
                  <div style={currentStyles.settingsLabel}>
                    <Mail size={16} />
                    <span>Newsletter</span>
                  </div>
                  <label style={currentStyles.switch}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={(e) => handleSettingChange("notifications", "newsletter", e.target.checked)}
                    />
                    <span style={currentStyles.slider}></span>
                  </label>
                </div>
              </div>

              <div style={currentStyles.settingsFormActions}>
                <button style={currentStyles.cancelButton} onClick={handleCloseNotificationsModal}>
                  Cancel
                </button>
                <button style={currentStyles.saveButton} onClick={handleCloseNotificationsModal}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HELP & SUPPORT MODAL */}
      {showHelpModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseHelpModal}>
          <div style={{...currentStyles.modalContent, maxWidth: "600px"}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={currentStyles.modalTitle}>Help & Support</h2>
              <button style={currentStyles.closeButton} onClick={handleCloseHelpModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.helpContainer}>
              <div style={currentStyles.helpSection}>
                <h3 style={currentStyles.helpSectionTitle}>Frequently Asked Questions</h3>
                
                <div style={currentStyles.faqItem}>
                  <p style={currentStyles.faqQuestion}>How do I update my profile information?</p>
                  <p style={currentStyles.faqAnswer}>
                    Go to your profile menu and click on "Edit Profile". You can update your personal information, skills, experience, and more there.
                  </p>
                </div>

                <div style={currentStyles.faqItem}>
                  <p style={currentStyles.faqQuestion}>How do I upload my resume?</p>
                  <p style={currentStyles.faqAnswer}>
                    Navigate to your profile menu and click on "Upload Resume". You can upload PDF, DOC, DOCX, or TXT files up to 5MB.
                  </p>
                </div>

                <div style={currentStyles.faqItem}>
                  <p style={currentStyles.faqQuestion}>How does the skill analysis work?</p>
                  <p style={currentStyles.faqAnswer}>
                    Our AI analyzes your skills, experience, and interests to provide personalized career recommendations and identify areas for growth.
                  </p>
                </div>

                <div style={currentStyles.faqItem}>
                  <p style={currentStyles.faqQuestion}>How do I change my password?</p>
                  <p style={currentStyles.faqAnswer}>
                    Go to Settings → Security Settings, or click on "Change Password" directly from your profile menu.
                  </p>
                </div>
              </div>

              <div style={currentStyles.helpSection}>
                <h3 style={currentStyles.helpSectionTitle}>Contact Support</h3>
                
                <div style={currentStyles.contactOptions}>
                  <div style={currentStyles.contactOption}>
                    <Mail size={20} color="#667eea" />
                    <div>
                      <p style={currentStyles.contactOptionTitle}>Email Support</p>
                      <p style={currentStyles.contactOptionDesc}>support@careerlens.com</p>
                      <p style={currentStyles.contactOptionResponse}>Response time: 24-48 hours</p>
                    </div>
                  </div>

                  <div style={currentStyles.contactOption}>
                    <MessageCircle size={20} color="#667eea" />
                    <div>
                      <p style={currentStyles.contactOptionTitle}>Live Chat</p>
                      <p style={currentStyles.contactOptionDesc}>Available 9am-5pm EST</p>
                      <button style={currentStyles.contactButton}>Start Chat</button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={currentStyles.helpSection}>
                <h3 style={currentStyles.helpSectionTitle}>Resources</h3>
                
                <div style={currentStyles.resourceLinks}>
                  <a href="#" style={currentStyles.resourceLink}>User Guide</a>
                  <a href="#" style={currentStyles.resourceLink}>Video Tutorials</a>
                  <a href="#" style={currentStyles.resourceLink}>API Documentation</a>
                  <a href="#" style={currentStyles.resourceLink}>Release Notes</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteConfirmModal && (
        <div style={currentStyles.modalOverlay} onClick={handleCloseDeleteConfirmModal}>
          <div style={{...currentStyles.modalContent, maxWidth: "500px"}} onClick={(e) => e.stopPropagation()}>
            <div style={currentStyles.modalHeader}>
              <h2 style={{...currentStyles.modalTitle, color: "#ff4444"}}>Delete Account</h2>
              <button style={currentStyles.closeButton} onClick={handleCloseDeleteConfirmModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div style={currentStyles.deleteConfirmContainer}>
              <AlertTriangle size={48} color="#ff4444" style={{ marginBottom: "16px" }} />
              
              <h3 style={currentStyles.deleteConfirmTitle}>Are you absolutely sure?</h3>
              
              <p style={currentStyles.deleteConfirmText}>
                This action cannot be undone. This will permanently delete your
                account and remove all of your data from our servers.
              </p>

              <div style={currentStyles.deleteConfirmWarning}>
                <p>This includes:</p>
                <ul>
                  <li>Your profile information</li>
                  <li>Your resume and documents</li>
                  <li>Your skills and career data</li>
                  <li>Your job applications history</li>
                  <li>All saved preferences and settings</li>
                </ul>
              </div>

              <div style={currentStyles.deleteConfirmInputGroup}>
                <label style={currentStyles.deleteConfirmLabel}>
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  style={currentStyles.deleteConfirmInput}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>

              <div style={currentStyles.deleteConfirmActions}>
                <button 
                  style={currentStyles.cancelButton}
                  onClick={handleCloseDeleteConfirmModal}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  style={{
                    ...currentStyles.deleteButton,
                    ...(deleteConfirmText !== "DELETE" || isDeleting ? currentStyles.disabledButton : {})
                  }}
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#0a0e27",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
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

  content: {
    position: "relative",
    zIndex: 2,
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "48px",
    color: "#fff",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  logoIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
  },

  logo: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "900",
    background: "linear-gradient(135deg, #fff, #e0e7ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  subtitle: {
    margin: 0,
    fontSize: "13px",
    opacity: 0.7,
    fontWeight: "500",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    position: "relative",
  },

  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "8px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s",
  },

  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
  },

  userInitials: {
    color: "#fff",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
  },

  userName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
    lineHeight: "1.3",
  },

  userEmail: {
    fontSize: "11px",
    opacity: 0.7,
    color: "#fff",
  },

  profileMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: "0",
    width: "300px",
    maxHeight: "80vh",
    overflowY: "auto",
    background: "rgba(10, 14, 39, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    zIndex: 10,
  },

  profileMenuHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
  },

  profileMenuAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px",
  },

  profileMenuUserInfo: {
    flex: 1,
  },

  profileMenuName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },

  profileMenuEmail: {
    fontSize: "12px",
    opacity: 0.7,
    color: "#fff",
  },

  profileMenuSection: {
    marginTop: "12px",
    paddingTop: "8px",
  },

  profileMenuSectionTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "rgba(255,255,255,0.5)",
    padding: "0 12px",
    marginBottom: "4px",
  },

  profileMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    color: "#fff",
    fontSize: "13px",
    borderRadius: "8px",
    transition: "all 0.2s",
    cursor: "pointer",
    '&:hover': {
      background: "rgba(255,255,255,0.1)",
    }
  },

  logoutMenuItem: {
    color: "#ff6b6b",
  },

  deleteAccountMenuItem: {
    color: "#ff4444",
    marginTop: "4px",
  },

  profileDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    margin: "12px 0",
  },

  logoutBtn: {
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
    fontWeight: "600",
    transition: "all 0.3s",
  },

  hero: {
    textAlign: "center",
    marginBottom: "60px",
    color: "#fff",
  },

  welcomeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  },

  welcome: {
    fontSize: "48px",
    fontWeight: "900",
    marginBottom: "16px",
    background: "linear-gradient(135deg, #fff, #c7d2fe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  heroText: {
    fontSize: "17px",
    maxWidth: "720px",
    margin: "0 auto 40px",
    opacity: 0.85,
    lineHeight: "1.6",
  },

  quickStats: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  statCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "20px 32px",
    minWidth: "140px",
    textAlign: "center",
  },

  statIcon: {
    color: "#a78bfa",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "center",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "12px",
    opacity: 0.7,
    fontWeight: "500",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "28px",
    marginBottom: "60px",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.5)",
    position: "relative",
    overflow: "hidden",
  },

  cardBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  iconBox: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    marginBottom: "24px",
    transition: "all 0.4s",
  },

  cardTitle: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "12px",
    color: "#111827",
    lineHeight: "1.3",
  },

  cardDesc: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
    lineHeight: "1.6",
  },

  cardStats: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginBottom: "24px",
    padding: "16px",
    background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
    borderRadius: "12px",
  },

  statNumber: {
    fontSize: "32px",
    fontWeight: "900",
    color: "#111827",
  },

  statText: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "600",
  },

  exploreBtn: {
    background: "linear-gradient(135deg, #111827, #374151)",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s",
    fontSize: "15px",
  },

  footerCTA: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "24px",
    padding: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
  },

  ctaContent: {
    flex: 1,
  },

  ctaTitle: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "8px",
  },

  ctaText: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.9)",
  },

  ctaButton: {
    background: "#fff",
    color: "#667eea",
    border: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    transition: "all 0.3s",
  },

  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modalContent: {
    background: "#fff",
    borderRadius: "24px",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    animation: "modalSlideIn 0.3s ease",
  },

  editModalContent: {
    maxWidth: "1000px",
  },

  settingsModalContent: {
    maxWidth: "1000px",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #e5e7eb",
  },

  modalTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
  },

  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },

  // Profile View Styles
  profileViewContainer: {
    padding: "32px",
  },

  profileViewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
    padding: "24px",
    background: "linear-gradient(135deg, #667eea10, #764ba210)",
    borderRadius: "16px",
  },

  profileViewAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileViewAvatarText: {
    color: "#fff",
    fontSize: "32px",
    fontWeight: "700",
  },

  profileViewHeaderInfo: {
    flex: 1,
  },

  profileViewName: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  profileViewTitle: {
    fontSize: "16px",
    color: "#667eea",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },

  profileViewCompany: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },

  editProfileButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    border: "1px solid #667eea",
    color: "#667eea",
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Resume Status Card
  resumeStatusCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "#f0f9ff",
    border: "1px solid #667eea20",
    borderRadius: "12px",
    marginBottom: "24px",
  },

  resumeStatusIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#667eea10",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  resumeStatusInfo: {
    flex: 1,
  },

  resumeStatusTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  resumeStatusName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  resumeStatusMeta: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },

  resumeStatusActions: {
    display: "flex",
    gap: "8px",
  },

  resumeActionButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },

  profileViewContent: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  profileViewSection: {
    padding: "16px 24px",
    background: "#f9fafb",
    borderRadius: "12px",
  },

  profileViewSectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#374151",
    margin: "0 0 16px 0",
  },

  profileViewBio: {
    fontSize: "15px",
    color: "#4b5563",
    lineHeight: "1.6",
    margin: 0,
  },

  profileViewInfoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  profileViewInfoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#4b5563",
    fontSize: "14px",
  },

  profileViewInfoIcon: {
    color: "#667eea",
  },

  profileViewEducation: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  profileViewEducationDegree: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  profileViewEducationYear: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  profileViewSkills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  profileViewSkillTag: {
    background: "#667eea20",
    color: "#667eea",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  profileViewLanguages: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  profileViewLanguageTag: {
    background: "#10b98120",
    color: "#10b981",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  profileViewExperience: {
    marginBottom: "16px",
  },

  profileViewExperienceHeader: {
    display: "flex",
    gap: "12px",
  },

  profileViewExperienceTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  profileViewExperienceCompany: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 4px 0",
  },

  profileViewExperienceDuration: {
    fontSize: "13px",
    color: "#667eea",
    fontWeight: "600",
    margin: "0 0 8px 0",
  },

  profileViewExperienceDescription: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },

  profileViewCertification: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
  },

  profileViewCertificationName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  profileViewCertificationIssuer: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  profileViewLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  profileViewLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  // Edit Form Styles
  editFormContainer: {
    padding: "32px",
  },

  avatarUploadSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
    padding: "24px",
    background: "#f9fafb",
    borderRadius: "16px",
  },

  editProfileAvatar: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  editProfileAvatarText: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
  },

  avatarUploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  editFormSection: {
    marginBottom: "32px",
  },

  editFormSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  editFormSectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },

  editFormGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },

  editFormGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  editFormLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },

  editFormInput: {
    padding: "10px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  editFormTextarea: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#667eea20",
    border: "none",
    color: "#667eea",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },

  editSkillsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  editSkillItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f3f4f6",
    padding: "6px 12px",
    borderRadius: "8px",
  },

  editSkillName: {
    fontSize: "14px",
    color: "#111827",
  },

  editLanguagesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  editLanguageItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f3f4f6",
    padding: "6px 12px",
    borderRadius: "8px",
  },

  editLanguageName: {
    fontSize: "14px",
    color: "#111827",
  },

  removeButton: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    padding: "2px",
    display: "flex",
    alignItems: "center",
  },

  editExperienceItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
    marginBottom: "12px",
  },

  editExperienceContent: {
    flex: 1,
  },

  editExperienceTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  editExperienceCompany: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 4px 0",
  },

  editExperienceDuration: {
    fontSize: "13px",
    color: "#667eea",
    margin: "0 0 8px 0",
  },

  editExperienceDescription: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },

  editCertificationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
    marginBottom: "12px",
  },

  editCertificationContent: {
    flex: 1,
  },

  editCertificationName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  editCertificationIssuer: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 4px 0",
  },

  editCertificationYear: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  editFormActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },

  cancelButton: {
    background: "#f3f4f6",
    border: "none",
    color: "#4b5563",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  // Resume Upload Styles
  resumeUploadContainer: {
    padding: "32px",
  },

  currentResumeCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "#f0f9ff",
    border: "1px solid #667eea20",
    borderRadius: "12px",
    marginBottom: "24px",
  },

  currentResumeIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#667eea10",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  currentResumeInfo: {
    flex: 1,
  },

  currentResumeTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  currentResumeName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  currentResumeMeta: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },

  currentResumeActions: {
    display: "flex",
    gap: "8px",
  },

  resumeIconButton: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  uploadArea: {
    border: "2px dashed #e5e7eb",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: "20px",
    position: "relative",
  },

  uploadAreaError: {
    borderColor: "#ff4444",
    background: "#fff5f5",
  },

  uploadAreaSuccess: {
    borderColor: "#10b981",
    background: "#f0fdf4",
  },

  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0,
    cursor: "pointer",
  },

  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
  },

  uploadTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },

  uploadSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },

  uploadFileInfo: {
    textAlign: "center",
  },

  uploadFileName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  uploadFileSize: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },

  uploadErrorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "#fff5f5",
    border: "1px solid #ff4444",
    borderRadius: "8px",
    color: "#ff4444",
    fontSize: "14px",
    marginBottom: "20px",
  },

  uploadSuccessMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "#f0fdf4",
    border: "1px solid #10b981",
    borderRadius: "8px",
    color: "#10b981",
    fontSize: "14px",
    marginBottom: "20px",
  },

  uploadProgressContainer: {
    marginBottom: "20px",
  },

  uploadProgressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  uploadProgressLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },

  uploadProgressPercentage: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#667eea",
  },

  uploadProgressBar: {
    height: "8px",
    background: "#f3f4f6",
    borderRadius: "4px",
    overflow: "hidden",
  },

  uploadProgressFill: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    transition: "width 0.3s ease",
  },

  uploadActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "24px",
  },

  // Settings Styles
  settingsContainer: {
    display: "flex",
    padding: "24px",
    gap: "24px",
  },

  settingsSidebar: {
    width: "200px",
    borderRight: "1px solid #e5e7eb",
    paddingRight: "24px",
  },

  settingsTab: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "4px",
    transition: "all 0.2s",
    color: "#6b7280",
  },

  settingsTabActive: {
    background: "#667eea20",
    color: "#667eea",
    fontWeight: "600",
  },

  settingsContent: {
    flex: 1,
  },

  settingsPanel: {
    padding: "8px",
  },

  settingsPanelTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 24px 0",
  },

  settingsGroup: {
    marginBottom: "32px",
  },

  settingsGroupTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 16px 0",
  },

  settingsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
  },

  settingsLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#4b5563",
    fontSize: "14px",
  },

  settingsValue: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  settingsActionButton: {
    background: "none",
    border: "1px solid #e5e7eb",
    color: "#4b5563",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },

  settingsSelect: {
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
  },

  settingsInput: {
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    width: "200px",
  },

  settingsConnectButton: {
    background: "none",
    border: "1px solid #667eea",
    color: "#667eea",
    padding: "6px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  settingsPrimaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  settingsSecondaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f3f4f6",
    border: "none",
    color: "#4b5563",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
  },

  settingsFormActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },

  // Theme Options
  themeOptions: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },

  themeOption: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  themeOptionActive: {
    borderColor: "#667eea",
    background: "#667eea10",
  },

  colorOptions: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },

  colorOption: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  colorOptionActive: {
    transform: "scale(1.1)",
    boxShadow: "0 0 0 2px #fff, 0 0 0 4px #667eea",
  },

  fontSizeOptions: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },

  fontSizeOption: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
  },

  fontSizeOptionActive: {
    borderColor: "#667eea",
    background: "#667eea10",
  },

  // Switch Toggle
  switch: {
    position: "relative",
    display: "inline-block",
    width: "48px",
    height: "24px",
  },

  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
        backgroundColor: "#ccc",
    transition: ".4s",
    borderRadius: "24px",
    '&:before': {
      position: "absolute",
      content: "",
      height: "18px",
      width: "18px",
      left: "3px",
      bottom: "3px",
      backgroundColor: "white",
      transition: ".4s",
      borderRadius: "50%",
    }
  },

  // Session Management
  sessionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "8px",
  },

  sessionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  sessionDevice: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  currentSessionBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#10b981",
    background: "#10b98120",
    padding: "2px 8px",
    borderRadius: "12px",
  },

  sessionLocation: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },

  sessionRevokeButton: {
    background: "none",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Login History
  loginHistoryItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "8px",
  },

  loginHistoryDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  loginHistoryDevice: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
  },

  loginHistoryMeta: {
    fontSize: "12px",
    color: "#6b7280",
  },

  // Danger Zone
  dangerZone: {
    border: "1px solid #ff4444",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "32px",
  },

  dangerZoneTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ff4444",
    margin: "0 0 16px 0",
  },

  dangerZoneItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dangerZoneItemTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  dangerZoneItemDesc: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  dangerButton: {
    background: "#ff4444",
    border: "none",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Always Enabled
  alwaysEnabled: {
    fontSize: "13px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: "16px",
  },

  // Password Change Styles
  passwordChangeContainer: {
    padding: "32px",
  },

  passwordFormGroup: {
    marginBottom: "20px",
  },

  passwordLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },

  passwordInputWrapper: {
    position: "relative",
  },

  passwordInput: {
    width: "100%",
    padding: "12px 16px",
    paddingRight: "48px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
  },

  passwordToggleButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
  },

  passwordError: {
    fontSize: "12px",
    color: "#ff4444",
    marginTop: "4px",
  },

  passwordRequirements: {
    background: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  passwordRequirementsTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 12px 0",
  },

  passwordRequirementsList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },

  passwordSuccessMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "48px 32px",
    textAlign: "center",
  },

  passwordFormActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "24px",
  },

  // Privacy Container
  privacyContainer: {
    padding: "32px",
  },

  // Notifications Container
  notificationsContainer: {
    padding: "32px",
  },

  // Help & Support Styles
  helpContainer: {
    padding: "32px",
  },

  helpSection: {
    marginBottom: "32px",
  },

  helpSectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 20px 0",
  },

  faqItem: {
    marginBottom: "16px",
  },

  faqQuestion: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px 0",
  },

  faqAnswer: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.6",
  },

  contactOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  contactOption: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
  },

  contactOptionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },

  contactOptionDesc: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 4px 0",
  },

  contactOptionResponse: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },

  contactButton: {
    background: "#667eea",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },

  resourceLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  resourceLink: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    '&:hover': {
      textDecoration: "underline",
    }
  },

  // Delete Confirmation Styles
  deleteConfirmContainer: {
    padding: "32px",
    textAlign: "center",
  },

  deleteConfirmTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 12px 0",
  },

  deleteConfirmText: {
    fontSize: "15px",
    color: "#6b7280",
    margin: "0 0 24px 0",
    lineHeight: "1.6",
  },

  deleteConfirmWarning: {
    textAlign: "left",
    background: "#fff5f5",
    border: "1px solid #ff4444",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },

  deleteConfirmInputGroup: {
    textAlign: "left",
    marginBottom: "24px",
  },

  deleteConfirmLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },

  deleteConfirmInput: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
  },

  deleteConfirmActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
  },

  deleteButton: {
    background: "#ff4444",
    border: "none",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Dashboard;
