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
  register: (payload: { username: string; password: string; display: string }) => Promise<{ ok: boolean; error?: string }>;
  createUser: (payload: { username: string; password: string; display: string; role: Role }) => Promise<{ ok: boolean; error?: string }>;
  listUsers: () => Array<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, { password: string; role: Role; display: string }> = {
  admin: { password: "admin1", role: "admin", display: "Admin" },
  juez: { password: "juez1", role: "juridica", display: "Juez" },
  prueba: { password: "prueba", role: "cliente", display: "Cliente" },
};

const STORAGE_KEY = "lexflow_auth_user";
const REGISTERED_KEY = "lexflow_registered_users";

function getRegisteredUsers(): Record<string, { password: string; role: Role; display: string }> {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") return obj;
  } catch {}
  return {};
}

function setRegisteredUsers(users: Record<string, { password: string; role: Role; display: string }>) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
}

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
    const reg = getRegisteredUsers();
    const regEntry = reg[username];
    const entry = DEMO_USERS[username] || regEntry;
    if (!entry) return { ok: false, error: "Usuario no encontrado" };
    if (entry.password !== password) return { ok: false, error: "Contraseña incorrecta" };
    setUser({ username, role: entry.role, display: entry.display });
    return { ok: true };
  };

  const register: AuthContextType["register"] = async ({ username, password, display }) => {
    const taken = DEMO_USERS[username] || getRegisteredUsers()[username];
    if (taken) return { ok: false, error: "El usuario ya existe" };
    const next = { ...getRegisteredUsers(), [username]: { password, role: "cliente", display } };
    setRegisteredUsers(next);
    setUser({ username, role: "cliente", display });
    return { ok: true };
  };

  const createUser: AuthContextType["createUser"] = async ({ username, password, display, role }) => {
    const taken = DEMO_USERS[username] || getRegisteredUsers()[username];
    if (taken) return { ok: false, error: "El usuario ya existe" };
    const next = { ...getRegisteredUsers(), [username]: { password, role, display } };
    setRegisteredUsers(next);
    return { ok: true };
  };

  const listUsers: AuthContextType["listUsers"] = () => {
    const reg = getRegisteredUsers();
    return Object.entries(reg).map(([username, v]) => ({ username, display: v.display, role: v.role }));
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, createUser, listUsers, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
