
import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, User } from '@/types/gameTypes';
import { toast } from '@/hooks/use-toast';

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return {
          user,
          isAuthenticated: true,
          isLoading: false,
        };
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    return initialAuthState;
  });

  // Mock login function (in a real app, this would call an API)
  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, simple validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid email or password');
      }
      
      // Create mock user
      const user: User = {
        id: `user-${Date.now()}`,
        email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update auth state
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Logged in successfully',
        description: `Welcome back, ${user.username}!`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Mock register function
  const register = async (email: string, username: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate inputs
      if (!email.includes('@')) {
        throw new Error('Invalid email address');
      }
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Create mock user
      const user: User = {
        id: `user-${Date.now()}`,
        email,
        username,
        createdAt: new Date().toISOString(),
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update auth state
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Registration successful',
        description: `Welcome, ${username}!`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setAuthState(initialAuthState);
    toast({
      title: 'Logged out',
      description: 'Come back soon!',
    });
  };

  // Context value
  const contextValue: AuthContextType = {
    authState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
