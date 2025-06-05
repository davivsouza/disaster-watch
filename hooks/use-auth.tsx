"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    notifications: boolean
    alertTypes: string[]
    locations: string[]
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Simular carregamento inicial
  useEffect(() => {
    const savedUser = localStorage.getItem("disaster-watch-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        localStorage.removeItem("disaster-watch-user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Validação simples (em produção, seria uma chamada real para API)
    if (email === "admin@disasterwatch.com" && password === "admin123") {
      const userData: User = {
        id: "1",
        name: "Administrador",
        email: email,
        avatar: "/placeholder.svg?height=40&width=40",
        preferences: {
          notifications: true,
          alertTypes: ["earthquake", "hurricane", "flood"],
          locations: ["Brasil", "Global"]
        }
      }
      setUser(userData)
      localStorage.setItem("disaster-watch-user", JSON.stringify(userData))
      setLoading(false)
      return { success: true }
    }

    // Verificar usuários cadastrados
    const users = JSON.parse(localStorage.getItem("disaster-watch-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar || "/placeholder.svg?height=40&width=40",
        preferences: foundUser.preferences || {
          notifications: true,
          alertTypes: ["earthquake", "hurricane", "flood"],
          locations: ["Brasil"]
        }
      }
      setUser(userData)
      localStorage.setItem("disaster-watch-user", JSON.stringify(userData))
      setLoading(false)
      return { success: true }
    }

    setLoading(false)
    return { success: false, error: "Email ou senha incorretos" }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verificar se email já existe
    const users = JSON.parse(localStorage.getItem("disaster-watch-users") || "[]")
    const existingUser = users.find((u: any) => u.email === email)
    
    if (existingUser) {
      setLoading(false)
      return { success: false, error: "Este email já está cadastrado" }
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: "/placeholder.svg?height=40&width=40",
      preferences: {
        notifications: true,
        alertTypes: ["earthquake", "hurricane", "flood"],
        locations: ["Brasil"]
      }
    }

    users.push(newUser)
    localStorage.setItem("disaster-watch-users", JSON.stringify(users))

    // Fazer login automático
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      preferences: newUser.preferences
    }
    
    setUser(userData)
    localStorage.setItem("disaster-watch-user", JSON.stringify(userData))
    setLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("disaster-watch-user")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("disaster-watch-user", JSON.stringify(updatedUser))
    
    // Atualizar também na lista de usuários
    const users = JSON.parse(localStorage.getItem("disaster-watch-users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data }
      localStorage.setItem("disaster-watch-users", JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
