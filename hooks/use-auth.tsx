"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("disaster-watch-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("disaster-watch-user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    // Simular delay de API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        email,
        senha: password,
      }
    );
    console.log(response.data);

    // Validação simples (em produção, seria uma chamada real para API)
    const userData: User = {
      id: response.data.idUsuario,
      name: response.data.nome,
      email: response.data.email,
    };
    setUser(userData);
    localStorage.setItem("disaster-watch-user", JSON.stringify(userData));
    setLoading(false);

    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);

    // Simular delay de API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/usuarios`,
      {
        nome:name,
        email,
        senha: password,
      }
    );

    // Verificar se email já existe
    const users = JSON.parse(
      localStorage.getItem("disaster-watch-users") || "[]"
    );
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      setLoading(false);
      return { success: false, error: "Este email já está cadastrado" };
    }

    // Criar novo usuário
    const newUser = {
      name,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem("disaster-watch-users", JSON.stringify(users));

    // Fazer login automático
    const userData = {
      name: newUser.name,
      email: newUser.email,
    };

    setUser(userData);
    localStorage.setItem("disaster-watch-user", JSON.stringify(userData));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("disaster-watch-user");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("disaster-watch-user", JSON.stringify(updatedUser));

    // Atualizar também na lista de usuários
    const users = JSON.parse(
      localStorage.getItem("disaster-watch-users") || "[]"
    );
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem("disaster-watch-users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
