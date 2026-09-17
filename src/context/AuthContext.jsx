import React, { createContext, useContext, useState, useCallback } from 'react'

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
    name: 'Sarah Chen',
    email: 'sarah.chen@techrecruiters.io',
    role: 'recruiter',
    company: 'Apex Tech Solutions',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-11-10',
  },
  admin: {
    id: 'usr_adm_303',
    name: 'Marcus Vance',
    email: 'admin@ai-interview-coach.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-08-01',
  },
}

// Role → home page mapping (single source of truth)
export const ROLE_HOME = {
  candidate: '/dashboard',
  recruiter: '/recruiter',
  admin: '/admin',
}

export const AuthProvider = ({ children }) => {
  // Start unauthenticated — users must explicitly log in
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  // Callback set by AuthModal/ProtectedRoute so we can redirect after login
  const [postLoginRedirect, setPostLoginRedirect] = useState(null)

  const openAuthModal = useCallback((initialTab = 'login') => {
    setAuthModalTab(initialTab)
    setAuthModalOpen(true)
  }, [])

  const login = useCallback((email, password, role = 'candidate') => {
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
    setAuthModalOpen(false)
    return { success: true, user: selectedUser }
  }, [])

  const signup = useCallback((name, email, password, role = 'candidate') => {
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
    setAuthModalOpen(false)
    return { success: true, user: newUser }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        postLoginRedirect,
        setPostLoginRedirect,
        ROLE_HOME,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
