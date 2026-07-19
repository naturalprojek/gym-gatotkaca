import React from "react";

const AdminMemberModal = ({
  show,
  onClose,
  editingMember,
  memberForm,
  memberError,
  onFormChange,
  onSave,
}) => {
  if (!show) return null;

  const handleChange = (field, value) => {
    onFormChange({ ...memberForm, [field]: value });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="auth-card animate-fade-in"
        style={{ width: "100%", maxWidth: "480px", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center" style={{ marginBottom: "1.5rem", color: "#0e3e8f" }}>
          {editingMember ? "Edit Akun" : "Tambah Akun Baru"}
        </h2>

        {memberError && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              color: "var(--danger-color)",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid var(--danger-color)",
            }}
          >
            {memberError}
          </div>
        )}

        <form onSubmit={onSave}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-input"
              value={memberForm.name}
              onChange={(e) => handleChange("name", e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={memberForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor HP / WhatsApp</label>
            <input
              type="tel"
              className="form-input"
              value={memberForm.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Contoh: 628123456789"
            />
            <small style={{ color: '#5e7caa', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              Format internasional (62xxx). Untuk tombol WA otomatis.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password {editingMember ? "(kosongkan jika tidak diubah)" : ""}
            </label>
            <input
              type="password"
              className="form-input"
              value={memberForm.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder={editingMember ? "Biarkan kosong jika tidak diubah" : "Minimal 6 karakter"}
              required={!editingMember}
              minLength={editingMember ? 0 : 6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role / Peran</label>
            <select
              className="form-select"
              value={memberForm.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="user">User (Member biasa)</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn"
              style={{
                flex: 1,
                background: "#eef3ff",
                color: "#0f3b82",
                border: "1px solid rgba(15, 85, 170, 0.18)",
              }}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {editingMember ? "Simpan Perubahan" : "Tambah Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMemberModal;
