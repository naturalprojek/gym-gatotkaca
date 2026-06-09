import React from 'react';

// Parse exercise name and set/rep info from string like "Barbell Bench Press (3-4 Set x 8-12 Rep)"
const parseExercise = (exerciseStr) => {
  const match = exerciseStr.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), sets: match[2].trim() };
  }
  return { name: exerciseStr, sets: '-' };
};

// Ikon SVG
const icons = {
  bmi: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  target: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  nutrition: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  intensity: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  schedule: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="16 14 14 16 12 14" />
    </svg>
  ),
  dumbbell: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11" />
      <rect x="2" y="8" width="4" height="8" rx="1" />
      <rect x="18" y="8" width="4" height="8" rx="1" />
      <rect x="6" y="5" width="12" height="14" rx="2" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  fire: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  zap: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
};

const getBmiColor = (category) => {
  switch(category) {
    case 'Berat Badan Normal': return '#16a34a';
    case 'Berat Badan Kurang': return '#f59e0b';
    case 'Berat Badan Lebih': return '#f97316';
    case 'Obesitas': return '#ef4444';
    default: return '#0f3b82';
  }
};

const SectionHeader = ({ icon, title, color = '#1366d6' }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid rgba(15, 85, 170, 0.08)'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      flexShrink: 0
    }}>
      {icon}
    </div>
    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f3b82' }}>{title}</h3>
  </div>
);

const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  const { 
    bmi, category, program, description, kardio, split, details, 
    intensitas, repetisi, karakteristik, dailySchedule 
  } = result;

  const bmiColor = getBmiColor(category);

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* HEADER PREMIUM */}
      <div style={{
        background: 'linear-gradient(135deg, #1366d6 0%, #0f4bb5 100%)',
        borderRadius: '20px 20px 0 0',
        padding: '1.75rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: '160px', height: '160px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          top: '-50px', right: '-40px'
        }} />
        <div style={{
          position: 'absolute', width: '120px', height: '120px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
          bottom: '-40px', left: '-30px'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', position: 'relative' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', backdropFilter: 'blur(4px)'
          }}>
            {icons.dumbbell}
          </div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            Hasil Keputusan Pakar
          </h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: '0.5rem 0 0', position: 'relative' }}>
          Rekomendasi latihan khusus berdasarkan data Anda
        </p>
      </div>

      {/* BODY */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(15, 85, 170, 0.12)',
        borderTop: 'none',
        boxShadow: '0 14px 40px 0 rgba(15, 85, 170, 0.12)',
        borderRadius: '0 0 20px 20px',
        padding: '2rem'
      }}>
        
        {/* ===== BMI & STATUS ===== */}
        <div style={{
          background: `linear-gradient(135deg, ${bmiColor}08, ${bmiColor}04)`,
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          border: `1px solid ${bmiColor}22`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            width: '72px', height: '72px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${bmiColor}, ${bmiColor}dd)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 8px 20px ${bmiColor}33`
          }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {bmi}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#476b9c', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              BMI & Status Berat Badan
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: bmiColor }}>
              {category}
            </div>
            <div style={{
              marginTop: '0.5rem',
              height: '6px',
              background: 'rgba(15, 85, 170, 0.08)',
              borderRadius: '3px',
              overflow: 'hidden',
              maxWidth: '300px'
            }}>
              <div style={{
                height: '100%',
                width: category === 'Berat Badan Normal' ? '50%' : 
                       category === 'Berat Badan Kurang' ? '25%' :
                       category === 'Berat Badan Lebih' ? '70%' : '90%',
                background: bmiColor,
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

        {/* ===== 2 KOLOM: REKOMENDASI GIZI + KARAKTERISTIK ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          
          {/* Rekomendasi Program & Gizi */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(15, 85, 170, 0.1)',
            boxShadow: '0 4px 12px rgba(15, 85, 170, 0.06)'
          }}>
            <SectionHeader icon={icons.nutrition} title="Target & Nutrisi" />

            <div style={{
              background: 'linear-gradient(135deg, #eef5ff, #f5f9ff)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1rem',
              border: '1px solid rgba(15, 85, 170, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {icons.fire}
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#476b9c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program</span>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f3b82' }}>{program}</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#5e7caa', lineHeight: '1.7', margin: '0 0 1rem' }}>
              {description}
            </p>
            
            {kardio && kardio !== '-' && (
              <div style={{
                background: 'linear-gradient(135deg, #fefce8, #fef9c3)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0
                }}>
                  {icons.heart}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>ANJURAN KARDIO KHUSUS</div>
                  <span style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: '1.5' }}>{kardio}</span>
                </div>
              </div>
            )}
          </div>

          {/* Karakteristik Latihan Beban */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(15, 85, 170, 0.1)',
            boxShadow: '0 4px 12px rgba(15, 85, 170, 0.06)'
          }}>
            <SectionHeader icon={icons.zap} title="Karakteristik Intensitas Beban" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Intensitas */}
              <div style={{
                background: 'linear-gradient(135deg, #eef5ff, #f5f9ff)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid rgba(15, 85, 170, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  {icons.zap}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f3b82', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tingkat Intensitas</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#5e7caa', lineHeight: '1.5' }}>{intensitas}</p>
              </div>

              {/* Repetisi */}
              <div style={{
                background: 'linear-gradient(135deg, #eef5ff, #f5f9ff)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid rgba(15, 85, 170, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  {icons.clock}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f3b82', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Repetisi & Istirahat</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#5e7caa', lineHeight: '1.5' }}>{repetisi}</p>
              </div>

              {/* Metode Eksekusi */}
              <div style={{
                background: 'linear-gradient(135deg, #eef5ff, #f5f9ff)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid rgba(15, 85, 170, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  {icons.fire}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f3b82', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Metode Eksekusi</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#5e7caa', lineHeight: '1.5' }}>{karakteristik}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== JADWAL ROTASI ===== */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(15, 85, 170, 0.1)',
          boxShadow: '0 4px 12px rgba(15, 85, 170, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <SectionHeader icon={icons.schedule} title={`Jadwal Harian (${split})`} />

          <p style={{ fontSize: '0.85rem', color: '#5e7caa', lineHeight: '1.6', marginBottom: '1.5rem', textAlign: 'center' }}>
            {details}
          </p>

          {/* Grid jadwal per hari */ }
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {dailySchedule && dailySchedule.map((dayItem, idx) => (
              <div key={idx} style={{
                background: '#f8fbff',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(15, 85, 170, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,85,170,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Header hari */}
                <div style={{
                  background: 'linear-gradient(135deg, #1366d6, #0f4bb5)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                    Hari {dayItem.day}
                  </span>
                  <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)'
                  }}>
                    {dayItem.target}
                  </span>
                </div>

                {/* Tabel latihan */}
                <div style={{ padding: '0.75rem' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.82rem'
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          textAlign: 'left',
                          padding: '0.4rem 0.5rem',
                          color: '#476b9c',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '1px solid rgba(15, 85, 170, 0.08)',
                          width: '30px'
                        }}>No</th>
                        <th style={{
                          textAlign: 'left',
                          padding: '0.4rem 0.5rem',
                          color: '#476b9c',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '1px solid rgba(15, 85, 170, 0.08)'
                        }}>Latihan</th>
                        <th style={{
                          textAlign: 'center',
                          padding: '0.4rem 0.5rem',
                          color: '#476b9c',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: '1px solid rgba(15, 85, 170, 0.08)',
                          width: '80px'
                        }}>Set/Rep</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayItem.exercises.map((exc, eIdx) => {
                        const parsed = parseExercise(exc);
                        return (
                          <tr key={eIdx}>
                            <td style={{
                              padding: '0.5rem 0.5rem',
                              color: '#476b9c',
                              fontWeight: 500,
                              borderBottom: '1px solid rgba(15, 85, 170, 0.05)',
                              verticalAlign: 'top'
                            }}>
                              {eIdx + 1}
                            </td>
                            <td style={{
                              padding: '0.5rem 0.5rem',
                              color: '#0f2a56',
                              fontWeight: 500,
                              borderBottom: '1px solid rgba(15, 85, 170, 0.05)',
                              verticalAlign: 'top'
                            }}>
                              {parsed.name}
                            </td>
                            <td style={{
                              padding: '0.5rem 0.5rem',
                              color: '#1366d6',
                              fontWeight: 600,
                              textAlign: 'center',
                              borderBottom: '1px solid rgba(15, 85, 170, 0.05)',
                              verticalAlign: 'top',
                              fontSize: '0.75rem'
                            }}>
                              {parsed.sets}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== BUTTON KONSULTASI BARU ===== */}
        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #1366d6 0%, #0f4bb5 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '1.5px',
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
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          KONSULTASI BARU
        </button>

      </div>
    </div>
  );
};

export default ResultCard;
