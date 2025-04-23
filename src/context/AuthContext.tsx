import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthState, User } from '@/types/gameTypes';
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

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
    // Load user from localStorage (as fallback), but Supabase will be source of truth now
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return {
          user,
          isAuthenticated: true,
          isLoading: false,
        };
      } catch {}
    }
    return initialAuthState;
  });

  // Setup Supabase session sync on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? "",
              username: session.user.user_metadata?.username ?? session.user.email ?? "",
              createdAt: session.user.created_at ?? "",
            }
          : null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username ?? session.user.email ?? "",
          createdAt: session.user.created_at ?? "",
        }));
      } else {
        localStorage.removeItem('user');
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? "",
              username: session.user.user_metadata?.username ?? session.user.email ?? "",
              createdAt: session.user.created_at ?? "",
            }
          : null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username ?? session.user.email ?? "",
          createdAt: session.user.created_at ?? "",
        }));
      } else {
        localStorage.removeItem("user");
      }
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  // Supabase-based login
  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        throw new Error(error?.message ?? "Login failed");
      }
      setAuthState({
        user: {
          id: data.user.id,
          email: data.user.email ?? "",
          username: data.user.user_metadata?.username ?? data.user.email ?? "",
          createdAt: data.user.created_at ?? "",
        },
        isAuthenticated: true,
        isLoading: false,
      });
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${data.user.user_metadata?.username ?? data.user.email}!`,
      });
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username ?? data.user.email,
        createdAt: data.user.created_at ?? "",
      }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.message ?? "An unknown error occurred",
      });
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Supabase-based register
  const register = async (email: string, username: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error || !data.user) {
        throw new Error(error?.message ?? "Registration failed");
      }
      setAuthState({
        user: {
          id: data.user.id,
          email: data.user.email ?? "",
          username: username,
          createdAt: data.user.created_at ?? "",
        },
        isAuthenticated: true,
        isLoading: false,
      });
      toast({
        title: "Registration successful",
        description: `Welcome, ${username}!`,
      });
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        username: username,
        createdAt: data.user.created_at ?? "",
      }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error?.message ?? "An unknown error occurred",
      });
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setAuthState(initialAuthState);
    toast({
      title: "Logged out",
      description: "Come back soon!",
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
