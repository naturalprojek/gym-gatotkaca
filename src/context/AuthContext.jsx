import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    const savedUser = localStorage.getItem("gymUser");
    const savedToken = localStorage.getItem("gymToken");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("gymUser", JSON.stringify(userData));
    localStorage.setItem("gymToken", authToken);
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Gagal login");
    }
    saveSession(data.user, data.token);
    return data.user;
  };

  const register = async (newMemberData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMemberData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Gagal daftar");
    }
    saveSession(data.user, data.token);
    return data.user;
  };

  const directSetUser = (userData) => {
    const authToken = "local-" + crypto.randomUUID();
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("gymUser", JSON.stringify(userData));
    localStorage.setItem("gymToken", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("gymUser");
    localStorage.removeItem("gymToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, directSetUser, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
