import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import foto1 from '../../disen/foto1.JPG';
import foto2 from '../../disen/foto2.JPG';

// /api → Vite proxy ke localhost:4000 (lokal) | Netlify redirect ke function (production)
const API_BASE = "/api";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [albums, setAlbums] = useState([]);
  const [email, setEmail] = useState('');
  const [komentar, setKomentar] = useState('');
  const [sentiment, setSentiment] = useState('puas');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [alreadyCommented, setAlreadyCommented] = useState(false);

  const backgroundImages = [
    foto1,
    foto2,
  ];

  useEffect(() => {
    // Fetch albums dari server API
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`${API_BASE}/albums`);
        if (response.ok) {
          const data = await response.json();
          setAlbums(data);
        }
      } catch (err) {
        console.error('Gagal memuat album:', err);
      }
    };
    fetchAlbums();

    if (user && !email) {
      setEmail(user.email || '');
    }
  }, [user, email]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!email || !komentar) return;
    
    // Cek apakah email sudah pernah mengirim komentar via server
    try {
      const checkResponse = await fetch(`${API_BASE}/comments`);
      if (!checkResponse.ok) throw new Error('Gagal cek komentar');
      const allComments = await checkResponse.json();
      
      const hasCommented = allComments.some(
        (c) => c.email.toLowerCase() === email.toLowerCase()
      );

      if (hasCommented) {
        setAlreadyCommented(true);
        return;
      }

      // Kirim komentar ke server
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          text: komentar,
          sentiment,
        }),
      });

      if (!response.ok) throw new Error('Gagal mengirim komentar');
      
      setKomentar('');
      setSentiment('puas');
      alert('Komentar berhasil dikirim!');
    } catch (err) {
      alert('Gagal mengirim komentar: ' + err.message);
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`hero-background ${index === currentBgIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-inner container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4rem', maxWidth: '1200px' }}>
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', position: 'relative', animation: 'slideInFromLeft 0.8s ease both' }}>
            <div style={{ position: 'absolute', width: '280px', height: '280px', background: 'rgba(0,0,0,0.18)', borderRadius: '50%', zIndex: 0, top: '52%', left: '52%', transform: 'translate(-50%, -50%)' }}></div>
            <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'linear-gradient(135deg, #1366d6 0%, #0f4bb5 100%)', borderRadius: '50%', zIndex: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }}></div>
            <img src="/gatotkaca berdiri.png" alt="Gatotkaca" style={{ position: 'relative', zIndex: 1, maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(15, 85, 170, 0.15))' }} />
          </div>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideInFromRight 0.8s ease both', animationDelay: '0.2s' }}>
            <img src="/logo beranda.jpg" alt="Gatot Kaca Gym Pasuruan" style={{ maxWidth: '100%', marginBottom: '2rem', borderRadius: '16px', boxShadow: '0 16px 40px rgba(15, 85, 170, 0.12)' }} />
            {user ? (
              <Link to="/user" style={{ background: 'linear-gradient(135deg, #1366d6, #0f4bb5)', color: '#fff', padding: '1rem 4rem', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 12px 28px rgba(15, 85, 170, 0.22)', transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease', cursor: 'pointer' }}>
                Sistem Pakar
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={{ background: 'linear-gradient(135deg, #1366d6, #0f4bb5)', color: '#fff', padding: '1rem 3rem', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 12px 28px rgba(15, 85, 170, 0.22)', transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease', cursor: 'pointer' }}>
                  Daftar
                </Link>
                <Link to="/login" style={{ background: 'transparent', color: '#0f4bb5', border: '2px solid #1366d6', padding: '1rem 3rem', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.35s ease', cursor: 'pointer' }}>
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang-kami" className="tentang-kami-section">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 className="section-title-dark">TENTANG KAMI</h2>
          
          {/* Main About Card */}
          <div style={{ 
            background: '#ffffff',
            borderRadius: '28px',
            overflow: 'hidden',
            boxShadow: '0 18px 40px rgba(15, 85, 170, 0.12)',
            marginBottom: '2.5rem'
          }}>
            {/* Gradient Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1366d6 0%, #0f4bb5 100%)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative circles */}
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                top: '-60px',
                right: '-40px'
              }} />
              <div style={{
                position: 'absolute',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                bottom: '-40px',
                left: '-30px'
              }} />
              <h3 style={{ 
                color: '#ffffff', 
                fontSize: '1.9rem',
                margin: 0,
                fontWeight: '700',
                letterSpacing: '1px',
                position: 'relative'
              }}>
                Gatot Kaca Gym Pasuruan
              </h3>
              <div style={{
                width: '60px',
                height: '3px',
                background: 'rgba(255,255,255,0.4)',
                margin: '0.75rem auto',
                borderRadius: '2px'
              }} />
              <p style={{ 
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.05rem',
                margin: '0.5rem 0 0',
                fontWeight: '500',
                position: 'relative'
              }}>
                Pusat Kebugaran & Fitness Terdepan di Pasuruan
              </p>
            </div>
            
            {/* Content */}
            <div style={{ padding: '3rem 2.5rem' }}>
              {/* Description */}
              <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                <p style={{ color: '#1a365d', fontSize: '1.05rem', lineHeight: '1.9', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '500' }}>
                  <strong>Gatot Kaca Gym</strong> adalah pusat kebugaran modern yang berdiri dengan semangat <strong>"Aji Saka"</strong> — kekuatan, ketangguhan, dan disiplin — yang terinspirasi dari tokoh pewayangan Gatot Kaca. Kami hadir untuk menjadi mitra perjalanan fitness Anda, membantu setiap anggota mencapai versi terbaik dari diri mereka sendiri.
                </p>
                
                {/* Highlight Cards */}
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '2rem'
                }}>
                  {[
                    {
                      icon: (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1366d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      ),
                      title: 'Professional',
                      desc: 'Trainer bersertifikat & berpengalaman'
                    },
                    {
                      icon: (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1366d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                      ),
                      title: 'Lengkap',
                      desc: 'Fasilitas modern & bervariasi'
                    },
                    {
                      icon: (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1366d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      ),
                      title: 'Komunitas',
                      desc: 'Lingkungan supportif & kekeluargaan'
                    }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      textAlign: 'center',
                      flex: '1',
                      minWidth: '160px',
                      maxWidth: '240px',
                      padding: '1.5rem 1rem',
                      borderRadius: '20px',
                      background: '#f5f9ff',
                      border: '1px solid rgba(19, 102, 214, 0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'default'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(15,85,170,0.12)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #e0edff, #cde0ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem'
                      }}>
                        {item.icon}
                      </div>
                      <h4 style={{ color: '#0f3b82', fontSize: '1rem', fontWeight: '700', margin: '0 0 0.35rem' }}>{item.title}</h4>
                      <p style={{ color: '#5e7caa', fontSize: '0.85rem', margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                <p style={{ color: '#476b9c', fontSize: '0.95rem', lineHeight: '1.9', textAlign: 'center', marginBottom: '1.5rem' }}>
                  Dengan berbagai program latihan yang dirancang khusus — mulai dari <strong>pembentukan tubuh</strong>, <strong>penurunan berat badan</strong>, hingga <strong>peningkatan performa atletik</strong> — tim pelatih profesional kami siap membimbing Anda setiap langkah. Kami percaya bahwa setiap orang memiliki potensi untuk menjadi kuat, sehat, dan percaya diri.
                </p>
                
                {/* Tagline */}
                <div style={{
                  background: 'linear-gradient(135deg, #eef5ff, #e0edff)',
                  borderRadius: '16px',
                  padding: '1.25rem 2rem',
                  textAlign: 'center',
                  border: '1px solid rgba(19, 102, 214, 0.12)'
                }}>
                  <p style={{ color: '#0f3b82', fontSize: '1.05rem', fontWeight: '600', margin: 0 }}>
                    "<em>Bersama Gatot Kaca Gym, wujudkan tubuh impian dan gaya hidup sehat Anda!</em>"
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Schedule Section */}
          <h3 style={{
            color: '#0f3b82',
            fontSize: '1.4rem',
            textAlign: 'center',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1366d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Jadwal Operasional
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { hari: 'Senin - Rabu', jam: '07:00 - 21:00' },
              { hari: 'Kamis', jam: '07:00 - 12:00' },
              { hari: 'Jumat', jam: '07:00 - 11:00', jam2: '13:00 - 21:00' },
              { hari: 'Sabtu', jam: '07:00 - 21:00' },
              { hari: 'Minggu', jam: '07:00 - 16:00' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'linear-gradient(135deg, #f5f9ff, #eef5ff)',
                borderRadius: '20px',
                padding: '1.5rem 1.25rem',
                textAlign: 'center',
                border: '1px solid rgba(15, 75, 181, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,85,170,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1366d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.75rem' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <h4 style={{ color: '#0f3b82', fontSize: '0.9rem', fontWeight: '700', margin: '0 0 0.5rem' }}>{item.hari}</h4>
                <p style={{ color: '#1366d6', fontSize: '1rem', fontWeight: '700', margin: 0 }}>{item.jam}</p>
                {item.jam2 && <p style={{ color: '#1366d6', fontSize: '1rem', fontWeight: '700', margin: '0.2rem 0 0' }}>{item.jam2}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section id="fasilitas" className="home-section-light">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 className="section-title-dark">FASILITAS</h2>
          <div className="fasilitas-grid-new">
            <div className="fasilitas-card-new">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m-3-3l3 3 3-3" />
              </svg>
              kamar mandi
            </div>
            <div className="fasilitas-card-new">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Rak barang
            </div>
            <div className="fasilitas-card-new">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              Internet
            </div>
          </div>
        </div>
      </section>

      {/* Album Section */}
      <section id="album" className="section-cream">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 className="section-title-dark">ALBUM</h2>
          <div className="album-grid-new">
            {albums.length > 0 ? (
              albums.slice(0, 6).map((album) => (
                <div key={album.id} className="album-item-new">
                  <img src={album.url} alt="Album" />
                </div>
              ))
            ) : (
              <>
                <div className="album-item-new">
                  <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom, #cceeff, #99ddff, #80cc28, #66b31a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem', color: '#fff', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.2))' }}>☁️</span>
                  </div>
                </div>
                <div className="album-item-new">
                  <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom, #cceeff, #99ddff, #80cc28, #66b31a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem', color: '#fff', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.2))' }}>☁️</span>
                  </div>
                </div>
                <div className="album-item-new">
                  <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(to bottom, #cceeff, #99ddff, #80cc28, #66b31a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem', color: '#fff', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.2))' }}>☁️</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {albums.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/album" style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #e6b95b', paddingBottom: '5px' }}>Lihat semua album</Link>
            </div>
          )}
        </div>
      </section>

      {/* Catatan Section */}
      {user && (
        <section id="catatan" className="home-section-light">
          <div className="container" style={{ maxWidth: '1200px' }}>
            <h2 className="section-title-dark">CATATAN</h2>
            {alreadyCommented ? (
              <div className="catatan-form-container" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '72px', height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 style={{ color: '#92400e', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  Anda sudah memberikan tanggapan!
                </h3>
                <p style={{ color: '#78350f', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Setiap akun hanya dapat mengirimkan satu tanggapan. Terima kasih atas partisipasi Anda.
                </p>
                <button
                  onClick={() => setAlreadyCommented(false)}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #1366d6, #0f4bb5)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontFamily: '"Poppins", sans-serif',
                    boxShadow: '0 6px 16px rgba(15, 75, 181, 0.2)',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  ← Kembali
                </button>
              </div>
            ) : (
              <form className="catatan-form-container" onSubmit={handleCommentSubmit}>
                <label className="catatan-label">Email</label>
                <input type="email" className="catatan-input-new" value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <label className="catatan-label">Kepuasan</label>
                <div className="rating-group">
                  <label className="rating-option">
                    <input type="radio" name="sentiment" value="puas" checked={sentiment === 'puas'} onChange={(e) => setSentiment(e.target.value)} />
                    Puas
                  </label>
                  <label className="rating-option">
                    <input type="radio" name="sentiment" value="kurang puas" checked={sentiment === 'kurang puas'} onChange={(e) => setSentiment(e.target.value)} />
                    Kurang Puas
                  </label>
                  <label className="rating-option">
                    <input type="radio" name="sentiment" value="tidak puas" checked={sentiment === 'tidak puas'} onChange={(e) => setSentiment(e.target.value)} />
                    Tidak Puas
                  </label>
                </div>

                <label className="catatan-label">Komentar</label>
                <textarea className="catatan-textarea-new" value={komentar} onChange={(e) => setKomentar(e.target.value)} required></textarea>
                
                <button type="submit" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #1366d6, #0f4bb5)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease', boxShadow: '0 8px 20px rgba(15, 85, 170, 0.18)' }}>
                  Kirim Komentar
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Maps / Kontak Section */}
      <section id="maps-kontak" className="home-section-cream">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 className="section-title-dark">MAPS/KONTAK</h2>
          <div className="maps-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126428.08343387802!2d112.822941!3d-7.6433299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7c5bc0661e715%3A0x3f5c906809c95213!2sPasuruan%2C%20Pasuruan%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
              className="maps-image" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Maps"
              style={{ border: 0 }}
            ></iframe>
            
            <div className="kontak-flex">
              <a href="https://instagram.com/gatotkaca.gym.pasuruan" target="_blank" rel="noreferrer" className="kontak-item">
                <div style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                gatotkaca.gym.pasuruan
              </a>
              
              <a href="https://wa.me/6285800678110" target="_blank" rel="noreferrer" className="kontak-item">
                <div style={{ background: '#25D366', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                085-800-678-110
              </a>
              
              <a href="https://maps.google.com/?q=Gatotkaca+Gym+Pasuruan" target="_blank" rel="noreferrer" className="maps-btn-new">
                Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

