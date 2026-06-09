import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { compressImage } from "../logic/imageUtils";
import AdminMemberModal from "../components/AdminMemberModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [activeTab, setActiveTab] = useState("beranda");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const mainRef = useRef(null);

  // State untuk Kelola Data - Akun
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [memberError, setMemberError] = useState("");

  // State untuk Kelola Data - Komentar
  const [deletingComment, setDeletingComment] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Fetch users dari server
    try {
      const [usersRes, commentsRes, albumsRes] = await Promise.all([
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/comments`),
        fetch(`${API_BASE}/albums`),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setMembers(usersData);
      }
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
      if (albumsRes.ok) {
        const albumsData = await albumsRes.json();
        setAlbums(albumsData);
      }
    } catch (err) {
      console.error("Gagal load data dari server:", err);
    }
  };

  // ===== CRUD AKUN =====

  const openAddMember = () => {
    setEditingMember(null);
    setMemberForm({ name: "", email: "", password: "", role: "user" });
    setMemberError("");
    setShowMemberModal(true);
  };

  const openEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, email: member.email, password: "", role: member.role || "user" });
    setMemberError("");
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setMemberError("");

    // Validasi
    if (!memberForm.name || !memberForm.email) {
      setMemberError("Nama dan email wajib diisi!");
      return;
    }

    if (!editingMember && !memberForm.password) {
      setMemberError("Password wajib diisi untuk akun baru!");
      return;
    }

    if (memberForm.password && memberForm.password.length < 6) {
      setMemberError("Password minimal 6 karakter!");
      return;
    }

    try {
      if (editingMember) {
        // Edit user via API
        const body = {
          name: memberForm.name,
          email: memberForm.email,
          role: memberForm.role,
        };
        if (memberForm.password) {
          body.password = memberForm.password;
        }

        const response = await fetch(`${API_BASE}/users/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Gagal mengubah akun");
        }

        const updatedUser = await response.json();
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? updatedUser : m))
        );
        alert("Akun berhasil diperbarui!");
      } else {
        // Tambah user baru via API register
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: memberForm.name,
            email: memberForm.email,
            password: memberForm.password,
            role: memberForm.role,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Gagal menambah akun");
        }

        await loadData();
        alert("Akun baru berhasil ditambahkan!");
      }

      setShowMemberModal(false);
    } catch (err) {
      setMemberError(err.message);
    }
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Yakin ingin menghapus akun "${member.name}" (${member.email})?`)) return;

    try {
      const response = await fetch(`${API_BASE}/users/${member.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal menghapus akun");
      }

      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      alert("Akun berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus akun: " + err.message);
    }
  };

  // ===== CRUD KOMENTAR =====

  const handleDeleteComment = async (comment) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    setDeletingComment(true);

    try {
      const response = await fetch(`${API_BASE}/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal menghapus komentar");
      }

      setComments((prev) => prev.filter((c) => c.id !== comment.id));
      alert("Komentar berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus komentar: " + err.message);
    } finally {
      setDeletingComment(false);
    }
  };

  // ===== STATS KOMENTAR =====

  const sentimentStats = () => {
    if (comments.length === 0) {
      return { puas: 50, kurang: 25, tidak: 25 };
    }

    const result = { puas: 0, kurang: 0, tidak: 0 };
    comments.forEach((comment) => {
      const text = (comment.text || "").toLowerCase();
      if (/puas|bagus|mantap|senang|keren|oke|ok|terbaik/.test(text)) {
        result.puas += 1;
      } else if (
        /kurang|biasa|sedikit|tidak puas|buruk|jelek|kurang puas|kurang baik/.test(text)
      ) {
        result.kurang += 1;
      } else {
        result.tidak += 1;
      }
    });

    const total = Math.max(result.puas + result.kurang + result.tidak, 1);
    return {
      puas: Math.round((result.puas / total) * 100),
      kurang: Math.round((result.kurang / total) * 100),
      tidak: Math.round((result.tidak / total) * 100),
    };
  };

  // ===== ALBUM =====

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (maksimal 10MB)");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const originalBase64 = reader.result;
      const compressedBase64 = await compressImage(originalBase64);

      try {
        // Simpan ke server
        const response = await fetch(`${API_BASE}/albums`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: compressedBase64 }),
        });

        if (!response.ok) throw new Error("Gagal upload foto");

        const newAlbum = await response.json();
        setAlbums((prev) => [newAlbum, ...prev]);
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
    } catch (err) {
      alert("Gagal menghapus foto: " + err.message);
    }
  };

  const stats = sentimentStats();
  const latestComments = comments.slice(-8).reverse();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-content">
          <div className="admin-spinner" />
          <p className="admin-loading-text">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-page">
      <div className="admin-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="admin-sidebar slide-in-left">
          <div className="sidebar-brand">
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-brand-text">
              <h2>Admin</h2>
              <p>Gatotkaca Gym</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <Link to="/" className="sidebar-back-link">
              <span className="sidebar-link-icon">←</span>
              <span>Kembali ke Home</span>
            </Link>

            <div className="sidebar-divider" />

            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "beranda" ? "active" : ""}`}
              onClick={() => setActiveTab("beranda")}
            >
              <span className="sidebar-link-icon">📊</span>
              <span>Beranda</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "data" ? "active" : ""}`}
              onClick={() => setActiveTab("data")}
            >
              <span className="sidebar-link-icon">👥</span>
              <span>Kelola Data</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "kelola" ? "active" : ""}`}
              onClick={() => setActiveTab("kelola")}
            >
              <span className="sidebar-link-icon">🖼️</span>
              <span>Kelola Foto</span>
            </button>
          </nav>

          <button type="button" onClick={handleLogout} className="sidebar-logout-btn">
            <span className="sidebar-link-icon">🚪</span>
            <span>Keluar</span>
          </button>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="admin-main" ref={mainRef}>

          {/* ===== TAB BERANDA ===== */}
          {activeTab === "beranda" && (
            <>
              <section className="admin-top-panel">
                <div className="stat-card stat-card-users slide-in-top" style={{ animationDelay: "0.1s" }}>
                  <div className="stat-card-body">
                    <div className="stat-info">
                      <span className="stat-label">Pengguna Terdaftar</span>
                      <span className="stat-value">{members.length}</span>
                    </div>
                    <div className="stat-icon-box">
                      <span className="stat-icon">👥</span>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span className="stat-trend up">↑ Total akun</span>
                  </div>
                </div>

                <div className="stat-card stat-card-feedback slide-in-top" style={{ animationDelay: "0.2s" }}>
                  <div className="stat-card-body">
                    <div className="stat-info">
                      <span className="stat-label">Total Tanggapan</span>
                      <span className="stat-value">{comments.length}</span>
                    </div>
                    <div className="stat-icon-box">
                      <span className="stat-icon">💬</span>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span className="stat-trend up">↑ Masukan pengguna</span>
                  </div>
                </div>

                <div className="stat-card stat-card-photo slide-in-top" style={{ animationDelay: "0.3s" }}>
                  <div className="stat-card-body">
                    <div className="stat-info">
                      <span className="stat-label">Foto Album</span>
                      <span className="stat-value">{albums.length}</span>
                    </div>
                    <div className="stat-icon-box">
                      <span className="stat-icon">🖼️</span>
                    </div>
                  </div>
                  <div className="stat-footer">
                    <span className="stat-trend up">↑ Koleksi foto</span>
                  </div>
                </div>
              </section>

              <section className="admin-bottom-panel">
                <div className="content-card comments-card slide-in-left" style={{ animationDelay: "0.4s" }}>
                  <div className="content-card-header">
                    <h3><span className="header-icon">💬</span> Komentar Terbaru</h3>
                    <span className="card-badge">{latestComments.length} terbaru</span>
                  </div>
                  {latestComments.length === 0 ? (
                    <div className="empty-state-wrap">
                      <span className="empty-icon">📭</span>
                      <p className="empty-text">Belum ada komentar masuk.</p>
                    </div>
                  ) : (
                    <div className="table-wrap">
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th className="col-no">No</th>
                            <th>Email</th>
                            <th>Pesan</th>
                            <th className="col-date">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latestComments.map((comment, index) => (
                            <tr key={comment.id}>
                              <td className="col-no">{index + 1}</td>
                              <td>
                                <span className="td-email">{comment.email}</span>
                              </td>
                              <td className="td-message">{comment.text}</td>
                              <td className="col-date">
                                <span className="td-date">{new Date(comment.date).toLocaleDateString("id-ID")}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="content-card chart-card slide-in-right" style={{ animationDelay: "0.5s" }}>
                  <div className="content-card-header">
                    <h3><span className="header-icon">📊</span> Grafik Kepuasan</h3>
                    <span className="card-badge">{comments.length} tanggapan</span>
                  </div>
                  <div className="chart-wrapper">
                    <div className="pie-container">
                      <div
                        className="pie-chart"
                        style={{
                          background: `conic-gradient(#16a34a 0 ${stats.puas}%, #2563eb ${stats.puas}% ${stats.puas + stats.kurang}%, #ef4444 ${stats.puas + stats.kurang}% 100%)`,
                        }}
                      >
                        <div className="pie-center">
                          <span className="pie-center-value">{stats.puas}%</span>
                          <span className="pie-center-label">Puas</span>
                        </div>
                      </div>
                    </div>

                    <div className="chart-legend">
                      <div className="legend-item" data-color="green">
                        <span className="legend-dot green" />
                        <span className="legend-label">Puas</span>
                        <span className="legend-badge">{stats.puas}%</span>
                      </div>
                      <div className="legend-item" data-color="blue">
                        <span className="legend-dot blue" />
                        <span className="legend-label">Kurang Puas</span>
                        <span className="legend-badge">{stats.kurang}%</span>
                      </div>
                      <div className="legend-item" data-color="red">
                        <span className="legend-dot red" />
                        <span className="legend-label">Tidak Puas</span>
                        <span className="legend-badge">{stats.tidak}%</span>
                      </div>
                      <div className="legend-divider" />
                      <div className="legend-total">
                        <span className="legend-label">Total</span>
                        <span className="legend-badge total">{comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ===== TAB KELOLA DATA ===== */}
          {activeTab === "data" && (
            <section className="data-tab-grid">
              {/* DATA AKUN */}
              <div className="content-card data-card slide-in-left" style={{ animationDelay: "0.1s" }}>
                <div className="content-card-header between">
                  <h3><span className="header-icon">👥</span> Data Akun</h3>
                  <button onClick={openAddMember} className="btn-add">
                    <span>+</span> Tambah Akun
                  </button>
                </div>

                {members.length === 0 ? (
                  <div className="empty-state-wrap">
                    <span className="empty-icon">📭</span>
                    <p className="empty-text">Belum ada pengguna terdaftar.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th className="col-no">No</th>
                          <th>Nama</th>
                          <th>Email</th>
                          <th className="col-role">Role</th>
                          <th className="col-actions">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, index) => (
                          <tr key={member.id}>
                            <td className="col-no">{index + 1}</td>
                            <td className="td-name">{member.name}</td>
                            <td>
                              <span className="td-email">{member.email}</span>
                            </td>
                            <td className="col-role">
                              <span className={`role-badge ${member.role === "admin" ? "role-admin" : "role-user"}`}>
                                {member.role || "user"}
                              </span>
                            </td>
                            <td className="col-actions">
                              <div className="action-btns">
                                <button
                                  onClick={() => openEditMember(member)}
                                  className="action-btn action-edit"
                                >
                                  <span className="action-btn-icon">✏️</span> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member)}
                                  className="action-btn action-delete"
                                >
                                  <span className="action-btn-icon">🗑️</span> Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* DATA KOMENTAR */}
              <div className="content-card data-card slide-in-right" style={{ animationDelay: "0.2s" }}>
                <div className="content-card-header">
                  <h3><span className="header-icon">💬</span> Data Komentar</h3>
                  <span className="card-badge">{comments.length} total</span>
                </div>

                {comments.length === 0 ? (
                  <div className="empty-state-wrap">
                    <span className="empty-icon">📭</span>
                    <p className="empty-text">Belum ada komentar.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th className="col-no">No</th>
                          <th>Email</th>
                          <th>Pesan</th>
                          <th className="col-sentiment">Sentimen</th>
                          <th className="col-date">Tanggal</th>
                          <th className="col-actions">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...comments].reverse().map((comment, index) => (
                          <tr key={comment.id}>
                            <td className="col-no">{index + 1}</td>
                            <td>
                              <span className="td-email">{comment.email}</span>
                            </td>
                            <td className="td-message">{comment.text}</td>
                            <td className="col-sentiment">
                              <span
                                className={`sentiment-badge ${
                                  comment.sentiment === "puas"
                                    ? "sentiment-puas"
                                    : comment.sentiment === "kurang puas"
                                      ? "sentiment-kurang"
                                      : "sentiment-tidak"
                                }`}
                              >
                                {comment.sentiment === "puas" && <span className="sentiment-emoji">😊</span>}
                                {comment.sentiment === "kurang puas" && <span className="sentiment-emoji">😐</span>}
                                {comment.sentiment === "tidak puas" && <span className="sentiment-emoji">😞</span>}
                                {comment.sentiment === "puas" ? " Puas" : comment.sentiment === "kurang puas" ? " Kurang Puas" : " Tidak Puas"}
                              </span>
                            </td>
                            <td className="col-date">
                              <span className="td-date">{new Date(comment.date).toLocaleDateString("id-ID")}</span>
                            </td>
                            <td className="col-actions">
                              <button
                                onClick={() => handleDeleteComment(comment)}
                                disabled={deletingComment}
                                className={`action-btn action-delete ${deletingComment ? "disabled" : ""}`}
                              >
                                <span className="action-btn-icon">🗑️</span> Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ===== TAB KELOLA FOTO ===== */}
          {activeTab === "kelola" && (
            <section className="content-card photo-manager-card slide-in-bottom" style={{ animationDelay: "0.3s" }}>
              <div className="content-card-header">
                <h3><span className="header-icon">🖼️</span> Kelola Foto</h3>
                <span className="card-badge">{albums.length} foto</span>
              </div>

              <div
                className={`upload-zone ${uploading ? "uploading" : ""}`}
                onClick={() => {
                  if (!uploading && fileInputRef.current) fileInputRef.current.click();
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
                  <div className="upload-zone-content">
                    <div className="upload-spinner" />
                    <p className="upload-text">Memproses foto...</p>
                  </div>
                ) : (
                  <div className="upload-zone-content">
                    <div className="upload-icon-box">
                      <span className="upload-icon">📤</span>
                    </div>
                    <p className="upload-title">Klik untuk Upload Foto</p>
                    <p className="upload-hint">Maksimal 10MB per foto</p>
                  </div>
                )}
              </div>

              {albums.length === 0 ? (
                <div className="empty-state-wrap" style={{ marginTop: "1.5rem" }}>
                  <span className="empty-icon">📭</span>
                  <p className="empty-text">Belum ada foto album.</p>
                </div>
              ) : (
                <div className="photo-grid">
                  {albums.map((album) => (
                    <div key={album.id} className="photo-card">
                      <div className="photo-img-wrap">
                        <img src={album.url} alt="Album" />
                      </div>
                      <button
                        type="button"
                        className="photo-delete-btn"
                        onClick={() => handleDeleteAlbum(album.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* MODAL AKUN */}
      <AdminMemberModal
        show={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        editingMember={editingMember}
        memberForm={memberForm}
        memberError={memberError}
        onFormChange={setMemberForm}
        onSave={handleSaveMember}
      />
    </div>
  );
};

export default AdminDashboard;
