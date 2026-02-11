
import { User } from '../models/user.model';

const API_URL = '/api/admin/users';

import { fetchWithAuth } from '../../../../utils/api';

export const UserService = {
  getAll: async (token: string): Promise<User[]> => {
    const res = await fetchWithAuth(API_URL);
    if (!res.ok) throw new Error("Error fetching users");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  create: async (token: string, user: Partial<User> & { password?: string }): Promise<void> => {
    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      body: JSON.stringify(user)
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error creating user");
    }
  },

  update: async (token: string, id: number, updates: Partial<User> & { current_password?: string; new_password?: string }): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error updating user");
    }
  },

  toggleStatus: async (token: string, id: number, isActive: boolean): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive })
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error updating user status");
    }
  }
};
