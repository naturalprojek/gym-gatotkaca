import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { compressImage } from "../logic/imageUtils";

// /api → Vite proxy ke localhost:4000 (lokal) | Netlify redirect ke function (production)
const API_BASE = "/api";

const Album = () => {
  const { user } = useContext(AuthContext);
  const [albums, setAlbums] = useState([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
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
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (maksimal 10MB)");
      return;
    }

    setSelectedFileName(file.name);
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const originalBase64 = reader.result;
      const compressedBase64 = await compressImage(originalBase64);

      try {
        const response = await fetch(`${API_BASE}/albums`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: compressedBase64,
            title: newAlbumTitle || null,
          }),
        });

        if (!response.ok) throw new Error("Gagal upload foto");

        const newAlbum = await response.json();
        setAlbums((prev) => [newAlbum, ...prev]);
        setNewAlbumTitle("");
        setSelectedFileName("");
        alert("Foto album berhasil ditambahkan!");
      } catch (err) {
        alert("Gagal upload foto: " + err.message);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm("Yakin ingin menghapus foto ini?")) return;

    try {
      const response = await fetch(`${API_BASE}/albums/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus foto");

      setAlbums((prev) => prev.filter((a) => a.id !== id));
      alert("Foto album berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus foto: " + err.message);
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
          paddingTop: "100px",
          paddingBottom: "3rem",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h1 className="section-title-dark" style={{ marginBottom: 0 }}>
              Galeri Album
            </h1>
            <Link
              to="/"
              style={{
                color: "#0f4bb5",
                textDecoration: "none",
                fontWeight: "bold",
                borderBottom: "2px solid #1366d6",
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              ← Kembali ke Beranda
            </Link>
          </div>

          {/* Upload Area - Hanya untuk admin */}
          {user && user.role === "admin" && (
            <div
              className="glass-panel"
              style={{
                padding: "2rem",
                marginBottom: "2rem",
                borderRadius: "20px",
                border: "2px dashed rgba(19, 102, 214, 0.3)",
                background: "rgba(255, 255, 255, 0.85)",
                cursor: uploading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onClick={() => {
                if (!uploading && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#1366d6";
                e.currentTarget.style.background = "rgba(19, 102, 214, 0.05)";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(19, 102, 214, 0.3)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "rgba(19, 102, 214, 0.3)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
                const file = e.dataTransfer.files[0];
                if (file && fileInputRef.current) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  fileInputRef.current.files = dt.files;
                  handleFileSelect({ target: { files: dt.files } });
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              {uploading ? (
                <div style={{ padding: "1rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      border: "4px solid #eef5ff",
                      borderTop: "4px solid #1366d6",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      margin: "0 auto 1rem",
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p style={{ color: "#1366d6", fontWeight: "600", margin: 0 }}>
                    Mengupload {selectedFileName}...
                  </p>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1366d6, #0f4bb5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                      fontSize: "2rem",
                      color: "#fff",
                      boxShadow: "0 8px 20px rgba(19, 102, 214, 0.25)",
                    }}
                  >
                    +
                  </div>
                  <p
                    style={{
                      color: "#0f3b82",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Tambah Foto Baru
                  </p>
                  <p style={{ color: "#476b9c", fontSize: "0.9rem", margin: 0 }}>
                    Klik atau seret foto ke sini • Maks 10MB
                  </p>
                </div>
              )}

              {user && user.role === "admin" && !uploading && (
                <div style={{ marginTop: "1rem", maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
                  <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    placeholder="Judul foto (opsional)"
                    className="form-input"
                    style={{
                      background: "#eef3ff",
                      border: "1px solid rgba(15, 85, 170, 0.18)",
                      color: "#0f2a56",
                      textAlign: "center",
                      borderRadius: "12px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          )}

          {/* Grid Album */}
          <div
            className="album-grid-new"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {albums.length > 0 ? (
              albums.map((album) => (
                <div
                  key={album.id}
                  className="album-item-new"
                  style={{
                    aspectRatio: "1",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 12px 32px rgba(15, 85, 170, 0.08)",
                    transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 18px 45px rgba(15, 85, 170, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(15, 85, 170, 0.08)";
                  }}
                >
                  <img
                    src={album.url}
                    alt={album.title || "Foto album"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />

                  {album.title && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                        padding: "1.5rem 1rem 0.75rem",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {album.title}
                    </div>
                  )}

                  {user && user.role === "admin" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlbum(album.id);
                      }}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(239, 68, 68, 0.9)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 10,
                        transition: "transform 0.2s ease, background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.08)";
                        e.currentTarget.style.background = "rgba(220, 38, 38, 0.95)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)";
                      }}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "#476b9c",
                }}
              >
                <div
                  style={{
                    fontSize: "4rem",
                    marginBottom: "1rem",
                    opacity: 0.5,
                  }}
                >
                  🖼️
                </div>
                <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                  Belum ada foto di album.
                </p>
                {user && user.role === "admin" && (
                  <p style={{ color: "#5e7caa" }}>
                    Klik area upload di atas untuk menambahkan foto
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Album;
