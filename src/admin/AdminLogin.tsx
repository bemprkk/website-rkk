import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAdmin } from '../context/AdminContext';
import './admin.css';

const AdminLogin: React.FC = () => {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Email atau password salah. Silakan coba lagi.');

  // reCAPTCHA State
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifikasi reCAPTCHA
    if (!captchaToken) {
      setCaptchaError('Tolong centang kotak reCAPTCHA.');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password, captchaToken);
    setIsLoading(false);
    
    if (!success) {
      setErrorMsg('Email atau password salah. Silakan coba lagi.');
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-bg"></div>
      <motion.div 
        className="admin-login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Lock size={32} />
          </div>
          <h2>BEMPRKK Admin</h2>
          <p>Silakan masukkan email dan password untuk mengakses panel kontrol.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          
          <div className="admin-input-group" style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', paddingRight: '2.5rem' }}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', 
                background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="admin-input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onChange={(token) => {
                setCaptchaToken(token);
                if (token) setCaptchaError('');
              }}
            />
            {captchaError && (
              <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', textAlign: 'center' }}>
                {captchaError}
              </span>
            )}
          </div>

          {error && (
            <motion.div 
              className="admin-error-msg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <button type="submit" className="admin-btn-primary w-full" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
            <LogIn size={18} />
            <span>{isLoading ? 'Memproses...' : 'Masuk Panel'}</span>
          </button>
        </form>
        
        <div className="admin-login-footer">
          <a href="/">Kembali ke Website</a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
