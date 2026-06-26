import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowLeft, Sparkles, Target, Brain, Zap } from 'lucide-react';
import { useAlert } from "../context/AlertContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Phone Validation - exactly 10 digits
  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits
    if (digitsOnly.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    
    // Check if it starts with valid area code (first digit 2-9)
    const areaCode = digitsOnly.substring(0, 3);
    if (areaCode[0] === '0' || areaCode[0] === '1') {
      return "Area code cannot start with 0 or 1";
    }
    
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password, isRegister = false) => {
    if (!password) return "Password is required";
    
    if (isRegister) {
      if (password.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
      if (!/\d/.test(password)) return "Password must contain at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
    }
    
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name is too long";
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name contains invalid characters";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Only allow digits for phone number
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const truncated = digitsOnly.slice(0, 10);
      setFormData({ ...formData, [name]: truncated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (isRegisterMode) {
      errors.name = validateName(formData.name);
      errors.phone = validatePhone(formData.phone);
    }
    
    if (!isForgotPasswordMode || (isForgotPasswordMode && !isCodeSent)) {
      errors.email = validateEmail(formData.email);
    }
    
    if ((isForgotPasswordMode && isCodeSent) || !isForgotPasswordMode) {
      errors.password = validatePassword(formData.password, isRegisterMode);
    }
    
    if ((isRegisterMode || (isForgotPasswordMode && isCodeSent)) && formData.confirmPassword) {
      errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    }
    
    setFormErrors(errors);
    
    // Check if there are any errors
    return Object.values(errors).every(error => error === "");
  };

  const handleSubmit = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      // Show first error message
      const firstError = Object.values(formErrors).find(error => error);
      if (firstError) {
        showAlert(firstError);
      }
      return;
    }

    // ===== FORGOT PASSWORD (BACKEND CONNECTED) =====
    if (isForgotPasswordMode) {
      // STEP 1: SEND RESET TOKEN
      if (!isCodeSent) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/forgot-password",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email })
            }
          );

          const data = await response.json();

          if (!response.ok) {
            showAlert(data.message);
            return;
          }

          // TEMP: showing token for testing
          showAlert(`Reset token (demo): ${data.resetToken}`);
          setResetCode(data.resetToken);
          setIsCodeSent(true);

        } catch (error) {
          showAlert("Server error");
        }
        return;
      }

      // STEP 2: RESET PASSWORD
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: resetCode,
              newPassword: formData.password
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.message);
          return;
        }

        showAlert("Password reset successful!");
        handleBackToLogin();

      } catch (error) {
        showAlert("Server error");
      }
      return;
    }
    else if (isRegisterMode) {
      // Additional validation for registration
      if (formData.password !== formData.confirmPassword) {
        showAlert("Passwords do not match!");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone, // Already just digits
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.message || "Registration failed");
          return;
        }

        showAlert("Account created successfully!");
        setIsRegisterMode(false);
        setFormData({
          email: "",
          phone: "",
          password: "",
          name: "",
          confirmPassword: ""
        });
        setFormErrors({
          email: "",
          phone: "",
          password: "",
          name: "",
          confirmPassword: ""
        });

      } catch (error) {
        console.error(error);
        showAlert("Server error. Please try again later.");
      }
      return;
    }
    
    // LOGIN
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "Login failed");
        return;
      }

      // Save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      showAlert(`Welcome ${data.user.name}!`);
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      showAlert("Server error");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setIsForgotPasswordMode(false);
    setIsCodeSent(false);
    setFormData({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
    setFormErrors({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResetCode('');
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setIsRegisterMode(false);
    setIsCodeSent(false);
    setFormData({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
    setFormErrors({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleBackToLogin = () => {
    setIsForgotPasswordMode(false);
    setIsCodeSent(false);
    setFormData({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
    setFormErrors({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
    setResetCode('');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#05070a',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(109, 93, 252, 0.15) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        animation: 'float 25s ease-in-out infinite reverse'
      }}></div>
      
      <div style={{
        background: 'rgba(22, 27, 51, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: '50px 40px',
        borderRadius: '24px',
        border: '1px solid rgba(109, 93, 252, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(109, 93, 252, 0.1)',
        width: '100%',
        maxWidth: '440px',
        zIndex: 10,
        position: 'relative',
        animation: 'slideIn 0.5s ease-out'
      }}>
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(10px, 10px) rotate(5deg); }
              50% { transform: translate(-5px, 5px) rotate(-5deg); }
              75% { transform: translate(-10px, -5px) rotate(3deg); }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `}
        </style>
        
        {/* Decorative Corner Accents */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60px',
          height: '60px',
          borderTop: '2px solid #6d5dfc',
          borderLeft: '2px solid #6d5dfc',
          borderTopLeftRadius: '24px'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          borderTop: '2px solid #ec4899',
          borderRight: '2px solid #ec4899',
          borderTopRightRadius: '24px'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '60px',
          height: '60px',
          borderBottom: '2px solid #10b981',
          borderLeft: '2px solid #10b981',
          borderBottomLeftRadius: '24px'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '60px',
          height: '60px',
          borderBottom: '2px solid #eab308',
          borderRight: '2px solid #eab308',
          borderBottomRightRadius: '24px'
        }}></div>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative'
        }}>
          {/* Animated Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #6d5dfc 0%, #ec4899 100%)',
            borderRadius: '20px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(109, 93, 252, 0.4)',
            position: 'relative',
            animation: 'pulse 3s ease-in-out infinite'
          }}>
            <Sparkles size={40} color="#fff" />
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '30px',
              height: '30px',
              background: '#eab308',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={16} color="#000" />
            </div>
          </div>
          
          <h1 style={{
            background: 'linear-gradient(135deg, #fff 30%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px',
            fontSize: '2.5rem',
            fontWeight: '900',
            margin: '0 0 10px 0',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.5px'
          }}>Career Lens</h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '1rem',
            margin: '0',
            fontWeight: '500'
          }}>
            {isForgotPasswordMode 
              ? (isCodeSent ? 'Enter Reset Code & New Password' : 'Reset Your Password')
              : (isRegisterMode ? 'Create Your Account' : 'Your AI-Powered Career Journey')
            }
          </p>
        </div>
        
        <div>
          {isForgotPasswordMode && (
            <button
              onClick={handleBackToLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#a78bfa',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginBottom: '24px',
                padding: '10px 16px',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(109, 93, 252, 0.2)';
                e.target.style.borderColor = '#6d5dfc';
                e.target.style.transform = 'translateX(-5px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <ArrowLeft size={20} /> Back to Login
            </button>
          )}

          {isRegisterMode && (
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: focusedField === 'name' ? 'rgba(109, 93, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <User size={20} style={{
                    color: focusedField === 'name' ? '#6d5dfc' : '#94a3b8',
                    transition: 'color 0.3s'
                  }} />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required 
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 60px',
                    border: `1px solid ${focusedField === 'name' ? '#6d5dfc' : formErrors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#0d1124',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
              </div>
              {formErrors.name && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '8px',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{fontSize: '16px'}}>⚠</span> {formErrors.name}
                </p>
              )}
            </div>
          )}

          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#cbd5e1',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: focusedField === 'email' ? 'rgba(109, 93, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                <Mail size={20} style={{
                  color: focusedField === 'email' ? '#6d5dfc' : '#94a3b8',
                  transition: 'color 0.3s'
                }} />
              </div>
              <input 
                type="email" 
                name="email" 
                placeholder="student@university.edu" 
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                disabled={isForgotPasswordMode && isCodeSent}
                required 
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 60px',
                  border: `1px solid ${focusedField === 'email' ? '#6d5dfc' : formErrors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '14px',
                  boxSizing: 'border-box',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  backgroundColor: isForgotPasswordMode && isCodeSent ? '#0f172a' : '#0d1124',
                  color: isForgotPasswordMode && isCodeSent ? '#64748b' : '#fff',
                  cursor: isForgotPasswordMode && isCodeSent ? 'not-allowed' : 'text',
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </div>
            {formErrors.email && !(isForgotPasswordMode && isCodeSent) && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.8rem',
                marginTop: '8px',
                marginBottom: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{fontSize: '16px'}}>⚠</span> {formErrors.email}
              </p>
            )}
          </div>

          {isForgotPasswordMode && isCodeSent && (
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Reset Code</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: focusedField === 'resetCode' ? 'rgba(109, 93, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <Zap size={20} style={{
                    color: focusedField === 'resetCode' ? '#eab308' : '#94a3b8',
                    transition: 'color 0.3s'
                  }} />
                </div>
                <input 
                  type="text" 
                  name="resetCode" 
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField('resetCode')}
                  onBlur={() => setFocusedField(null)}
                  maxLength="6"
                  required 
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 60px',
                    border: `1px solid ${focusedField === 'resetCode' ? '#eab308' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#0d1124',
                    color: '#fff',
                    letterSpacing: '4px',
                    fontWeight: '600',
                    fontFamily: "'Inter', sans-serif",
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>
          )}

          {!isForgotPasswordMode && (
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: focusedField === 'phone' ? 'rgba(109, 93, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <Phone size={20} style={{
                    color: focusedField === 'phone' ? '#6d5dfc' : '#94a3b8',
                    transition: 'color 0.3s'
                  }} />
                </div>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  maxLength="10"
                  required 
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 60px',
                    border: `1px solid ${focusedField === 'phone' ? '#6d5dfc' : formErrors.phone ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#0d1124',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
              </div>
              {formErrors.phone && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '8px',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{fontSize: '16px'}}>⚠</span> {formErrors.phone}
                </p>
              )}
              {isRegisterMode && !formErrors.phone && (
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  marginTop: '8px',
                  marginBottom: '0'
                }}>
                  Enter 10-digit US/Canada number (area code cannot start with 0 or 1)
                </p>
              )}
            </div>
          )}

          {(isForgotPasswordMode && isCodeSent) || !isForgotPasswordMode ? (
            <div style={{ marginBottom: isRegisterMode || (isForgotPasswordMode && isCodeSent) ? '24px' : '28px', position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>{isForgotPasswordMode ? 'New Password' : 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: focusedField === 'password' ? 'rgba(109, 93, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <Lock size={20} style={{
                    color: focusedField === 'password' ? '#6d5dfc' : '#94a3b8',
                    transition: 'color 0.3s'
                  }} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password" 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required 
                  style={{
                    width: '100%',
                    padding: '16px 60px 16px 60px',
                    border: `1px solid ${focusedField === 'password' ? '#6d5dfc' : formErrors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#0d1124',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    color: showPassword ? '#10b981' : '#94a3b8',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(109, 93, 252, 0.2)';
                    e.target.style.borderColor = '#6d5dfc';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '8px',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{fontSize: '16px'}}>⚠</span> {formErrors.password}
                </p>
              )}
              {isRegisterMode && !formErrors.password && (
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  marginTop: '8px',
                  marginBottom: '0'
                }}>
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              )}
            </div>
          ) : null}

          {(isRegisterMode || (isForgotPasswordMode && isCodeSent)) && (
            <div style={{ marginBottom: '28px', position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: focusedField === 'confirmPassword' ? 'rgba(109, 93, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <Lock size={20} style={{
                    color: focusedField === 'confirmPassword' ? '#6d5dfc' : '#94a3b8',
                    transition: 'color 0.3s'
                  }} />
                </div>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword" 
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required 
                  style={{
                    width: '100%',
                    padding: '16px 60px 16px 60px',
                    border: `1px solid ${focusedField === 'confirmPassword' ? '#6d5dfc' : formErrors.confirmPassword ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    backgroundColor: '#0d1124',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    color: showConfirmPassword ? '#10b981' : '#94a3b8',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(109, 93, 252, 0.2)';
                    e.target.style.borderColor = '#6d5dfc';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '8px',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{fontSize: '16px'}}>⚠</span> {formErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #6d5dfc 0%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1.05rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(109, 93, 252, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: "'Inter', sans-serif",
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(109, 93, 252, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(109, 93, 252, 0.4)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>
              {isForgotPasswordMode 
                ? (isCodeSent ? 'Reset Password' : 'Send Reset Code')
                : (isRegisterMode ? 'Create Account' : 'Sign In')
              }
            </span>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #ec4899 0%, #6d5dfc 100%)',
              transition: 'left 0.5s ease',
              zIndex: 1
            }}></div>
          </button>
          
          <div style={{
            marginTop: '28px',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {!isRegisterMode && !isForgotPasswordMode && (
              <a 
                href="#forgot" 
                onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}
                style={{
                  color: '#a78bfa',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#6d5dfc';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#a78bfa';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Target size={16} /> Forgot Password?
              </a>
            )}
            {!isForgotPasswordMode && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{
                color: '#94a3b8',
                margin: '0',
                fontWeight: '500'
              }}>
                {isRegisterMode ? 'Already have an account?' : 'New to Career Lens?'}{' '}
                <a 
                  href="#toggle" 
                  onClick={(e) => { e.preventDefault(); toggleMode(); }}
                  style={{
                    color: '#6d5dfc',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontWeight: '700',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#ec4899';
                    e.target.style.textShadow = '0 0 10px rgba(236, 72, 153, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#6d5dfc';
                    e.target.style.textShadow = 'none';
                  }}
                >
                  {isRegisterMode ? 'Sign In' : 'Create Account'}
                </a>
              </p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;