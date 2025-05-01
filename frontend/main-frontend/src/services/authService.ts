
import axios from 'axios';
import { api } from '../lib/api';
// Adjust the import path as necessary
import { User, RegisterFormValues } from '../types/auth';

// Types for authentication
interface LoginCredentials {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Update this to match your FastAPI server
// If running locally in development, this should work, otherwise adjust for your deployment
//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000' || "https://stroke-diagnoser.onrender.com"; 
const API_URL = "https://stroke-diagnoser.onrender.com"; 
export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    try {
      // For FastAPI's OAuth2 implementation, we need to use URLSearchParams
      const formData = new URLSearchParams();
      formData.append('username', credentials.email); // Use email as username for OAuth2 compatibility
      formData.append('password', credentials.password);

      const response = await axios.post(`${API_URL}/token`, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        //withCredentials: true, // Important for CORS with credentials
      });

      // Store the token in localStorage for subsequent requests
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterFormValues): Promise<User> => {
    try {
      // Map frontend model to backend model - use email as username for the backend
      const backendUser = {
        name: userData.name,
        username: userData.email, // Map email to username which backend expects
        password: userData.password,
        age: userData.age,
        gender: userData.gender,
        role: userData.role
      };
      
      // Using direct axios for registration with CORS credentials
      const response = await axios.post(`${API_URL}/users`, backendUser, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        //withCredentials: true, // Important for CORS with credentials
      });
      console.log(response.data);
      
      return response.data as User;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      // Using direct axios to fetch user details with CORS credentials
      const response = await axios.get(`${API_URL}/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        //withCredentials: true, // Important for CORS with credentials
      });
      
      const userData = response.data;
      
      // Map the backend user model to the frontend User type
      // Note: backend returns username but frontend uses email
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.username, // Map username from backend to email in frontend
        age: userData.age || 0,
        gender: userData.gender,
        role: userData.role
      };
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
  
  // For testing without a backend
  mockLogin: async (email: string, password: string): Promise<User> => {
    // Simple mock login for testing
    const mockUser: User = {
      id: "mock-id-123",
      name: email.split('@')[0],
      email: email,
      age: 30,
      gender: "Male",
      role: email.includes("doctor") ? "Doctor" : 
            email.includes("neuro") ? "Neurologist" : "Patient"
    };
    
    // Store mock token
    localStorage.setItem('token', 'mock-token-for-testing');
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    return mockUser;
  },
  
  mockGetCurrentUser: (): User | null => {
    const mockUserStr = localStorage.getItem('mockUser');
    if (!mockUserStr) return null;
    return JSON.parse(mockUserStr) as User;
  }
};
