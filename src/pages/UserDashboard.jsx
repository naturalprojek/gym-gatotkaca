import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import InputForm from '../components/InputForm';
import ResultCard from '../components/ResultCard';
import { getExpertRecommendation } from '../logic/expertSystem';

const UserDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [result, setResult] = useState(null);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "5px solid #eef5ff",
              borderTop: "5px solid #1366d6",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#1366d6", fontWeight: 600 }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCalculate = (data) => {
    const recommendation = getExpertRecommendation(
      parseFloat(data.weight), 
      parseFloat(data.height), 
      data.goal,
      data.frequency
    );
    setResult(recommendation);
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '100px 2rem 2rem' }}>
      
      {result ? (
        <div style={{ width: '100%', maxWidth: '1000px' }} className="animate-fade-in">
          <ResultCard result={result} onReset={() => setResult(null)} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
          
          {/* Left Side: Gatotkaca Image */}
          <div className="glass-panel animate-fade-in" style={{ flex: '1 1 400px', overflow: 'hidden', position: 'relative', border: '1px solid var(--primary-color)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <img src="/gatotkaca_standing.png" alt="Gatotkaca AI Trainer" style={{ width: '100%', flex: 1, objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' }}>
              <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>FitMind AI Trainer</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Selamat datang! Saya Gatotkaca AI. Masukkan data Anda, dan saya akan merancang program latihan kelas dewa khusus untuk Anda.
              </p>
            </div>
          </div>
          
          {/* Right Side: Input Form */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <InputForm onCalculate={handleCalculate} />
          </div>

        </div>
      )}
    </div>
  );
};

export default UserDashboard;
