import React from "react";
import { Link } from "react-router-dom";
import logoSrc from "../../disen/logo1.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logoSrc} alt="Gatot Kaca Gym" />
            <p>
              Pusat kebugaran & fitness terdepan di Pasuruan. Kuatkan tubuh,
              asah disiplin — bersama semangat Aji Saka.
            </p>
          </div>

          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li>
                <a href="/#home">Beranda</a>
              </li>
              <li>
                <a href="/#tentang-kami">Tentang Kami</a>
              </li>
              <li>
                <a href="/#fasilitas">Fasilitas</a>
              </li>
              <li>
                <a href="/#album">Album</a>
              </li>
              <li>
                <Link to="/user">Konsultasi Latihan</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Jam Operasional</h4>
            <ul>
              <li>Senin – Rabu: 07.00 – 21.00</li>
              <li>Kamis: 07.00 – 12.00</li>
              <li>Jumat: 07.00 – 11.00 & 13.00 – 21.00</li>
              <li>Sabtu: 07.00 – 21.00</li>
              <li>Minggu: 07.00 – 16.00</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kontak</h4>
            <ul>
              <li>
                <a
                  href="https://instagram.com/gatotkaca.gym.pasuruan"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://wa.me/6285800678110" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Gatotkaca+Gym+Pasuruan"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lokasi di Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Gatot Kaca Gym Pasuruan. Semua hak dilindungi.</span>
          <span>Dibuat dengan semangat 💪 Aji Saka</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
