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
              border: "5px solid #232e4d",
              borderTop: "5px solid #f97316",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#f97316", fontWeight: 600 }}>Memuat...</p>
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

  const initials = (user.name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="container"
      style={{
        maxWidth: "1150px",
        minHeight: "calc(100vh - 68px)",
        padding: "120px 1.5rem 3rem",
      }}
    >
      {/* Greeting */}
      <div className="dash-greeting animate-fade-in">
        <div className="dash-avatar">{initials}</div>
        <div>
          <h1>Halo, {user.name}</h1>
          <p>
            Selamat datang di konsultasi latihan FitMind — program personal
            yang dirancang khusus untuk tubuhmu.
          </p>
        </div>
      </div>

      {result ? (
        <div className="animate-fade-in">
          <ResultCard result={result} onReset={() => setResult(null)} />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Form konsultasi */}
          <div className="animate-fade-in">
            <InputForm onCalculate={handleCalculate} />
          </div>

          {/* Panel kanan: AI Trainer + tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div
              className="glass-panel animate-fade-in"
              style={{
                overflow: "hidden",
                position: "relative",
                border: "1px solid var(--border)",
                borderRadius: "22px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src="/gatotkaca_standing.png"
                alt="Gatotkaca AI Trainer"
                style={{ width: "100%", maxHeight: "320px", objectFit: "cover" }}
              />
              <div
                style={{
                  padding: "1.4rem",
                  background: "linear-gradient(180deg, transparent, rgba(7, 11, 20, 0.9))",
                  marginTop: "-5rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "999px",
                    background: "rgba(249, 115, 22, 0.16)",
                    border: "1px solid rgba(249, 115, 22, 0.4)",
                    color: "var(--primary-color)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                  }}
                >
                  FitMind AI Trainer
                </span>
                <h3 style={{ color: "#fff", fontSize: "1.35rem", margin: "0 0 0.4rem" }}>
                  Gatotkaca AI
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
                  Masukkan data tubuhmu, dan saya akan merancang program latihan
                  kelas dewa khusus untuk Anda.
                </p>
              </div>
            </div>

            <div
              className="glass-panel animate-fade-in"
              style={{
                padding: "1.4rem",
                borderRadius: "22px",
                border: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  color: "#f1f5f9",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "0.9rem",
                }}
              >
                Tips Latihan
              </h4>
              {[
                "Konsisten 3–5 hari seminggu lebih baik dari latihan intens sesekali.",
                "Pastikan tidur 7–8 jam — otot tumbuh saat istirahat.",
                "Minum cukup air dan jaga asupan protein harianmu.",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    padding: "0.7rem 0",
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                  }}
                >
                  <span style={{ color: "var(--primary-color)", fontWeight: 800 }}>
                    {i + 1}.
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
