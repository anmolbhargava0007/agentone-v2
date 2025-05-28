
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

interface UserRole {
  role_id: number;
  role_name: string;
  pi_modules: Array<{
    module_id: number;
    module_name: string;
  }>;
}

interface UserProperties {
  is_reset_pwd: boolean;
  registered_step: number;
  is_verified: string;
  comp_id: number | null;
  branch_id: number | null;
  location_id: number | null;
  user_type: string;
}

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_mobile: string;
  gender: string;
  updated_by: number;
  is_active: boolean;
  pi_user_prop: UserProperties;
  pi_roles: UserRole[];
}

interface AuthResponse {
  success: boolean;
  statusCode: string;
  msg: string;
  data: User[];
  accessToken: string;
  refreshToken: string;
  expiry_date: string;
  is_app_valid: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a stored user in localStorage (for persistence)
    const storedUser = localStorage.getItem('agentone-user');
    const storedToken = localStorage.getItem('agentone-token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('agentone-user');
        localStorage.removeItem('agentone-token');
        localStorage.removeItem('agentone-refresh-token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          user_pwd: password,
        }),
      });
      
      const data: AuthResponse = await response.json();
      
      if (response.ok && data.success && data.data.length > 0) {
        const userData = data.data[0];
        setUser(userData);
        
        // Store user data and tokens
        localStorage.setItem('agentone-user', JSON.stringify(userData));
        localStorage.setItem('agentone-token', data.accessToken);
        localStorage.setItem('agentone-refresh-token', data.refreshToken);
        
        toast.success(`Welcome back, ${userData.user_name}!`);
        setIsLoading(false);
        return true;
      } else {
        toast.error(data.msg || 'Invalid credentials. Please try again.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      setIsLoading(false);
      return false;
    }
  };
  
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const token = localStorage.getItem('agentone-token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id,
          user_name: userData.user_name || user.user_name,
          user_email: userData.user_email || user.user_email,
          user_mobile: userData.user_mobile || user.user_mobile,
          gender: userData.gender || user.gender,
          is_active: userData.is_active !== undefined ? userData.is_active : user.is_active,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('agentone-user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error(data.msg || 'Failed to update profile.');
        return false;
      }
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('agentone-user');
    localStorage.removeItem('agentone-token');
    localStorage.removeItem('agentone-refresh-token');
    toast.info('You have been logged out');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser
    }}>
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
