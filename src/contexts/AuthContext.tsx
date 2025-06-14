
import React, { createContext, useState, useEffect } from 'react';

type Role = 'admin' | 'manager' | 'teamlead' | 'member';
type Department = 'convention' | 'exhibition' | 'theatre' | 'it';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (action: 'create' | 'read' | 'update' | 'delete') => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false,
});

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as Role,
    department: 'it' as Department,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=admin'
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager' as Role,
    department: 'convention' as Department,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=manager'
  },
  {
    id: '3',
    name: 'Team Lead',
    email: 'teamlead@example.com',
    password: 'teamlead123',
    role: 'teamlead' as Role,
    department: 'exhibition' as Department,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=teamlead'
  },
  {
    id: '4',
    name: 'Team Member',
    email: 'member@example.com',
    password: 'member123',
    role: 'member' as Role,
    department: 'theatre' as Department,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=member'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!matchedUser) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    
    // Remove password from user object before storing
    const { password: _, ...userWithoutPassword } = matchedUser;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasPermission = (action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
        return true; // Admin can do everything
      case 'manager':
        return true; // Managers can do all CRUD operations
      case 'teamlead':
        return action === 'read' || action === 'update'; // Team leads can read and update
      case 'member':
        return action === 'read'; // Members can only read
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
