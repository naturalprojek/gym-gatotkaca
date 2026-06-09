import React, { useState, useEffect } from 'react';

// Ikon SVG inline
const icons = {
  weight: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8l-4 4" />
      <path d="M12 12l-4 4" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  height: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M8 6l4-4 4 4" />
      <path d="M8 18l4 4 4-4" />
    </svg>
  ),
  goal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  frequency: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="16 14 14 16 12 14" />
    </svg>
  ),
  bmi: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  dumbbell: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11" />
      <rect x="2" y="8" width="4" height="8" rx="1" />
      <rect x="18" y="8" width="4" height="8" rx="1" />
      <rect x="6" y="5" width="12" height="14" rx="2" />
    </svg>
  )
};

// Helper untuk kategori BMI
const getBMICategory = (bmi) => {
  if (bmi === null) return null;
  if (bmi < 18.5) return { label: 'Kurus', color: '#f59e0b', bar: '20%' };
  if (bmi < 25) return { label: 'Normal', color: '#16a34a', bar: '50%' };
  if (bmi < 30) return { label: 'Overweight', color: '#f97316', bar: '70%' };
  return { label: 'Obesitas', color: '#ef4444', bar: '90%' };
};

const InputForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    goal: 'Muscle Gain',
    frequency: '3'
  });

  const getRealTimeBMI = () => {
    if (!formData.weight || !formData.height) return null;
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    return w / (h * h);
  };

  const bmi = getRealTimeBMI();
  const isUnderweight = bmi !== null && bmi < 18.5;
  const bmiCategory = getBMICategory(bmi);

  useEffect(() => {
    if (isUnderweight && formData.goal === 'Fat Loss') {
      setFormData(prev => ({ ...prev, goal: 'Muscle Gain' }));
    }
  }, [isUnderweight, formData.goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Premium */}
      <div style={{
        background: 'linear-gradient(135deg, #1366d6 0%, #0f4bb5 100%)',
        borderRadius: '20px 20px 0 0',
        padding: '1.75rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          top: '-40px',
          right: '-30px'
        }} />
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          bottom: '-30px',
          left: '-20px'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', position: 'relative' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            backdropFilter: 'blur(4px)'
          }}>
            {icons.dumbbell}
          </div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '700', letterSpacing: '0.5px' }}>
            Sistem Pakar FitMind
          </h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: '0.5rem 0 0', position: 'relative' }}>
          Masukkan data Anda untuk rekomendasi latihan optimal
        </p>
      </div>

      {/* Body Form - Glass Panel */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(15, 85, 170, 0.12)',
        borderTop: 'none',
        boxShadow: '0 14px 40px 0 rgba(15, 85, 170, 0.12)',
        borderRadius: '0 0 20px 20px',
        padding: '2rem 2rem 1.5rem',
        flex: 1
      }}>          {/* BMI Live Indicator */}
        <div style={{
          background: bmi !== null && bmi < 18.5 ? 'linear-gradient(135deg, #fefce8, #fef9c3)' :
                       bmi !== null && bmi >= 25 ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' :
                       'linear-gradient(135deg, #eef5ff, #f5f9ff)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          border: '1px solid rgba(15, 85, 170, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          transition: 'all 0.5s ease'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1366d6, #0f4bb5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            {icons.bmi}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f3b82' }}>BMI Real-time</span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: bmiCategory ? bmiCategory.color : '#476b9c'
              }}>
                {bmi !== null ? `${bmi.toFixed(1)}` : '—'}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{
              height: '6px',
              background: 'rgba(15, 85, 170, 0.08)',
              borderRadius: '3px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: bmiCategory ? bmiCategory.bar : '0%',
                background: bmiCategory ? bmiCategory.color : 'transparent',
                borderRadius: '3px',
                transition: 'width 0.5s ease, background 0.5s ease'
              }} />
            </div>
            {bmiCategory && (
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: bmiCategory.color, marginTop: '0.25rem' }}>
                {bmiCategory.label}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Berat Badan */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="weight" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f3b82', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#1366d6' }}>{icons.weight}</span>
              Berat Badan (kg)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Contoh: 65"
                required
                min="30"
                max="300"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.8rem',
                  background: '#f0f5ff',
                  border: '2px solid rgba(15, 85, 170, 0.12)',
                  borderRadius: '12px',
                  color: '#0f2a56',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1366d6';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(19, 102, 214, 0.12)';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(15, 85, 170, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#f0f5ff';
                }}
              />
              <div style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#1366d6',
                opacity: 0.6,
                pointerEvents: 'none'
              }}>
                {icons.weight}
              </div>
            </div>
          </div>

          {/* Tinggi Badan */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="height" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f3b82', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#1366d6' }}>{icons.height}</span>
              Tinggi Badan (cm)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Contoh: 170"
                required
                min="100"
                max="250"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.8rem',
                  background: '#f0f5ff',
                  border: '2px solid rgba(15, 85, 170, 0.12)',
                  borderRadius: '12px',
                  color: '#0f2a56',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1366d6';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(19, 102, 214, 0.12)';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(15, 85, 170, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#f0f5ff';
                }}
              />
              <div style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#1366d6',
                opacity: 0.6,
                pointerEvents: 'none'
              }}>
                {icons.height}
              </div>
            </div>
          </div>

          {/* Tujuan Latihan */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="goal" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f3b82', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#1366d6' }}>{icons.goal}</span>
              Tujuan Latihan
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.8rem',
                  background: '#f0f5ff',
                  border: '2px solid rgba(15, 85, 170, 0.12)',
                  borderRadius: '12px',
                  color: '#0f2a56',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1366d6';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(19, 102, 214, 0.12)';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(15, 85, 170, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#f0f5ff';
                }}
              >
                <option value="Fat Loss" disabled={isUnderweight}>Menurunkan Lemak (Fat Loss) {isUnderweight ? '- Tidak untuk BMI Kurang' : ''}</option>
                <option value="Muscle Gain">Membentuk Otot (Muscle Gain)</option>
                <option value="Maintenance">Menjaga Kebugaran (Maintenance)</option>
              </select>
              <div style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#1366d6',
                opacity: 0.6,
                pointerEvents: 'none'
              }}>
                {icons.goal}
              </div>
              {/* Chevron dropdown */}
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#476b9c',
                pointerEvents: 'none',
                fontSize: '0.7rem'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Durasi Latihan */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="frequency" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f3b82', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#1366d6' }}>{icons.frequency}</span>
              Durasi Latihan (Hari/Minggu)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.8rem',
                  background: '#f0f5ff',
                  border: '2px solid rgba(15, 85, 170, 0.12)',
                  borderRadius: '12px',
                  color: '#0f2a56',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1366d6';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(19, 102, 214, 0.12)';
                  e.currentTarget.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(15, 85, 170, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#f0f5ff';
                }}
              >
                <option value="3">3 Hari (Pemula / Sibuk)</option>
                <option value="4">4 Hari (Menengah)</option>
                <option value="5">5 Hari (Fokus / Lanjut)</option>
                <option value="6">6 Hari (Intensif)</option>
              </select>
              <div style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#1366d6',
                opacity: 0.6,
                pointerEvents: 'none'
              }}>
                {icons.frequency}
              </div>
              {/* Chevron dropdown */}
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#476b9c',
                pointerEvents: 'none',
                fontSize: '0.7rem'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Button Submit */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #1366d6 0%, #0f4bb5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '1rem',
              letterSpacing: '1px',
              cursor: 'pointer',
              fontFamily: '"Poppins", sans-serif',
              boxShadow: '0 8px 24px rgba(15, 75, 181, 0.3)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 75, 181, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 75, 181, 0.3)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            JALANKAN SISTEM PAKAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
