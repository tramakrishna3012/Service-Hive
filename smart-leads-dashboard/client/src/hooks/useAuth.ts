import { useAuthStore } from '../store/authSlice';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isAuthenticated: isAuthenticated && !!token,
    isAdmin,
    setAuth,
    logout,
  };
};
