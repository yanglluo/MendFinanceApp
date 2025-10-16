
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

class AuthService {
  private AUTH_KEY = 'mend_auth_token';
  private USER_KEY = 'mend_current_user';

  /**
   * Mock authentication - in production, this would connect to a real backend
   */
  async login(email: string, password: string): Promise<User | null> {
    try {
      // Mock validation
      if (email && password) {
        // In production, validate against backend
        const token = `mock_token_${Date.now()}`;
        await SecureStore.setItemAsync(this.AUTH_KEY, token);
        
        // Return mock user
        const user: User = {
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
          budgetPeriod: 'monthly',
          transparencyMode: 'full',
          budgetAmount: 1000,
          enableNotifications: true,
          enableCloudSync: false,
        };

        await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async signup(email: string, password: string, name: string): Promise<User | null> {
    try {
      if (email && password && name) {
        const token = `mock_token_${Date.now()}`;
        await SecureStore.setItemAsync(this.AUTH_KEY, token);

        const user: User = {
          id: `user_${Date.now()}`,
          email,
          name,
          createdAt: new Date().toISOString(),
          budgetPeriod: 'monthly',
          transparencyMode: 'full',
          budgetAmount: 1000,
          enableNotifications: true,
          enableCloudSync: false,
        };

        await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.AUTH_KEY);
      await SecureStore.deleteItemAsync(this.USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync(this.AUTH_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await SecureStore.getItemAsync(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Update user error:', error);
    }
  }
}

export default new AuthService();
