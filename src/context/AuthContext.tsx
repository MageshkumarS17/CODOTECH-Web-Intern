import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserState } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends UserState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>({
    currentUser: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setState({
        currentUser: JSON.parse(savedUser),
        isLoading: false,
        error: null,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = mockUsers.find((u) => u.email === email);
      
      if (user) {
        setState({ currentUser: user, isLoading: false, error: null });
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setState({ currentUser: null, isLoading: false, error: null });
  };

  const register = async (username: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = mockUsers.some((u) => u.email === email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }
      
      // In a real app, we'd store the new user in a database
      // For this mock implementation, we'll just create the user object
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        username,
        email,
        isAdmin: false,
      };
      
      setState({ currentUser: newUser, isLoading: false, error: null });
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};