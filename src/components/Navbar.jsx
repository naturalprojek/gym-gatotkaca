import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logoSrc from "../../disen/logo1.png";

// Ikon SVG untuk setiap menu
const icons = {
  home: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  schedule: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  fasilitas: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  album: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  catatan: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  kontak: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  admin: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  user: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (location.pathname === "/admin") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="app-navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <img
            src={logoSrc}
            alt="Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Buka menu navigasi"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <a href="/#home" onClick={closeMenu} className="nav-link-item">
            <span className="nav-link-icon">{icons.home}</span>
            Beranda
          </a>
          <a
            href="/#tentang-kami"
            onClick={closeMenu}
            className="nav-link-item"
          >
            <span className="nav-link-icon">{icons.schedule}</span>
            Jadwal
          </a>
          <a href="/#fasilitas" onClick={closeMenu} className="nav-link-item">
            <span className="nav-link-icon">{icons.fasilitas}</span>
            Fasilitas
          </a>
          <a href="/#album" onClick={closeMenu} className="nav-link-item">
            <span className="nav-link-icon">{icons.album}</span>
            Album
          </a>
          {user && (
            <a href="/#catatan" onClick={closeMenu} className="nav-link-item">
              <span className="nav-link-icon">{icons.catatan}</span>
              Catatan
            </a>
          )}
          <a href="/#maps-kontak" onClick={closeMenu} className="nav-link-item">
            <span className="nav-link-icon">{icons.kontak}</span>
            Kontak/Maps
          </a>

          {user && (
            <div className="nav-user">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="nav-link-item nav-admin-link"
                >
                  <span className="nav-link-icon">{icons.admin}</span>
                  Dasbor Admin
                </Link>
              )}
              <div className="nav-user-info">
                <span className="nav-link-icon">{icons.user}</span>
                <span className="nav-user-label">Halo, {user.name}</span>
              </div>
              <button onClick={handleLogout} className="nav-logout-button">
                <span className="nav-link-icon">{icons.logout}</span>
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
