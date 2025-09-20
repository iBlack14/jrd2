import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "juridica" | "cliente" | "admin";
export interface User {
  username: string;
  role: Role;
  display: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, { password: string; role: Role; display: string }> = {
  admin: { password: "admin1", role: "admin", display: "Admin" },
  juez: { password: "juez1", role: "juridica", display: "Juez" },
  prueba: { password: "prueba", role: "cliente", display: "Cliente" },
};

const STORAGE_KEY = "lexflow_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login: AuthContextType["login"] = async (username, password) => {
    const entry = DEMO_USERS[username];
    if (!entry) return { ok: false, error: "Usuario no encontrado" };
    if (entry.password !== password) return { ok: false, error: "Contraseña incorrecta" };
    setUser({ username, role: entry.role, display: entry.display });
    return { ok: true };
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
