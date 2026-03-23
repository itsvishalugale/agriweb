import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      api
        .get("/auth/profile")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);

    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    setUser(res.data.user);
    return res.data.user.role;
  };

  const register = async (data, role) => {
    const res = await api.post("/auth/register", { ...data, role });

    localStorage.setItem("token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    setUser(res.data.user);
    return res.data.user.role;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }} // ✅ FIXED
    >
      {children}
    </AuthContext.Provider>
  );
};
