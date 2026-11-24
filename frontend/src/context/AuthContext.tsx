import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  clientName: string;
  plan: 'free' | 'starter' | 'premium';
  callsUsed: number;
  callsLimit: number; // 100 for free, 200 for starter, -1 for unlimited
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, role?: 'admin' | 'user') => void;
  signup: (name: string, email: string, clientName: string, plan?: 'free' | 'starter' | 'premium') => void;
  logout: () => void;
  upgradePlan: (plan: 'free' | 'starter' | 'premium') => void;
  consumeCall: (count?: number) => boolean;
  switchRole: (role: 'admin' | 'user') => void;
  isAuthenticated: boolean;
}

const defaultUser: User = {
  id: 'usr_88231',
  email: 'founder@fintech.in',
  name: 'Rohan Sharma',
  role: 'user',
  clientName: 'Fintech Innovations Ltd',
  plan: 'free',
  callsUsed: 18,
  callsLimit: 100,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('voice_agents_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('voice_agents_token') || 'mock_jwt_token_active';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('voice_agents_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('voice_agents_user');
    }
  }, [user]);

  const login = (email: string, role: 'admin' | 'user' = 'user') => {
    const isSpecialAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const newUser: User = {
      id: isSpecialAdmin ? 'admin_001' : 'usr_' + Math.floor(Math.random() * 90000 + 10000),
      email: email,
      name: isSpecialAdmin ? 'Platform Administrator' : email.split('@')[0],
      role: isSpecialAdmin ? 'admin' : 'user',
      clientName: isSpecialAdmin ? 'Global Admin Operations' : 'Enterprise Solutions',
      plan: isSpecialAdmin ? 'premium' : 'free',
      callsUsed: isSpecialAdmin ? 120 : 12,
      callsLimit: isSpecialAdmin ? -1 : 100,
    };
    setUser(newUser);
    const mockToken = 'jwt_token_' + Date.now();
    setToken(mockToken);
    localStorage.setItem('voice_agents_token', mockToken);
  };

  const signup = (
    name: string,
    email: string,
    clientName: string,
    plan: 'free' | 'starter' | 'premium' = 'free'
  ) => {
    const limit = plan === 'free' ? 100 : plan === 'starter' ? 200 : -1;
    const newUser: User = {
      id: 'usr_' + Math.floor(Math.random() * 90000 + 10000),
      email,
      name,
      role: 'user',
      clientName,
      plan,
      callsUsed: 0,
      callsLimit: limit,
    };
    setUser(newUser);
    const mockToken = 'jwt_token_' + Date.now();
    setToken(mockToken);
    localStorage.setItem('voice_agents_token', mockToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('voice_agents_user');
    localStorage.removeItem('voice_agents_token');
  };

  const upgradePlan = (newPlan: 'free' | 'starter' | 'premium') => {
    if (!user) return;
    const newLimit = newPlan === 'free' ? 100 : newPlan === 'starter' ? 200 : -1;
    setUser({
      ...user,
      plan: newPlan,
      callsLimit: newLimit,
    });
  };

  const consumeCall = (count: number = 1): boolean => {
    if (!user) return false;
    if (user.callsLimit !== -1 && user.callsUsed + count > user.callsLimit) {
      return false; // Quota exceeded
    }
    setUser({
      ...user,
      callsUsed: user.callsUsed + count,
    });
    return true;
  };

  const switchRole = (newRole: 'admin' | 'user') => {
    if (!user) return;
    setUser({
      ...user,
      role: newRole,
      plan: newRole === 'admin' ? 'premium' : user.plan,
      callsLimit: newRole === 'admin' ? -1 : user.callsLimit,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        upgradePlan,
        consumeCall,
        switchRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
