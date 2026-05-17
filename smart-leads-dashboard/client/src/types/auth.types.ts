export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}
