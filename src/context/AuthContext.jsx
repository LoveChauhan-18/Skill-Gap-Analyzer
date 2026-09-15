import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = {
  candidate: {
    id: 'usr_cand_101',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Full Stack Engineer',
    joinedDate: '2026-01-15',
  },
  recruiter: {
    id: 'usr_rec_202',
    name: 'Sarah Chen (Senior Technical Recruiter)',
    email: 'sarah.chen@techrecruiters.io',
    role: 'recruiter',
    company: 'Apex Tech Solutions',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-11-10',
  },
  admin: {
    id: 'usr_adm_303',
    name: 'Marcus Vance (Platform Admin)',
    email: 'admin@ai-interview-coach.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-08-01',
  },
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('ai_coach_role') || 'candidate'
    return MOCK_USERS[savedRole] || MOCK_USERS.candidate
  })

  const [token, setToken] = useState(() => localStorage.getItem('ai_coach_jwt') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token')
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const switchRole = (newRole) => {
    if (MOCK_USERS[newRole]) {
      setUser(MOCK_USERS[newRole])
      localStorage.setItem('ai_coach_role', newRole)
    }
  }

  const login = (email, password, role = 'candidate') => {
    const selectedUser = MOCK_USERS[role] || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
    }

    const mockJwt = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ id: selectedUser.id, role: selectedUser.role }))}.sign`
    setUser(selectedUser)
    setToken(mockJwt)
    localStorage.setItem('ai_coach_role', role)
    localStorage.setItem('ai_coach_jwt', mockJwt)
    setAuthModalOpen(false)
    return { success: true, user: selectedUser }
  }

  const signup = (name, email, password, role = 'candidate') => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
    }
    const mockJwt = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ id: newUser.id, role: newUser.role }))}.sign`
    setUser(newUser)
    setToken(mockJwt)
    localStorage.setItem('ai_coach_role', role)
    localStorage.setItem('ai_coach_jwt', mockJwt)
    setAuthModalOpen(false)
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ai_coach_role')
    localStorage.removeItem('ai_coach_jwt')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        switchRole,
        login,
        signup,
        logout,
        authModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
