import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // basic validation
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="auth-card animate-fade-in" style={{ width: '100%', maxWidth: '420px', position: 'relative', overflow: 'hidden' }}>
          <img src="/logo.jpeg" alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.08, objectFit: 'cover', zIndex: 0, mixBlendMode: 'normal', pointerEvents: 'none' }} />
          <h2 className="text-center" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>Buat Akun Baru</h2>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger-color)' }}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nama Lengkap</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              className="form-input" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Alamat Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="form-input" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Nomor HP / WhatsApp</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              className="form-input" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="Contoh: 628123456789"
            />
            <small style={{ color: '#5e7caa', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              Gunakan format internasional (62xxx). Dapat digunakan untuk login.
            </small>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password Baru</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="form-input" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', position: 'relative', zIndex: 1 }}>Buat Akun Member</button>
        </form>
        
        <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>
          Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Register;
