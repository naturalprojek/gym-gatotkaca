import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { initHeroAnimations, initScrollReveals, initCounters } from "../logic/motion";
import foto1 from "../../disen/foto1.JPG";
import foto2 from "../../disen/foto2.JPG";

// /api → Vite proxy ke localhost:4000 (lokal) | Netlify redirect ke function (production)
const API_BASE = "/api";

// Ikon SVG
const icons = {
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  dumbbell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11" />
      <rect x="2" y="8" width="4" height="8" rx="1" />
      <rect x="18" y="8" width="4" height="8" rx="1" />
      <rect x="6" y="5" width="12" height="14" rx="2" />
    </svg>
  ),
  shower: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16" />
      <path d="M6 12v4a6 6 0 0 0 12 0v-4" />
      <path d="M8 8l1-2" />
      <path d="M12 8l1-2" />
      <path d="M16 8l1-2" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  rack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="4" x2="21" y2="4" />
      <line x1="5" y1="4" x2="5" y2="20" />
      <line x1="19" y1="4" x2="19" y2="20" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  wa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  ig: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const pageRef = useRef(null);
  const [albums, setAlbums] = useState([]);
  const [email, setEmail] = useState("");
  const [komentar, setKomentar] = useState("");
  const [sentiment, setSentiment] = useState("puas");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [alreadyCommented, setAlreadyCommented] = useState(false);

  const backgroundImages = [foto1, foto2];

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
        console.error("Gagal memuat album:", err);
      }
    };
    fetchAlbums();

    if (user && !email) {
      setEmail(user.email || "");
    }
  }, [user, email]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Animasi (GSAP): hero + scroll reveal + counter statistik
  useEffect(() => {
    const cleanupHero = initHeroAnimations(pageRef);
    const cleanupReveal = initScrollReveals(pageRef);
    const cleanupCounters = initCounters(pageRef);
    return () => {
      cleanupHero();
      cleanupReveal();
      cleanupCounters();
    };
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!email || !komentar) return;

    try {
      const checkResponse = await fetch(`${API_BASE}/comments`);
      if (!checkResponse.ok) throw new Error("Gagal cek komentar");
      const allComments = await checkResponse.json();

      const hasCommented = allComments.some(
        (c) => c.email.toLowerCase() === email.toLowerCase(),
      );

      if (hasCommented) {
        setAlreadyCommented(true);
        return;
      }

      const response = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, text: komentar, sentiment }),
      });

      if (!response.ok) throw new Error("Gagal mengirim komentar");

      setKomentar("");
      setSentiment("puas");
      alert("Komentar berhasil dikirim!");
    } catch (err) {
      alert("Gagal mengirim komentar: " + err.message);
    }
  };

  const ctaStyle = {
    background: "var(--gradient-primary)",
    color: "var(--on-primary)",
    padding: "1rem 2.6rem",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "1.05rem",
    fontFamily: "var(--font-body)",
    boxShadow: "var(--shadow-primary)",
    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: "pointer",
    display: "inline-block",
    border: "none",
  };

  const ctaOutlineStyle = {
    background: "transparent",
    color: "#fff",
    border: "2px solid var(--primary-color)",
    padding: "1rem 2.6rem",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "1.05rem",
    fontFamily: "var(--font-body)",
    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: "pointer",
    display: "inline-block",
  };

  const marqueeWords = [
    "Fitness",
    "Kekuatan",
    "Disiplin",
    "Komunitas",
    "Aji Saka",
    "Pasuruan",
  ];

  const stats = [
    { value: 5, suffix: "+", label: "Tahun Melayani" },
    { value: 500, suffix: "+", label: "Anggota Aktif" },
    { value: 10, suffix: "+", label: "Trainer Pro" },
    { value: 50, suffix: "+", label: "Alat Modern" },
  ];

  const fasilitas = [
    {
      icon: icons.shower,
      title: "Kamar Mandi",
      desc: "Bersih & nyaman untuk members",
      cls: "bento-tall",
    },
    {
      icon: icons.rack,
      title: "Rak Barang",
      desc: "Tempat aman untuk tas & barang pribadi",
      cls: "bento-wide",
    },
    {
      icon: icons.wifi,
      title: "Internet",
      desc: "WiFi cepat untuk streaming & music",
      cls: "",
    },
    {
      icon: icons.clock,
      title: "Jadwal Fleksibel",
      desc: "Buka 07.00 – 21.00 setiap hari",
      cls: "",
    },
    {
      icon: icons.brain,
      title: "Konsultasi AI",
      desc: "Program latihan personal via sistem pakar",
      cls: "bento-accent",
    },
  ];

  const schedule = [
    { hari: "Senin - Rabu", jam: "07:00 - 21:00" },
    { hari: "Kamis", jam: "07:00 - 12:00" },
    { hari: "Jumat", jam: "07:00 - 11:00", jam2: "13:00 - 21:00" },
    { hari: "Sabtu", jam: "07:00 - 21:00" },
    { hari: "Minggu", jam: "07:00 - 16:00" },
  ];

  return (
    <div ref={pageRef}>
      {/* ===== HERO v2 ===== */}
      <section id="home" className="hero-section hero-v2">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`hero-background ${index === currentBgIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="hero-overlay" />

        <div className="hero-inner container" style={{ maxWidth: "1200px" }}>
          <div className="hero-grid">
            {/* Kiri: teks & CTA */}
            <div>
              <span className="hero-kicker hero-anim">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 6.5h11M6.5 17.5h11" />
                  <rect x="2" y="8" width="4" height="8" rx="1" />
                  <rect x="18" y="8" width="4" height="8" rx="1" />
                  <rect x="6" y="5" width="12" height="14" rx="2" />
                </svg>
                Pusat Fitness Pasuruan
              </span>

              <h1 className="hero-title hero-anim">
                Kuatkan <span className="hl">Dirimu</span>
                Raih Kekuatan Gatotkaca
              </h1>

              <p className="hero-sub hero-anim">
                Bergabunglah dengan komunitas fitness terbaik di Pasuruan.
                Program latihan personal, trainer profesional, dan fasilitas
                lengkap untuk tubuh impianmu.
              </p>

              <div className="hero-cta-row hero-anim">
                {user ? (
                  <Link
                    to="/user"
                    style={ctaStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 16px 40px rgba(249, 115, 22, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-primary)";
                    }}
                  >
                    Konsultasi Latihan →
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      style={ctaStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 16px 40px rgba(249, 115, 22, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "var(--shadow-primary)";
                      }}
                    >
                      Mulai Sekarang
                    </Link>
                    <Link
                      to="/login"
                      style={ctaOutlineStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.background = "rgba(249, 115, 22, 0.14)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Masuk
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Kanan: gambar Gatotkaca + kartu melayang */}
            <div className="hero-image-wrap hero-anim">
              <div className="hero-image-frame">
                <img src="/gatotkaca berdiri.png" alt="Gatotkaca" className="hero-float" />
              </div>
              <div className="hero-float-card fc-1">
                <span className="fc-icon">{icons.users}</span>
                <div>
                  <div className="fc-val">500+</div>
                  <div className="fc-label">Anggota Aktif</div>
                </div>
              </div>
              <div className="hero-float-card fc-2">
                <span className="fc-icon" style={{ color: "var(--gold)", background: "rgba(251, 191, 36, 0.16)" }}>
                  {icons.star}
                </span>
                <div>
                  <div className="fc-val">4.9</div>
                  <div className="fc-label">Rating Kepuasan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <section className="home-section-light" style={{ padding: "3.5rem 1.25rem" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="stats-bar reveal">
            {stats.map((s, i) => (
              <div className="stats-item" key={i}>
                <div className="stats-value" data-count={s.value} data-suffix={s.suffix}>
                  0{s.suffix}
                </div>
                <div className="stats-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FASILITAS (Bento Grid) ===== */}
      <section id="fasilitas" className="tentang-kami-section">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="text-center reveal">
            <span className="section-kicker center">Fasilitas Kami</span>
            <h2 className="section-title-dark" style={{ marginBottom: "2rem" }}>
              Semua Kebutuhan Latihanmu
            </h2>
          </div>

          <div className="bento-grid">
            {fasilitas.map((f, i) => (
              <div key={i} className={`bento-tile ${f.cls} reveal`} data-delay={i * 0.06}>
                <span className="bento-icon">{f.icon}</span>
                <div>
                  <h3 className="bento-title">{f.title}</h3>
                  <p className="bento-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TENTANG KAMI (dua kolom) ===== */}
      <section id="tentang-kami" className="home-section-light">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="about-grid">
            <div className="about-media reveal">
              <img src={foto1} alt="Gatot Kaca Gym Pasuruan" />
              <div className="about-badge">
                <b>AJI</b>
                <span>Semangat<br />Saka</span>
              </div>
            </div>

            <div className="reveal" data-delay="0.1">
              <span className="section-kicker">Tentang Kami</span>
              <h2 className="section-title-dark" style={{ textAlign: "left", marginBottom: "1.2rem", paddingBottom: "0" }}>
                Gatot Kaca Gym Pasuruan
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.02rem", marginBottom: "1rem" }}>
                <strong style={{ color: "#fff" }}>Gatot Kaca Gym</strong> adalah pusat
                kebugaran modern yang berdiri dengan semangat{" "}
                <strong style={{ color: "#fbbf24" }}>"Aji Saka"</strong> — kekuatan,
                ketangguhan, dan disiplin — terinspirasi dari tokoh pewayangan
                Gatot Kaca.
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.02rem" }}>
                Kami hadir untuk menjadi mitra perjalanan fitness Anda, membantu
                setiap anggota mencapai versi terbaik dari diri mereka sendiri
                — dari pembentukan tubuh, penurunan berat badan, hingga
                peningkatan performa atletik.
              </p>

              <div className="about-features">
                {[
                  "Trainer bersertifikat",
                  "Program latihan personal",
                  "Fasilitas modern & lengkap",
                  "Lingkungan kekeluargaan",
                ].map((t, i) => (
                  <div className="about-feature" key={i}>
                    {icons.check}
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "var(--surface-2)",
                  borderRadius: "16px",
                  padding: "1.1rem 1.5rem",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                }}
              >
                <p style={{ color: "#f8fafc", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                  "Bersama Gatot Kaca Gym, wujudkan tubuh impian dan gaya hidup
                  sehat Anda!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== JADWAL ===== */}
      <section id="jadwal" className="tentang-kami-section">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="text-center reveal">
            <span className="section-kicker center">Jam Buka</span>
            <h2 className="section-title-dark" style={{ marginBottom: "2rem" }}>
              Jadwal Operasional
            </h2>
          </div>

          <div className="schedule-strip reveal">
            {schedule.map((item, idx) => (
              <div className="schedule-card" key={idx}>
                <div className="sc-day">{item.hari}</div>
                <div className="sc-time">{item.jam}</div>
                {item.jam2 && <div className="sc-time">{item.jam2}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALBUM (Masonry) ===== */}
      <section id="album" className="home-section-light">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="text-center reveal">
            <span className="section-kicker center">Galeri</span>
            <h2 className="section-title-dark" style={{ marginBottom: "2rem" }}>
              Album Kegiatan
            </h2>
          </div>

          {albums.length > 0 ? (
            <div className="album-masonry">
              {albums.slice(0, 9).map((album) => (
                <div key={album.id} className="album-item-new reveal">
                  <img src={album.url} alt="Album" />
                </div>
              ))}
            </div>
          ) : (
            <div className="album-masonry">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="album-item-new reveal">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(160deg, #232e4d 0%, #141b2e 60%, #0b0f1c 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(249, 115, 22, 0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center reveal" style={{ marginTop: "2.5rem" }}>
            <Link
              to="/album"
              style={{
                ...ctaOutlineStyle,
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(249, 115, 22, 0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Lihat Semua Album →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATATAN ===== */}
      {user && (
        <section id="catatan" className="tentang-kami-section">
          <div className="container" style={{ maxWidth: "1200px" }}>
            <div className="text-center reveal">
              <span className="section-kicker center">Tanggapan Anda</span>
              <h2 className="section-title-dark" style={{ marginBottom: "2rem" }}>
                Catatan & Komentar
              </h2>
            </div>

            {alreadyCommented ? (
              <div className="catatan-form-container reveal" style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "var(--gradient-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 style={{ color: "#fbbf24", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
                  Anda sudah memberikan tanggapan!
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                  Setiap akun hanya dapat mengirimkan satu tanggapan. Terima kasih
                  atas partisipasi Anda.
                </p>
                <button
                  onClick={() => setAlreadyCommented(false)}
                  style={{
                    padding: "0.75rem 2rem",
                    background: "var(--gradient-primary)",
                    color: "var(--on-primary)",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    boxShadow: "var(--shadow-primary)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  ← Kembali
                </button>
              </div>
            ) : (
              <form className="catatan-form-container reveal" onSubmit={handleCommentSubmit}>
                <label className="catatan-label">Email</label>
                <input
                  type="email"
                  className="catatan-input-new"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className="catatan-label">Kepuasan</label>
                <div className="rating-group">
                  {[
                    { v: "puas", label: "Puas" },
                    { v: "kurang puas", label: "Kurang Puas" },
                    { v: "tidak puas", label: "Tidak Puas" },
                  ].map((o) => (
                    <label className="rating-option" key={o.v}>
                      <input
                        type="radio"
                        name="sentiment"
                        value={o.v}
                        checked={sentiment === o.v}
                        onChange={(e) => setSentiment(e.target.value)}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>

                <label className="catatan-label">Komentar</label>
                <textarea
                  className="catatan-textarea-new"
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  required
                ></textarea>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "var(--gradient-primary)",
                    color: "var(--on-primary)",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    marginTop: "1rem",
                    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: "var(--shadow-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(249, 115, 22, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-primary)";
                  }}
                >
                  Kirim Komentar
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* ===== MAPS / KONTAK ===== */}
      <section id="maps-kontak" className="home-section-light">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="text-center reveal">
            <span className="section-kicker center">Lokasi & Kontak</span>
            <h2 className="section-title-dark" style={{ marginBottom: "2rem" }}>
              Temukan Kami
            </h2>
          </div>

          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: "1.5rem",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126428.08343387802!2d112.822941!3d-7.6433299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7c5bc0661e715%3A0x3f5c906809c95213!2sPasuruan%2C%20Pasuruan%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maps"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "20px",
                width: "100%",
                height: "100%",
                minHeight: "380px",
                filter: "grayscale(0.3) brightness(0.85)",
              }}
            ></iframe>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <a
                href="https://instagram.com/gatotkaca.gym.pasuruan"
                target="_blank"
                rel="noreferrer"
                className="about-feature"
                style={{ padding: "1.4rem", flexDirection: "column", alignItems: "flex-start", gap: "0.75rem", textDecoration: "none" }}
              >
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {icons.ig}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9" }}>Instagram</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>@gatotkaca.gym.pasuruan</div>
                </div>
              </a>

              <a
                href="https://wa.me/6285800678110"
                target="_blank"
                rel="noreferrer"
                className="about-feature"
                style={{ padding: "1.4rem", flexDirection: "column", alignItems: "flex-start", gap: "0.75rem", textDecoration: "none" }}
              >
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "#25D366",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {icons.wa}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9" }}>WhatsApp</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>085-800-678-110</div>
                </div>
              </a>

              <a
                href="https://maps.google.com/?q=Gatotkaca+Gym+Pasuruan"
                target="_blank"
                rel="noreferrer"
                className="about-feature"
                style={{ padding: "1.4rem", flexDirection: "column", alignItems: "flex-start", gap: "0.75rem", textDecoration: "none" }}
              >
                <span
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(249, 115, 22, 0.16)",
                    color: "var(--primary-color)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {icons.pin}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: "#f1f5f9" }}>Google Maps</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Gatot Kaca Gym, Pasuruan</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
