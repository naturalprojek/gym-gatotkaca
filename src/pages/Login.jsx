import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userData = await login(identifier, password);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
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
          <h2 className="text-center" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>Masuk Admin / Member</h2>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger-color)' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="identifier">Email atau Nomor HP</label>
            <input 
              type="text" 
              id="identifier" 
              className="form-input" 
              value={identifier} 
              onChange={e => setIdentifier(e.target.value)} 
              placeholder="contoh@email.com atau 08123456789"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', position: 'relative', zIndex: 1 }}>Masuk Akun</button>
        </form>
        
        <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>
          Belum punya akun member? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Login;
