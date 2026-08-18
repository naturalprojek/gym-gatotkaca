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
    <div className="auth-split">
      {/* Panel branding */}
      <div className="auth-brand-panel">
        <img src="/gatotkaca berdiri.png" alt="Gatotkaca" />
        <h2>
          Gatot <span>Kaca</span> Gym
        </h2>
        <p>
          Kembali berlatih, raih kekuatanmu. Akses dashboard member dan
          konsultasi latihan pribadi.
        </p>
      </div>

      {/* Panel form */}
      <div className="auth-form-panel">
        <div className="auth-card animate-fade-in">
          <h2 className="text-center" style={{ marginBottom: '0.5rem' }}>
            Masuk Akun
          </h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Admin atau member? Silakan masuk di sini.
          </p>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--danger-color)',
                padding: '0.8rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">
                Email atau Nomor HP
              </label>
              <input
                type="text"
                id="identifier"
                className="form-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="contoh@email.com atau 08123456789"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Memproses...' : 'Masuk Akun'}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            Belum punya akun member?{' '}
            <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
