
import { useContext, createContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterFormValues } from '../types/auth';
import { authService } from '../services/authService';
import { useToast } from './use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [isTestMode, setIsTestMode] = useState<boolean>(false); // Keep this false for real backend

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          let userData: User | null = null;
          
          if (isTestMode) {
            userData = authService.mockGetCurrentUser();
          } else {
            userData = await authService.getCurrentUser();
          }
          
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      let userData: User;
      
      if (isTestMode) {
        userData = await authService.mockLogin(email, password);
      } else {
        await authService.login({ email, password });
        userData = await authService.getCurrentUser();
      }
      
      setUser(userData);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials or server connectivity issue. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      if (isTestMode) {
        const mockUser: User = {
          id: "mock-id-" + Math.random().toString(16).slice(2),
          name: userData.name,
          email: userData.email,
          age: userData.age,
          gender: userData.gender,
          role: userData.role
        };
        
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created. Please log in.',
        });
        
        return;
      }
      
      const registeredUser = await authService.register(userData);
      console.log('Registration successful:', registeredUser);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. Please log in.',
      });
      
      return registeredUser;
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Create a more specific error message
      let errorMessage = 'Could not create your account. ';
      
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 422) {
          errorMessage += 'Invalid information provided. Please check your details.';
        } else if (error.response.status === 409) {
          errorMessage += 'This email is already registered.';
        } else {
          errorMessage += 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // No response received
        errorMessage += 'No response from server. Please check your network connection.';
      } else {
        // Request setup error
        errorMessage += 'Please try again later.';
      }
      
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    localStorage.removeItem('mockUser');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
