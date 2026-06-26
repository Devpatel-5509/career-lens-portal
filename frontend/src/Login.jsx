import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowLeft, Sparkles, Star } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async () => {
    if (isForgotPasswordMode) {
        if (!isCodeSent) {
          if (!formData.email) { alert("Please enter your email"); return; }
          try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email })
            });
            const data = await response.json();
            if (!response.ok) { alert(data.message); return; }
            alert(`Reset token (demo): ${data.resetToken}`);
            setResetCode(data.resetToken);
            setIsCodeSent(true);
          } catch (error) { alert("Server error"); }
          return;
        }
        if (!formData.password || !formData.confirmPassword) { alert("Please enter new password"); return; }
        if (!validatePassword(formData.password)) { alert("Invalid Password Format"); return; }
        if (formData.password !== formData.confirmPassword) { alert("Passwords do not match"); return; }
        try {
          const response = await fetch("http://localhost:5000/api/auth/reset-password", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: resetCode, newPassword: formData.password })
          });
          if (!response.ok) { alert("Reset failed"); return; }
          alert("Password reset successful!");
          handleBackToLogin();
        } catch (error) { alert("Server error"); }
        return;
    } else if (isRegisterMode) {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) { alert("Fill all fields!"); return; }
        if (!validateEmail(formData.email)) { alert("Invalid Email"); return; }
        if (!validatePhone(formData.phone)) { alert("Phone must be 10 digits"); return; }
        if (formData.password !== formData.confirmPassword) { alert("Passwords match error"); return; }
    }
    
    if (!formData.email || !formData.password) { alert("Enter credentials"); return; }
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await response.json();
      if (!response.ok) { alert(data.message || "Login failed"); return; }
      alert(`Welcome ${data.user.name}!`);
    } catch (error) { alert("Server error"); }
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleSubmit();

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setIsForgotPasswordMode(false);
    setIsCodeSent(false);
    setFormData({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setIsRegisterMode(false);
    setIsCodeSent(false);
    setFormData({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
  };

  const handleBackToLogin = () => {
    setIsForgotPasswordMode(false);
    setIsCodeSent(false);
    setFormData({ email: '', phone: '', password: '', name: '', confirmPassword: '' });
  };

  const theme = {
    bg: '#0a0e27',
    cardBg: 'rgba(15, 23, 42, 0.6)',
    inputBg: 'rgba(30, 41, 59, 0.4)',
    primary: '#818cf8',
    secondary: '#c084fc',
    accent: '#38bdf8',
    gold: '#fbbf24',
    textMain: '#f1f5f9',
    textDim: '#94a3b8',
    border: 'rgba(129, 140, 248, 0.2)'
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', 
      background: `radial-gradient(ellipse at top, #1e1b4b 0%, ${theme.bg} 50%, #020617 100%)`,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes slideIn { 
          from { opacity: 0; transform: translateY(-30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(129, 140, 248, 0.3), 0 0 40px rgba(192, 132, 252, 0.2); }
          50% { box-shadow: 0 0 30px rgba(129, 140, 248, 0.5), 0 0 60px rgba(192, 132, 252, 0.3); }
        }
        input::placeholder { color: #475569; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: ${theme.textMain};
          -webkit-box-shadow: 0 0 0px 1000px ${theme.inputBg} inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      
      {/* Animated background stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '2px',
          height: '2px',
          background: 'white',
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 3}s infinite`,
          animationDelay: `${Math.random() * 2}s`
        }} />
      ))}

      <div style={{
        background: `linear-gradient(135deg, ${theme.cardBg} 0%, rgba(30, 41, 59, 0.3) 100%)`,
        backdropFilter: 'blur(20px)',
        padding: '50px 45px',
        borderRadius: '32px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        width: '100%',
        maxWidth: '460px',
        animation: 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(180deg, rgba(129, 140, 248, 0.05) 0%, transparent 100%)`,
          pointerEvents: 'none'
        }} />
        
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
          <div style={{
            width: '90px',
            height: '90px',
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            borderRadius: '24px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 15px 40px rgba(129, 140, 248, 0.4), inset 0 -2px 10px rgba(0, 0, 0, 0.3)`,
            transform: 'rotate(-5deg)',
            animation: 'float 6s ease-in-out infinite',
            position: 'relative'
          }}>
            <Sparkles size={44} color="white" style={{ transform: 'rotate(5deg)' }} />
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '24px',
              height: '24px',
              background: theme.gold,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.5)'
            }}>
              <Star size={14} color="white" fill="white" />
            </div>
          </div>
          <h1 style={{
            color: theme.textMain,
            fontSize: '2.75rem',
            fontWeight: '900',
            margin: '0 0 12px 0',
            background: `linear-gradient(135deg, ${theme.textMain} 0%, ${theme.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>Career Lens</h1>
          <p style={{ 
            color: theme.textDim, 
            fontSize: '1.05rem', 
            margin: '0', 
            fontWeight: '500',
            letterSpacing: '0.01em'
          }}>
            {isForgotPasswordMode 
              ? (isCodeSent ? '✨ Enter Reset Code' : '🔐 Reset Your Password')
              : (isRegisterMode ? '🚀 Create Your Account' : '🌙 Step into your future')
            }
          </p>
        </div>
        
        <div>
          {isForgotPasswordMode && (
            <button onClick={handleBackToLogin} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(129, 140, 248, 0.1)',
              border: `1px solid ${theme.border}`,
              color: theme.accent,
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '28px',
              padding: '10px 16px',
              borderRadius: '12px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(129, 140, 248, 0.15)'}
            onMouseLeave={e => e.target.style.background = 'rgba(129, 140, 248, 0.1)'}
            >
              <ArrowLeft size={18} /> Back to Login
            </button>
          )}

          {[
            { id: 'name', label: 'Full Name', icon: User, show: isRegisterMode, type: 'text', placeholder: 'John Doe' },
            { id: 'email', label: 'Email Address', icon: Mail, show: true, type: 'email', placeholder: 'name@example.com' },
            { id: 'phone', label: isForgotPasswordMode && isCodeSent ? 'Reset Code' : 'Phone Number', icon: isForgotPasswordMode && isCodeSent ? Lock : Phone, show: !isForgotPasswordMode || (isForgotPasswordMode && isCodeSent), type: 'text', placeholder: '1234567890' }
          ].map(field => field.show && (
            <div key={field.id} style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: theme.textMain, 
                fontWeight: '600', 
                fontSize: '0.9rem',
                letterSpacing: '0.01em'
              }}>{field.label}</label>
              <div style={{ position: 'relative' }}>
                <field.icon size={18} style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: focusedField === field.id ? theme.primary : '#64748b',
                  transition: 'color 0.3s'
                }} />
                <input 
                  type={field.type} 
                  name={field.id} 
                  placeholder={field.placeholder}
                  value={formData[field.id]} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField(field.id)} 
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%', 
                    padding: '15px 15px 15px 48px', 
                    background: theme.inputBg,
                    border: `2px solid ${focusedField === field.id ? theme.primary : 'rgba(71, 85, 105, 0.3)'}`,
                    borderRadius: '16px', 
                    color: theme.textMain, 
                    outline: 'none', 
                    transition: 'all 0.3s',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    boxShadow: focusedField === field.id ? `0 0 0 4px rgba(129, 140, 248, 0.1)` : 'none'
                  }}
                />
              </div>
            </div>
          ))}

          {((isForgotPasswordMode && isCodeSent) || !isForgotPasswordMode) && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: theme.textMain, 
                fontWeight: '600', 
                fontSize: '0.9rem',
                letterSpacing: '0.01em'
              }}>{isForgotPasswordMode ? 'New Password' : 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: focusedField === 'password' ? theme.primary : '#64748b',
                  transition: 'color 0.3s'
                }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder="••••••••"
                  value={formData.password} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('password')} 
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%', 
                    padding: '15px 48px 15px 48px', 
                    background: theme.inputBg,
                    border: `2px solid ${focusedField === 'password' ? theme.primary : 'rgba(71, 85, 105, 0.3)'}`,
                    borderRadius: '16px', 
                    color: theme.textMain, 
                    outline: 'none',
                    transition: 'all 0.3s',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    boxShadow: focusedField === 'password' ? `0 0 0 4px rgba(129, 140, 248, 0.1)` : 'none'
                  }}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = theme.primary}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {(isRegisterMode || (isForgotPasswordMode && isCodeSent)) && (
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: theme.textMain, 
                fontWeight: '600', 
                fontSize: '0.9rem',
                letterSpacing: '0.01em'
              }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: focusedField === 'confirmPassword' ? theme.primary : '#64748b',
                  transition: 'color 0.3s'
                }} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  placeholder="••••••••"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  onFocus={() => setFocusedField('confirmPassword')} 
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%', 
                    padding: '15px 48px 15px 48px', 
                    background: theme.inputBg,
                    border: `2px solid ${focusedField === 'confirmPassword' ? theme.primary : 'rgba(71, 85, 105, 0.3)'}`,
                    borderRadius: '16px', 
                    color: theme.textMain, 
                    outline: 'none',
                    transition: 'all 0.3s',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    boxShadow: focusedField === 'confirmPassword' ? `0 0 0 4px rgba(129, 140, 248, 0.1)` : 'none'
                  }}
                />
                <button 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = theme.primary}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={handleSubmit} 
            style={{
              width: '100%',
              padding: '17px',
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: `0 12px 28px rgba(129, 140, 248, 0.35)`,
              letterSpacing: '0.02em',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 16px 36px rgba(129, 140, 248, 0.45)`;
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 12px 28px rgba(129, 140, 248, 0.35)`;
            }}
          >
            {isForgotPasswordMode ? (isCodeSent ? 'Reset Password' : 'Send Reset Code') : (isRegisterMode ? 'Create Account' : 'Sign In')}
          </button>
          
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            {!isRegisterMode && !isForgotPasswordMode && (
              <a 
                onClick={handleForgotPassword} 
                style={{ 
                  color: theme.accent, 
                  textDecoration: 'none', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  fontSize: '0.9rem',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={e => e.target.style.color = theme.primary}
                onMouseLeave={e => e.target.style.color = theme.accent}
              >
                Forgot Password?
              </a>
            )}
            {!isForgotPasswordMode && (
              <div style={{ 
                marginTop: '20px', 
                color: theme.textDim, 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {isRegisterMode ? 'Already have an account?' : 'New to Career Lens?'}
                <button 
                  onClick={toggleMode} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: theme.primary, 
                    cursor: 'pointer', 
                    fontWeight: '700', 
                    marginLeft: '8px',
                    fontSize: '0.9rem',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.color = theme.secondary}
                  onMouseLeave={e => e.target.style.color = theme.primary}
                >
                  {isRegisterMode ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;