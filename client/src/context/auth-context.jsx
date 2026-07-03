import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = React.useState(() => window.localStorage.getItem('prepai_access_token'));

  const userQuery = useQuery({
    queryKey: ['auth', 'me', accessToken],
    queryFn: async () => {
      const response = await authApi.me();
      return response.data;
    },
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 60 * 1000,
  });

  React.useEffect(() => {
    if (userQuery.isError) {
      window.localStorage.removeItem('prepai_access_token');
      setAccessToken(null);
    }
  }, [userQuery.isError]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const token = response?.data?.accessToken;
      if (token) {
        window.localStorage.setItem('prepai_access_token', token);
        setAccessToken(token);
        queryClient.setQueryData(['auth', 'me', token], response?.data?.user || null);
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success(response?.message || 'Logged in successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to sign in');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      toast.success(response?.message || 'Account created');
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to create account');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      window.localStorage.removeItem('prepai_access_token');
      setAccessToken(null);
      queryClient.clear();
      toast.success('Logged out');
    },
  });

  const value = React.useMemo(
    () => ({
      user: userQuery.data || null,
      isAuthenticated: Boolean(userQuery.data),
      accessToken,
      isCheckingAuth: Boolean(accessToken) && userQuery.isLoading,
      login: (payload) => loginMutation.mutateAsync(payload),
      register: (payload) => registerMutation.mutateAsync(payload),
      logout: () => logoutMutation.mutateAsync(),
      authError: userQuery.error,
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
    }),
    [accessToken, loginMutation, logoutMutation, registerMutation, userQuery.data, userQuery.error, userQuery.isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}