
export interface User {
  id: string;
  name: string;
  email: string; // Changed from username
  age: number;
  gender: string;  // "Male" | "Female"
  role: string;    // "Patient" | "Doctor" | "Neurologist"
}

export interface LoginFormValues {
  email: string;  // Changed from username
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;  // Changed from username
  password: string;
  age: number;
  gender: string;  // "Male" | "Female"
  role: string;    // "Patient" | "Doctor" | "Neurologist"
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>; // Changed from username
  register: (userData: RegisterFormValues) => Promise<User | void>;
  logout: () => void;
}
