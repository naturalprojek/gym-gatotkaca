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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

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
    <div className="auth-split">
      {/* Panel branding */}
      <div className="auth-brand-panel">
        <img src="/gatotkaca berdiri.png" alt="Gatotkaca" />
        <h2>
          Mulai <span>Perjalananmu</span>
        </h2>
        <p>
          Daftar sekarang dan dapatkan program latihan personal dari sistem
          pakar FitMind — siap membantumu mencapai tubuh impian.
        </p>
      </div>

      {/* Panel form */}
      <div className="auth-form-panel">
        <div className="auth-card animate-fade-in">
          <h2 className="text-center" style={{ marginBottom: '0.5rem' }}>
            Buat Akun Baru
          </h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Gratis untuk semua calon anggota.
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

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Nama Lengkap
              </label>
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
              <label className="form-label" htmlFor="email">
                Alamat Email
              </label>
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
              <label className="form-label" htmlFor="phone">
                Nomor HP / WhatsApp
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 08123456789 atau 628123456789"
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                Otomatis dikonversi ke +62. Cukup ketik nomor HP Anda (boleh pakai 0 depan).
              </small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password Baru
              </label>
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Membuat akun...' : 'Buat Akun Member'}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
