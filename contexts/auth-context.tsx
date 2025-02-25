"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  phone: string
  whatsapp: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (user: Omit<User, "id"> & { password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (e.g., by checking local storage)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    const mockUser: User = {
      id: "demo123",
      name: "Demo User",
      email: email,
      phone: "+1234567890",
      whatsapp: "+1234567890",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo123"
    }

    localStorage.setItem("user", JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const signup = async (userData: Omit<User, "id"> & { password: string }) => {
    // In a real app, this would make an API call
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/auth")
  }

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>
}
